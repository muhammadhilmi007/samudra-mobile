// src/components/scanner/BarcodeScanner.tsx
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface BarcodeScannerProps {
  onScan: (data: string) => void;
  onClose?: () => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScan, onClose }) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    // Check if data is in the expected format for STT
    if (data.match(/^[A-Z]{3}-\d{6}-\d{4}$/)) {
      onScan(data);
    } else {
      Alert.alert(
        'Format Barcode Tidak Valid', 
        'Barcode yang dipindai tidak dalam format STT yang valid.',
        [
          { 
            text: 'Coba Lagi', 
            onPress: () => setScanned(false)
          }
        ]
      );
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={{ color: theme.colors.surface }}>Meminta izin kamera...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <MaterialCommunityIcons name="camera-off" size={64} color={theme.colors.error} />
        <Text style={[styles.permission, { color: theme.colors.surface }]}>
          Tidak dapat mengakses kamera.
        </Text>
        <Text style={[styles.permissionSubtext, { color: theme.colors.secondary }]}>
          Berikan izin kamera untuk menggunakan pemindai.
        </Text>
        <Button
          mode="contained"
          onPress={onClose}
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          labelStyle={{ color: theme.colors.surface }}
        >
          Kembali
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.scannerContainer}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      
      <View style={styles.overlay}>
        <View style={styles.scannerFrame}>
          <View style={[styles.cornerTL, { borderColor: theme.colors.primary }]} />
          <View style={[styles.cornerTR, { borderColor: theme.colors.primary }]} />
          <View style={[styles.cornerBL, { borderColor: theme.colors.primary }]} />
          <View style={[styles.cornerBR, { borderColor: theme.colors.primary }]} />
        </View>
        
        <Text style={[styles.instructions, { color: theme.colors.surface }]}>
          Arahkan ke barcode pada STT
        </Text>
      </View>

      {scanned && (
        <Button 
          mode="contained" 
          onPress={() => setScanned(false)}
          style={[styles.button, styles.scanButton, { backgroundColor: theme.colors.primary }]}
          labelStyle={{ color: theme.colors.surface }}
        >
          Scan Lagi
        </Button>
      )}
      
      <Button 
        mode="contained" 
        onPress={onClose}
        style={[styles.button, styles.closeButton, { backgroundColor: theme.colors.error }]}
        labelStyle={{ color: theme.colors.surface }}
        icon="close"
      >
        Tutup
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scannerContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerFrame: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  cornerTL: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 30,
    height: 30,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  cornerTR: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 30,
    height: 30,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  cornerBL: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 30,
    height: 30,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  cornerBR: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  instructions: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  button: {
    margin: 16,
  },
  scanButton: {
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
  },
  closeButton: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
  },
  permission: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  permissionSubtext: {
    marginTop: 8,
    marginBottom: 24,
    textAlign: 'center',
    fontSize: 14,
  },
});

export default BarcodeScanner;