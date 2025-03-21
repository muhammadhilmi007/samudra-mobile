// src/hooks/useBarcodeScannerPermissions.ts
import { useState, useEffect } from 'react';
import { Alert, Linking, Platform } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

interface BarcodeScannerPermissionsState {
  hasPermission: boolean | null;
  requestPermissions: () => Promise<void>;
  checkPermissions: () => Promise<void>;
  error: string | null;
}

/**
 * Custom hook to manage camera permissions for barcode scanning
 * @returns Permission state and functions to request and check permissions
 */
const useBarcodeScannerPermissions = (): BarcodeScannerPermissionsState => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check permissions when component mounts
  useEffect(() => {
    checkPermissions();
  }, []);

  // Request camera permissions
  const requestPermissions = async (): Promise<void> => {
    try {
      setError(null);
      
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
      
      if (status !== 'granted') {
        setError('Permission to access camera was denied');
        
        // Show alert to explain why camera permission is needed
        Alert.alert(
          'Camera Permission Required',
          'We need camera access to scan barcodes. Please enable camera permissions in your device settings.',
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
      }
    } catch (err) {
      console.error('Error requesting camera permissions:', err);
      setError('Failed to request camera permissions');
      setHasPermission(false);
    }
  };

  // Check if we already have permissions
  const checkPermissions = async (): Promise<void> => {
    try {
      setError(null);
      
      const { status } = await BarCodeScanner.getPermissionsAsync();
      setHasPermission(status === 'granted');
      
      if (status !== 'granted') {
        // Don't show error on initial check
        setHasPermission(false);
      }
    } catch (err) {
      console.error('Error checking camera permissions:', err);
      setError('Failed to check camera permissions');
      setHasPermission(false);
    }
  };

  return { hasPermission, requestPermissions, checkPermissions, error };
};

export default useBarcodeScannerPermissions;