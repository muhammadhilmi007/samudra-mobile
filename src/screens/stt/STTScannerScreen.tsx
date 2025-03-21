// src/screens/stt/STTScannerScreen.tsx
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { Text, IconButton, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { STTStackParamList } from '../../types/navigation';
import { RootState, AppDispatch } from '../../store';
import { getSTTByBarcode, clearSTTError } from '../../store/slices/sttSlice';
import BarcodeScanner from '../../components/scanner/BarcodeScanner';
import AppLoading from '../../components/common/AppLoading';

type STTScannerNavigationProp = NativeStackNavigationProp<
  STTStackParamList,
  'STTScanner'
>;

const STTScannerScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<STTScannerNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, scannedSTT, error } = useSelector((state: RootState) => state.stt);
  const [hasScanned, setHasScanned] = useState(false);

  // Clear errors and scanned data when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearSTTError());
    };
  }, [dispatch]);

  // Navigate to STT details when STT is scanned successfully
  useEffect(() => {
    if (scannedSTT && hasScanned) {
      navigation.replace('STTDetails', {
        id: scannedSTT._id,
        barcode: scannedSTT.barcode,
      });
      setHasScanned(false);
    }
  }, [scannedSTT, hasScanned, navigation]);

  // Show error alert if there's an error
  useEffect(() => {
    if (error && hasScanned) {
      Alert.alert('Error', error, [
        {
          text: 'OK',
          onPress: () => {
            dispatch(clearSTTError());
            setHasScanned(false);
          },
        },
      ]);
    }
  }, [error, hasScanned, dispatch]);

  // Handle scan
  const handleScan = async (data: string) => {
    setHasScanned(true);
    await dispatch(getSTTByBarcode(data));
  };

  // Handle close
  const handleClose = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <AppLoading message="Memuat data STT..." fullScreen={false} />
      ) : (
        <BarcodeScanner onScan={handleScan} onClose={handleClose} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});

export default STTScannerScreen;