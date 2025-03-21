// src/services/LocationService.ts
import * as Location from 'expo-location';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number;
  heading?: number;
  speed?: number;
  timestamp: number;
}

interface LocationUpdateHandler {
  (location: LocationData): void;
}

class LocationService {
  private isTracking: boolean = false;
  private locationSubscription: Location.LocationSubscription | null = null;
  private lastKnownLocation: LocationData | null = null;
  private updateHandlers: LocationUpdateHandler[] = [];
  private distanceInterval: number = 10; // in meters
  private timeInterval: number = 5000; // in milliseconds

  /**
   * Initialize location service 
   */
  constructor() {
    this.loadLastKnownLocation();
  }

  /**
   * Load the last known location from storage
   */
  private async loadLastKnownLocation() {
    try {
      const locationJson = await AsyncStorage.getItem('@samudra_last_location');
      if (locationJson) {
        this.lastKnownLocation = JSON.parse(locationJson);
      }
    } catch (error) {
      console.error('Error loading last known location:', error);
    }
  }

  /**
   * Save the last known location to storage
   * @param location Location data to save
   */
  private async saveLastKnownLocation(location: LocationData) {
    try {
      await AsyncStorage.setItem('@samudra_last_location', JSON.stringify(location));
      this.lastKnownLocation = location;
    } catch (error) {
      console.error('Error saving last known location:', error);
    }
  }

  /**
   * Request location permissions
   * @returns Whether permission is granted
   */
  public async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status === 'granted') {
        // If foreground permission is granted, try to get background permission too
        if (Platform.OS === 'android') {
          const backgroundStatus = await Location.requestBackgroundPermissionsAsync();
          // We don't require background permission to continue, but it's nice to have
          console.log('Background location permission:', backgroundStatus.status);
        }
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error requesting location permissions:', error);
      return false;
    }
  }

  /**
   * Check if location permissions are granted
   * @returns Whether permission is granted
   */
  public async checkPermissions(): Promise<boolean> {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error checking location permissions:', error);
      return false;
    }
  }

  /**
   * Start tracking location
   * @param options Configuration options
   * @returns Whether tracking was started
   */
  public async startTracking(options: { 
    distanceInterval?: number; 
    timeInterval?: number;
  } = {}): Promise<boolean> {
    if (this.isTracking) {
      return true; // Already tracking
    }

    try {
      const hasPermission = await this.checkPermissions();
      if (!hasPermission) {
        const granted = await this.requestPermissions();
        if (!granted) {
          return false;
        }
      }

      // Apply custom options if provided
      if (options.distanceInterval) {
        this.distanceInterval = options.distanceInterval;
      }
      if (options.timeInterval) {
        this.timeInterval = options.timeInterval;
      }

      // Get current position first
      const currentPosition = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const locationData: LocationData = {
        latitude: currentPosition.coords.latitude,
        longitude: currentPosition.coords.longitude,
        accuracy: currentPosition.coords.accuracy || undefined,
        altitude: currentPosition.coords.altitude || undefined,
        heading: currentPosition.coords.heading || undefined,
        speed: currentPosition.coords.speed || undefined,
        timestamp: currentPosition.timestamp,
      };

      // Save and notify about the initial position
      await this.saveLastKnownLocation(locationData);
      this.notifyLocationUpdate(locationData);

      // Start watching position
      this.locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: this.distanceInterval,
          timeInterval: this.timeInterval,
        },
        (location) => {
          const newLocationData: LocationData = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            accuracy: location.coords.accuracy || undefined,
            altitude: location.coords.altitude || undefined,
            heading: location.coords.heading || undefined,
            speed: location.coords.speed || undefined,
            timestamp: location.timestamp,
          };

          this.saveLastKnownLocation(newLocationData);
          this.notifyLocationUpdate(newLocationData);
        }
      );

      this.isTracking = true;
      return true;
    } catch (error) {
      console.error('Error starting location tracking:', error);
      return false;
    }
  }

  /**
   * Stop tracking location
   */
  public stopTracking() {
    if (this.locationSubscription) {
      this.locationSubscription.remove();
      this.locationSubscription = null;
    }
    this.isTracking = false;
  }

  /**
   * Get the last known location
   * @returns Last known location or null
   */
  public getLastKnownLocation(): LocationData | null {
    return this.lastKnownLocation;
  }

  /**
   * Get the current location
   * @returns Promise resolving to current location
   */
  public async getCurrentLocation(): Promise<LocationData | null> {
    try {
      const hasPermission = await this.checkPermissions();
      if (!hasPermission) {
        const granted = await this.requestPermissions();
        if (!granted) {
          return null;
        }
      }

      const currentPosition = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const locationData: LocationData = {
        latitude: currentPosition.coords.latitude,
        longitude: currentPosition.coords.longitude,
        accuracy: currentPosition.coords.accuracy || undefined,
        altitude: currentPosition.coords.altitude || undefined,
        heading: currentPosition.coords.heading || undefined,
        speed: currentPosition.coords.speed || undefined,
        timestamp: currentPosition.timestamp,
      };

      await this.saveLastKnownLocation(locationData);
      return locationData;
    } catch (error) {
      console.error('Error getting current location:', error);
      return null;
    }
  }

  /**
   * Register a handler to be called when location updates
   * @param handler Function to call with updated location
   * @returns Handler ID for unregistering
   */
  public registerLocationUpdateHandler(handler: LocationUpdateHandler): number {
    this.updateHandlers.push(handler);
    return this.updateHandlers.length - 1;
  }

  /**
   * Unregister a location update handler
   * @param handlerId Handler ID from registerLocationUpdateHandler
   */
  public unregisterLocationUpdateHandler(handlerId: number) {
    if (handlerId >= 0 && handlerId < this.updateHandlers.length) {
      this.updateHandlers[handlerId] = () => {}; // Replace with no-op
    }
  }

  /**
   * Notify all registered handlers about a location update
   * @param location Updated location data
   */
  private notifyLocationUpdate(location: LocationData) {
    this.updateHandlers.forEach(handler => {
      try {
        handler(location);
      } catch (error) {
        console.error('Error in location update handler:', error);
      }
    });
  }

  /**
   * Get the distance between two coordinates in meters
   * @param lat1 Latitude of first point
   * @param lon1 Longitude of first point
   * @param lat2 Latitude of second point
   * @param lon2 Longitude of second point
   * @returns Distance in meters
   */
  public getDistanceBetween(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    // Haversine formula to calculate distance between two points
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
  }

  /**
   * Get a formatted address from coordinates
   * @param latitude Latitude
   * @param longitude Longitude
   * @returns Promise resolving to formatted address
   */
  public async getAddressFromCoordinates(
    latitude: number,
    longitude: number
  ): Promise<string | null> {
    try {
      const result = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (result && result.length > 0) {
        const address = result[0];
        const addressParts = [
          address.name,
          address.street,
          address.district,
          address.subregion,
          address.city,
          address.region,
          address.postalCode,
          address.country,
        ].filter(Boolean);

        return addressParts.join(', ');
      }

      return null;
    } catch (error) {
      console.error('Error getting address from coordinates:', error);
      return null;
    }
  }
}

// Create a singleton instance
const locationService = new LocationService();

export default locationService;