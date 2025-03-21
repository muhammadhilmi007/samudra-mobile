// src/hooks/useLocationTracking.ts
import { useState, useEffect, useRef } from 'react';
import { Alert, Platform, Linking } from 'react-native';
import * as Location from 'expo-location';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: number;
}

interface LocationTrackingState {
  location: LocationData | null;
  hasPermission: boolean | null;
  isTracking: boolean;
  error: string | null;
  startTracking: () => Promise<void>;
  stopTracking: () => void;
  requestPermissions: () => Promise<void>;
  getFormattedAddress: (location?: LocationData) => Promise<string | null>;
}

/**
 * Custom hook to handle location tracking functionality
 * @param options Optional configuration options
 * @returns Location tracking state and control functions
 */
const useLocationTracking = (
  options: {
    distanceInterval?: number; // In meters
    timeInterval?: number; // In milliseconds
  } = {}
): LocationTrackingState => {
  const { distanceInterval = 10, timeInterval = 5000 } = options;
  
  const [location, setLocation] = useState<LocationData | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get location tracking setting from Redux
  const { locationTracking } = useSelector((state: RootState) => state.settings);
  
  // Reference to subscription for cleanup
  const locationSubscription = useRef<Location.LocationSubscription | null>(null);

  // Check permissions when component mounts
  useEffect(() => {
    checkPermissions();
    
    // Cleanup on unmount
    return () => {
      stopTracking();
    };
  }, []);

  // Start/stop tracking when locationTracking setting changes
  useEffect(() => {
    if (locationTracking && hasPermission) {
      startTracking();
    } else if (!locationTracking && isTracking) {
      stopTracking();
    }
  }, [locationTracking, hasPermission]);

  // Check if we already have location permissions
  const checkPermissions = async (): Promise<void> => {
    try {
      setError(null);
      
      const { status } = await Location.getForegroundPermissionsAsync();
      setHasPermission(status === 'granted');
      
      // If we have permission and tracking is enabled, start tracking
      if (status === 'granted' && locationTracking) {
        startTracking();
      }
    } catch (err) {
      console.error('Error checking location permissions:', err);
      setError('Failed to check location permissions');
      setHasPermission(false);
    }
  };

  // Request location permissions
  const requestPermissions = async (): Promise<void> => {
    try {
      setError(null);
      
      const { status } = await Location.requestForegroundPermissionsAsync();
      setHasPermission(status === 'granted');
      
      if (status !== 'granted') {
        setError('Permission to access location was denied');
        
        // Show alert to explain why location permission is needed
        Alert.alert(
          'Location Permission Required',
          'We need location access to track delivery and pickup operations. Please enable location permissions in your device settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Open Settings',
              onPress: () => {
                // Open app settings
                if (Platform.OS === 'ios') {
                  Linking.openURL('app-settings:');
                } else {
                  Linking.openSettings();
                }
              },
            },
          ]
        );
      } else if (locationTracking) {
        // If permission granted and tracking is enabled, start tracking
        startTracking();
      }
    } catch (err) {
      console.error('Error requesting location permissions:', err);
      setError('Failed to request location permissions');
      setHasPermission(false);
    }
  };

  // Start location tracking
  const startTracking = async (): Promise<void> => {
    if (!locationTracking) {
      return;
    }
    
    try {
      // Check and request permissions if needed
      if (hasPermission === null) {
        await checkPermissions();
      }
      
      if (hasPermission !== true) {
        await requestPermissions();
        if (hasPermission !== true) {
          return;
        }
      }
      
      // Stop existing tracking if already tracking
      if (isTracking) {
        stopTracking();
      }
      
      // Get initial location
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        accuracy: currentLocation.coords.accuracy || undefined, // Convert null to undefined
        timestamp: currentLocation.timestamp,
      });
      
      // Start watching position
      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval,
          timeInterval,
        },
        (newLocation) => {
          setLocation({
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
            accuracy: currentLocation.coords.accuracy || undefined,
            timestamp: newLocation.timestamp,
          });
        }
      );
      
      setIsTracking(true);
      setError(null);
    } catch (err) {
      console.error('Error starting location tracking:', err);
      setError('Failed to start location tracking');
      setIsTracking(false);
    }
  };

  // Stop location tracking
  const stopTracking = (): void => {
    if (locationSubscription.current) {
      locationSubscription.current.remove();
      locationSubscription.current = null;
    }
    
    setIsTracking(false);
  };

  // Get formatted address from coordinates
  const getFormattedAddress = async (
    locationData?: LocationData
  ): Promise<string | null> => {
    try {
      const targetLocation = locationData || location;
      
      if (!targetLocation) {
        return null;
      }
      
      const result = await Location.reverseGeocodeAsync({
        latitude: targetLocation.latitude,
        longitude: targetLocation.longitude,
      });
      
      if (result && result.length > 0) {
        const address = result[0];
        
        // Format the address
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
    } catch (err) {
      console.error('Error getting formatted address:', err);
      return null;
    }
  };

  return {
    location,
    hasPermission,
    isTracking,
    error,
    startTracking,
    stopTracking,
    requestPermissions,
    getFormattedAddress,
  };
};

export default useLocationTracking;