// src/services/OfflineManager.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { v4 as uuidv4 } from 'uuid';
import { api } from '../api/endpoints/api';

interface OfflineAction {
  id: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data: any;
  timestamp: number;
  priority: number; // Higher number = higher priority
  retryCount: number;
  maxRetries: number;
}

const OFFLINE_QUEUE_KEY = '@samudra_offline_queue';
const MAX_QUEUE_SIZE = 100; // Prevent excessive storage usage
const DEFAULT_MAX_RETRIES = 5;

class OfflineManager {
  private queue: OfflineAction[] = [];
  private isOnline: boolean = true;
  private isSyncing: boolean = false;
  private unsubscribeNetInfo: any = null;

  constructor() {
    this.initNetworkListener();
    this.loadQueue();
  }

  /**
   * Initialize network connectivity listener
   */
  private initNetworkListener() {
    this.unsubscribeNetInfo = NetInfo.addEventListener(state => {
      const newOnlineStatus = state.isConnected && state.isInternetReachable;
      
      // Only trigger sync when transitioning from offline to online
      if (!this.isOnline && newOnlineStatus) {
        this.syncOfflineActions();
      }
      
      this.isOnline = !!newOnlineStatus;
    });
  }

  /**
   * Load offline queue from AsyncStorage
   */
  private async loadQueue() {
    try {
      const queueData = await AsyncStorage.getItem(OFFLINE_QUEUE_KEY);
      
      if (queueData) {
        this.queue = JSON.parse(queueData);
        
        // Check if we're online and can sync immediately
        const networkState = await NetInfo.fetch();
        this.isOnline = !!(networkState.isConnected && networkState.isInternetReachable);
        
        if (this.isOnline && this.queue.length > 0) {
          this.syncOfflineActions();
        }
      }
    } catch (error) {
      console.error('Error loading offline queue:', error);
    }
  }

  /**
   * Save queue to AsyncStorage
   */
  private async saveQueue() {
    try {
      await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(this.queue));
    } catch (error) {
      console.error('Error saving offline queue:', error);
    }
  }

  /**
   * Add an action to the offline queue
   * @param endpoint API endpoint
   * @param method HTTP method
   * @param data Request data
   * @param priority Priority level (higher = more important)
   * @param maxRetries Maximum retry attempts
   * @returns ID of the queued action
   */
  public async queueAction(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    data: any = null,
    priority: number = 1,
    maxRetries: number = DEFAULT_MAX_RETRIES
  ): Promise<string> {
    // If we're online, try to execute immediately
    if (this.isOnline) {
      try {
        await this.executeAction(endpoint, method, data);
        return 'immediate';
      } catch (error) {
        // Failed even though we're "online" - queue it
        console.log('Failed immediate execution, queueing for later', error);
      }
    }
    
    // Add to queue
    const actionId = uuidv4();
    const action: OfflineAction = {
      id: actionId,
      endpoint,
      method,
      data,
      timestamp: Date.now(),
      priority,
      retryCount: 0,
      maxRetries,
    };
    
    // Prevent queue from growing too large
    if (this.queue.length >= MAX_QUEUE_SIZE) {
      // Remove lowest priority, oldest item
      const sortedQueue = [...this.queue].sort((a, b) => {
        if (a.priority === b.priority) {
          return a.timestamp - b.timestamp; // Older first
        }
        return a.priority - b.priority; // Lower priority first
      });
      
      this.queue = sortedQueue.slice(1); // Remove the first item (lowest priority/oldest)
    }
    
    this.queue.push(action);
    await this.saveQueue();
    
    return actionId;
  }

  /**
   * Execute a single action against the API
   * @param endpoint API endpoint
   * @param method HTTP method
   * @param data Request data
   * @returns API response
   */
  private async executeAction(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    data: any = null
  ) {
    switch (method) {
      case 'GET':
        return await api.get(endpoint, { params: data });
      case 'POST':
        return await api.post(endpoint, data);
      case 'PUT':
        return await api.put(endpoint, data);
      case 'DELETE':
        return await api.delete(endpoint, { data });
      default:
        throw new Error(`Unsupported method: ${method}`);
    }
  }

  /**
   * Process the offline queue when connection is restored
   */
  public async syncOfflineActions() {
    // Prevent multiple syncs running simultaneously
    if (this.isSyncing || this.queue.length === 0 || !this.isOnline) {
      return;
    }
    
    this.isSyncing = true;
    
    try {
      // Sort by priority (high to low) and then by timestamp (old to new)
      const sortedQueue = [...this.queue].sort((a, b) => {
        if (a.priority === b.priority) {
          return a.timestamp - b.timestamp;
        }
        return b.priority - a.priority;
      });
      
      const successfulIds: string[] = [];
      const failedActions: OfflineAction[] = [];
      
      // Process each action
      for (const action of sortedQueue) {
        try {
          await this.executeAction(action.endpoint, action.method, action.data);
          successfulIds.push(action.id);
        } catch (error) {
          console.error('Error executing offline action:', error);
          
          // Increment retry count
          const updatedAction = {
            ...action,
            retryCount: action.retryCount + 1,
          };
          
          // If we haven't reached max retries, keep in queue
          if (updatedAction.retryCount < updatedAction.maxRetries) {
            failedActions.push(updatedAction);
          } else {
            // TODO: Could notify user that some actions failed permanently
            console.warn('Action exceeded max retries and was dropped:', action);
          }
        }
      }
      
      // Update queue with only failed actions
      this.queue = failedActions;
      await this.saveQueue();
      
      // Notify about successful syncs if needed
      if (successfulIds.length > 0) {
        console.log(`Successfully synced ${successfulIds.length} offline actions`);
      }
    } catch (error) {
      console.error('Error during offline sync:', error);
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Remove a specific action from the queue
   * @param id Action ID to remove
   */
  public async removeAction(id: string) {
    this.queue = this.queue.filter(action => action.id !== id);
    await this.saveQueue();
  }

  /**
   * Clear the entire offline queue
   */
  public async clearQueue() {
    this.queue = [];
    await this.saveQueue();
  }

  /**
   * Get the current offline queue
   * @returns The current queue of offline actions
   */
  public getQueue(): OfflineAction[] {
    return [...this.queue];
  }

  /**
   * Get the count of pending offline actions
   * @returns Number of actions in the queue
   */
  public getQueueSize(): number {
    return this.queue.length;
  }

  /**
   * Check if device is currently online
   * @returns Online status
   */
  public isNetworkOnline(): boolean {
    return this.isOnline;
  }

  /**
   * Clean up resources
   */
  public destroy() {
    if (this.unsubscribeNetInfo) {
      this.unsubscribeNetInfo();
    }
  }
}

// Create a singleton instance
const offlineManager = new OfflineManager();

export default offlineManager;