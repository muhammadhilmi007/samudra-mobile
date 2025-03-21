// src/screens/checker/CheckerSTTScannerScreen.tsx
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert, ScrollView, TouchableOpacity } from 'react-native';
import {
  Text,
  Button,
  Card,
  Title,
  Paragraph,
  Avatar,
  useTheme,
  Badge,
  List,
  Divider,
  Menu,
  Portal,
  Dialog,
  RadioButton,
  TextInput,
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CheckerStackParamList } from '../../types/navigation';
import { RootState, AppDispatch } from '../../store';
import { getSTTByBarcode, updateSTTStatus, clearSTTError } from '../../store/slices/sttSlice';
import BarcodeScanner from '../../components/scanner/BarcodeScanner';
import AppLoading from '../../components/common/AppLoading';
import AppError from '../../components/common/AppError';
import { formatCurrency } from '../../utils/formatters/currencyFormatter';
import { formatDate } from '../../utils/formatters/dateFormatter';
import { getSTTStatusColor, getSTTStatusLabel } from '../../utils/formatters/statusFormatter';
import { getPaymentTypeLabel } from '../../utils/formatters/paymentFormatter';
import { STT_STATUS } from '../../constants/config';

type CheckerSTTScannerNavigationProp = NativeStackNavigationProp<
  CheckerStackParamList,
  'CheckerSTTScanner'
>;

type CheckerSTTScannerRouteProp = RouteProp<
  CheckerStackParamList,
  'CheckerSTTScanner'
>;

const CheckerSTTScannerScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<CheckerSTTScannerNavigationProp>();
  const route = useRoute<CheckerSTTScannerRouteProp>();
  const dispatch = useDispatch<AppDispatch>();
  
  const { scannedSTT, isLoading, error } = useSelector((state: RootState) => state.stt);
  
  const [hasScanned, setHasScanned] = useState(false);
  const [showScanner, setShowScanner] = useState(true);
  const [statusDialogVisible, setStatusDialogVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [actionMenuVisible, setActionMenuVisible] = useState(false);
  const [notes, setNotes] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [showReceiverInput, setShowReceiverInput] = useState(false);

  // Clear errors and scanned data when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearSTTError());
    };
  }, [dispatch]);

  // Handle barcode scan
  const handleScan = async (barcode: string) => {
    setHasScanned(true);
    setShowScanner(false);
    await dispatch(getSTTByBarcode(barcode));
  };

  // Handle reset scan
  const handleReset = () => {
    setHasScanned(false);
    setShowScanner(true);
    setSelectedStatus(null);
    setNotes('');
    setReceiverName('');
    setShowReceiverInput(false);
  };

  // Get available status transitions based on current status
  const getAvailableStatusTransitions = () => {
    if (!scannedSTT) return [];
    
    const currentStatus = scannedSTT.status;
    
    switch (currentStatus) {
      case STT_STATUS.PENDING:
        return [STT_STATUS.PICKUP, STT_STATUS.MUAT];
      case STT_STATUS.PICKUP:
        return [STT_STATUS.MUAT];
      case STT_STATUS.MUAT:
        return [STT_STATUS.TRANSIT];
      case STT_STATUS.TRANSIT:
        return [STT_STATUS.LANSIR];
      case STT_STATUS.LANSIR:
        return [STT_STATUS.TERKIRIM, STT_STATUS.RETURN];
      case STT_STATUS.TERKIRIM:
        return []; // No further transitions
      case STT_STATUS.RETURN:
        return [STT_STATUS.PENDING]; // Can restart the process
      default:
        return [];
    }
  };

  // Handle status update
  const handleStatusUpdate = async () => {
    if (!selectedStatus || !scannedSTT) return;
    
    try {
      const params: any = {
        id: scannedSTT._id,
        status: selectedStatus,
      };
      
      // If transitioning to TERKIRIM, require receiver name
      if (selectedStatus === STT_STATUS.TERKIRIM) {
        if (!receiverName.trim()) {
          Alert.alert('Error', 'Nama penerima harus diisi');
          return;
        }
        params.namaPenerima = receiverName;
      }
      
      // Add notes if provided
      if (notes.trim()) {
        params.keterangan = notes;
      }
      
      await dispatch(updateSTTStatus(params));
      
      // Close dialog and reset form
      setStatusDialogVisible(false);
      setSelectedStatus(null);
      setNotes('');
      setReceiverInput('');
      
      Alert.alert(
        'Sukses',
        'Status STT berhasil diperbarui',
        [{ text: 'Scan STT Lain', onPress: handleReset }]
      );
    } catch (err) {
      console.error('Error updating status:', err);
      Alert.alert('Error', 'Gagal memperbarui status STT');
    }
  };

  const assignToPickup = () => {
    // Navigate to pickup assignment with this STT
    if (scannedSTT) {
      navigation.navigate('CheckerPickupAssign', { sttId: scannedSTT._id });
    }
  };

  const assignToLoading = () => {
    // Navigate to loading assignment with this STT
    if (scannedSTT) {
      navigation.navigate('CheckerLoadingAssign', { sttId: scannedSTT._id });
    }
  };

  const assignToDelivery = () => {
    // Navigate to delivery assignment with this STT
    if (scannedSTT) {
      navigation.navigate('CheckerDeliveryAssign', { sttId: scannedSTT._id });
    }
  };

  // If scanner is shown
  if (showScanner) {
    return (
      <View style={styles.container}>
        <BarcodeScanner
          onScan={handleScan}
          onClose={() => navigation.goBack()}
        />
      </View>
    );
  }

  // Show loading indicator
  if (isLoading) {
    return <AppLoading message="Memuat data STT..." />;
  }

  // Show error message
  if (error) {
    return (
      <AppError
        message={error}
        onRetry={handleReset}
        retryLabel="Scan Ulang"
      />
    );
  }

  // Show no STT found message
  if (!scannedSTT) {
    return (
      <View style={styles.container}>
        <AppError
          message="STT tidak ditemukan"
          onRetry={handleReset}
          retryLabel="Scan Ulang"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Avatar.Icon
            size={40}
            icon="arrow-left"
            color={theme.colors.primary}
            style={styles.backButton}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Informasi STT</Text>
        <TouchableOpacity onPress={() => setActionMenuVisible(true)}>
          <Avatar.Icon
            size={40}
            icon="dots-vertical"
            color={theme.colors.primary}
            style={styles.menuButton}
          />
        </TouchableOpacity>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* STT Header Card */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.sttHeader}>
              <View>
                <Text style={styles.sttNumber}>{scannedSTT.noSTT}</Text>
                <Text style={styles.sttDate}>{formatDate(scannedSTT.createdAt)}</Text>
              </View>
              <Badge
                style={[
                  styles.statusBadge,
                  { backgroundColor: getSTTStatusColor(scannedSTT.status, theme) },
                ]}
              >
                {getSTTStatusLabel(scannedSTT.status)}
              </Badge>
            </View>
            
            <Divider style={styles.divider} />
            
            <Text style={styles.sectionTitle}>Informasi Pengiriman</Text>
            
            <View style={styles.infoContainer}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Asal</Text>
                <Text style={styles.infoValue}>
                  {scannedSTT.cabangAsal?.namaCabang || 'Cabang ' + scannedSTT.cabangAsalId}
                </Text>
              </View>
              
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Tujuan</Text>
                <Text style={styles.infoValue}>
                  {scannedSTT.cabangTujuan?.namaCabang || 'Cabang ' + scannedSTT.cabangTujuanId}
                </Text>
              </View>
              
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Pengirim</Text>
                <Text style={styles.infoValue}>
                  {scannedSTT.pengirim?.nama || 'Pengirim ' + scannedSTT.pengirimId}
                </Text>
              </View>
              
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Penerima</Text>
                <Text style={styles.infoValue}>
                  {scannedSTT.penerima?.nama || 'Penerima ' + scannedSTT.penerimaId}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
        
        {/* Goods Information Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Detail Barang</Text>
            
            <View style={styles.infoContainer}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Nama Barang</Text>
                <Text style={styles.infoValue}>{scannedSTT.namaBarang}</Text>
              </View>
              
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Komoditi</Text>
                <Text style={styles.infoValue}>{scannedSTT.komoditi}</Text>
              </View>
              
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Jumlah</Text>
                <Text style={styles.infoValue}>{scannedSTT.jumlahColly} colly</Text>
              </View>
              
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Berat</Text>
                <Text style={styles.infoValue}>{scannedSTT.berat} kg</Text>
              </View>
              
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Pembayaran</Text>
                <Text style={styles.infoValue}>{getPaymentTypeLabel(scannedSTT.paymentType)}</Text>
              </View>
              
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Total Biaya</Text>
                <Text style={[styles.infoValue, styles.totalValue]}>
                  {formatCurrency(scannedSTT.harga)}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
        
        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            mode="contained"
            icon="update"
            onPress={() => setStatusDialogVisible(true)}
            style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
            disabled={getAvailableStatusTransitions().length === 0}
          >
            Perbarui Status
          </Button>
          
          <Button
            mode="outlined"
            icon="barcode-scan"
            onPress={handleReset}
            style={styles.actionButton}
            color={theme.colors.primary}
          >
            Scan STT Lain
          </Button>
        </View>
      </ScrollView>
      
      {/* Status Update Dialog */}
      <Portal>
        <Dialog
          visible={statusDialogVisible}
          onDismiss={() => setStatusDialogVisible(false)}
          style={styles.dialog}
        >
          <Dialog.Title>Perbarui Status STT</Dialog.Title>
          <Dialog.Content>
            <RadioButton.Group
              onValueChange={(value) => {
                setSelectedStatus(value);
                // Show receiver input if transitioning to TERKIRIM
                setShowReceiverInput(value === STT_STATUS.TERKIRIM);
              }}
              value={selectedStatus || ''}
            >
              {getAvailableStatusTransitions().map((status) => (
                <RadioButton.Item
                  key={status}
                  label={getSTTStatusLabel(status)}
                  value={status}
                  style={styles.radioItem}
                />
              ))}
            </RadioButton.Group>
            
            {showReceiverInput && (
              <TextInput
                label="Nama Penerima"
                value={receiverName}
                onChangeText={setReceiverName}
                style={styles.textInput}
                mode="outlined"
              />
            )}
            
            <TextInput
              label="Catatan (Opsional)"
              value={notes}
              onChangeText={setNotes}
              style={styles.textInput}
              multiline
              mode="outlined"
              numberOfLines={3}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setStatusDialogVisible(false)}>Batal</Button>
            <Button
              mode="contained"
              onPress={handleStatusUpdate}
              disabled={!selectedStatus}
            >
              Simpan
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      
      {/* Action Menu */}
      <Menu
        visible={actionMenuVisible}
        onDismiss={() => setActionMenuVisible(false)}
        anchor={{ x: 0, y: 0 }}
        style={styles.menu}
      >
        <Menu.Item
          title="Assign ke Pickup"
          icon="truck-delivery"
          onPress={() => {
            setActionMenuVisible(false);
            assignToPickup();
          }}
          disabled={scannedSTT.status !== STT_STATUS.PENDING}
        />
        <Menu.Item
          title="Assign ke Muat"
          icon="package-variant"
          onPress={() => {
            setActionMenuVisible(false);
            assignToLoading();
          }}
          disabled={scannedSTT.status !== STT_STATUS.PENDING && scannedSTT.status !== STT_STATUS.PICKUP}
        />
        <Menu.Item
          title="Assign ke Lansir"
          icon="truck-fast"
          onPress={() => {
            setActionMenuVisible(false);
            assignToDelivery();
          }}
          disabled={scannedSTT.status !== STT_STATUS.TRANSIT}
        />
        <Divider />
        <Menu.Item
          title="Reset Scanner"
          icon="refresh"
          onPress={() => {
            setActionMenuVisible(false);
            handleReset();
          }}
        />
      </Menu>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'white',
    elevation: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: 'transparent',
  },
  menuButton: {
    backgroundColor: 'transparent',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    marginBottom: 16,
    borderRadius: 8,
  },
  sttHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  sttNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sttDate: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  divider: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  infoItem: {
    width: '50%',
    marginBottom: 12,
    paddingRight: 8,
  },
  infoLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 16,
    color: '#1565C0',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  dialog: {
    borderRadius: 12,
  },
  radioItem: {
    paddingVertical: 8,
  },
  textInput: {
    marginTop: 16,
  },
  menu: {
    position: 'absolute',
    top: 60,
    right: 16,
  },
});

export default CheckerSTTScannerScreen;