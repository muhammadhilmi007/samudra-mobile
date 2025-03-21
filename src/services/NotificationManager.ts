// src/services/NotificationManager.ts
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { v4 as uuidv4 } from 'uuid';
import { navigateFromNotification } from '../navigation/navigationHelpers';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

interface NotificationData {
  type: 'stt' | 'pickup' | 'delivery' | 'warehouse' | 'admin' | 'generic';
  title: string;
  body: string;
  data: Record<string, any>;
}

class NotificationManager {
  private pushToken: string | null = null;
  private isInitialized: boolean = false;
  private pendingNavigation: { route: string; params: any } | null = null;
  
  /**
   * Initialize the notification manager
   * @returns Promise resolving to push token
   */
  public async initialize(): Promise<string | null> {
    if (this.isInitialized) {
      return this.pushToken;
    }
    
    try {
      // Check if we already have a stored token
      const storedToken = await AsyncStorage.getItem('@push_token');
      if (storedToken) {
        this.pushToken = storedToken;
      }
      
      // Request permission
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      // If not granted, exit early
      if (finalStatus !== 'granted') {
        console.log('Push notification permission not granted');
        return null;
      }
      
      // Get Expo push token
      let token;
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'Default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#1565C0',
        });
      }
      
      token = (await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId ?? undefined,
      })).data;
      
      this.pushToken = token;
      
      // Store the token
      await AsyncStorage.setItem('@push_token', token);
      
      // Set up notification event listeners
      Notifications.addNotificationReceivedListener(this.handleNotificationReceived);
      Notifications.addNotificationResponseReceivedListener(this.handleNotificationResponse);
      
      this.isInitialized = true;
      
      return token;
    } catch (error) {
      console.error('Error initializing push notifications:', error);
      return null;
    }
  }
  
  /**
   * Handle received notification
   * @param notification Notification received event
   */
  private handleNotificationReceived = (notification: Notifications.Notification) => {
    // Handle notification when app is in foreground
    console.log('Notification received in foreground:', notification);
  }
  
  /**
   * Handle notification response (user tapping on notification)
   * @param response Notification response event
   */
  private handleNotificationResponse = (response: Notifications.NotificationResponse) => {
    const data = response.notification.request.content.data;
    
    // Navigate to appropriate screen based on notification type
    if (data && data.type) {
      switch (data.type) {
        case 'stt':
          if (data.sttId) {
            navigateFromNotification('STTDetails', { id: data.sttId });
          } else {
            navigateFromNotification('STTHome', {});
          }
          break;
          
        case 'pickup':
          if (data.pickupId) {
            navigateFromNotification('PickupDetails', { id: data.pickupId });
          } else if (data.requestId) {
            navigateFromNotification('PickupRequestDetails', { id: data.requestId });
          } else {
            navigateFromNotification('PickupHome', {});
          }
          break;
          
        case 'delivery':
          if (data.deliveryId) {
            navigateFromNotification('DeliveryDetails', { id: data.deliveryId });
          } else {
            navigateFromNotification('DeliveryHome', {});
          }
          break;
          
        case 'warehouse':
          if (data.loadingId) {
            navigateFromNotification('LoadingDetails', { id: data.loadingId });
          } else {
            navigateFromNotification('WarehouseHome', {});
          }
          break;
          
        default:
          navigateFromNotification('Dashboard', {});
      }
    }
  }
  
  /**
   * Schedule a local notification
   * @param notificationData Notification data
   * @param delay Delay in seconds before showing the notification
   * @returns Notification identifier
   */
  public async scheduleLocalNotification(
    notificationData: NotificationData,
    delay: number = 0
  ): Promise<string> {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: notificationData.title,
          body: notificationData.body,
          data: { 
            id: uuidv4(),
            ...notificationData.data,
            type: notificationData.type,
          },
          sound: true,
        },
        trigger: delay > 0 ? { seconds: delay } : null,
      });
      
      return notificationId;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      throw error;
    }
  }
  
  /**
   * Send a push notification to the server to be delivered to specific users
   * @param notificationData Notification data
   * @param userIds User IDs to send notification to
   * @returns Response from API
   */
  public async sendPushNotification(
    notificationData: NotificationData,
    userIds: string[]
  ): Promise<any> {
    try {
      // This would typically call your backend API
      // which would then use FCM or Expo Push Service to deliver notifications
      const response = await fetch('https://api.samudrapaket.com/api/notifications/push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userIds,
          notification: {
            title: notificationData.title,
            body: notificationData.body,
            data: {
              id: uuidv4(),
              ...notificationData.data,
              type: notificationData.type,
            },
          },
        }),
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error sending push notification:', error);
      throw error;
    }
  }
  
  /**
   * Cancel a scheduled notification
   * @param notificationId Notification identifier
   */
  public async cancelNotification(notificationId: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }
  
  /**
   * Cancel all scheduled notifications
   */
  public async cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }
  
  /**
   * Get all scheduled notifications
   * @returns List of scheduled notifications
   */
  public async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    return await Notifications.getAllScheduledNotificationsAsync();
  }
  
  /**
   * Get all delivered notifications
   * @returns List of delivered notifications
   */
  public async getDeliveredNotifications(): Promise<Notifications.Notification[]> {
    return await Notifications.getPresentedNotificationsAsync();
  }
  
  /**
   * Clear all delivered notifications
   */
  public async clearDeliveredNotifications(): Promise<void> {
    await Notifications.dismissAllNotificationsAsync();
  }
  
  /**
   * Register device token with server
   * @param userId User ID
   * @returns Response from API
   */
  public async registerDeviceToken(userId: string): Promise<any> {
    if (!this.pushToken) {
      await this.initialize();
    }
    
    if (!this.pushToken) {
      throw new Error('Push token not available');
    }
    
    try {
      // Call your API to register the device token
      const response = await fetch('https://api.samudrapaket.com/api/users/register-device', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          deviceToken: this.pushToken,
          platform: Platform.OS,
          appVersion: Constants.expoConfig?.version || '1.0.0',
        }),
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error registering device token:', error);
      throw error;
    }
  }
  
  /**
   * Unregister device token from server
   * @returns Response from API
   */
  public async unregisterDeviceToken(): Promise<any> {
    if (!this.pushToken) {
      return { success: true, message: 'No token to unregister' };
    }
    
    try {
      // Call your API to unregister the device token
      const response = await fetch('https://api.samudrapaket.com/api/users/unregister-device', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deviceToken: this.pushToken,
        }),
      });
      
      // Clear stored token
      await AsyncStorage.removeItem('@push_token');
      this.pushToken = null;
      
      return await response.json();
    } catch (error) {
      console.error('Error unregistering device token:', error);
      throw error;
    }
  }
}

// Create a singleton instance
const notificationManager = new NotificationManager();

export default notificationManager;