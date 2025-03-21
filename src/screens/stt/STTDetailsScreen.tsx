// src/screens/stt/STTDetailsScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
} from 'react-native';
import {
  Text,
  Card,
  Button,
  Divider,
  Badge,
  List,
  IconButton,
  Avatar,
  ProgressBar,
  useTheme,
  FAB,
  Menu,
  Dialog,
  Portal,
  RadioButton,
  TextInput,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { STTStackParamList } from '../../types/navigation';
import { RootState, AppDispatch } from '../../store';
import { getSTTByBarcode, updateSTTStatus, setCurrentSTT, clearSTTError } from '../../store/slices/sttSlice';
import { formatCurrency } from '../../utils/formatters/currencyFormatter';
import { formatDate, formatDateTime } from '../../utils/formatters/dateFormatter';
import { 
  getSTTStatusColor, 
  getSTTStatusLabel 
} from '../../utils/formatters/statusFormatter';
import { getPaymentTypeLabel } from '../../utils/formatters/paymentFormatter';
import AppLoading from '../../components/common/AppLoading';
import AppError from '../../components/common/AppError';
import AppHeader from '../../components/common/AppHeader';
import { STT_STATUS } from '../../constants/config';
import { api } from '../../api/endpoints/api';

type STTDetailsNavigationProp = NativeStackNavigationProp<
  STTStackParamList,
  'STTDetails'
>;

type STTDetailsRouteProp = RouteProp<STTStackParamList, 'STTDetails'>;

const STTDetailsScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<STTDetailsNavigationProp>();
  const route = useRoute<STTDetailsRouteProp>();
  const dispatch = useDispatch<AppDispatch>();
  
  const { id, barcode } = route.params;
  const { currentSTT, isLoading, error } = useSelector((state: RootState) => state.stt);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [menuVisible, setMenuVisible] = useState(false);
  const [statusDialogVisible, setStatusDialogVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [receiverName, setReceiverName] = useState('');
  const [notes, setNotes] = useState('');
  const [showReceiverInput, setShowReceiverInput] = useState(false);

  // Fetch STT data
  useEffect(() => {
    const fetchSTT = async () => {
      if (barcode) {
        await dispatch(getSTTByBarcode(barcode));
      } else if (!currentSTT || currentSTT._id !== id) {
        // Ideally there would be a getSTTById action in the slice
        // For now we'll use the API directly
        try {
          const response = await api.get(`/stt/${id}`);
          dispatch(setCurrentSTT(response.data));
        } catch (err) {
          console.error('Error fetching STT:', err);
        }
      }
    };
    
    fetchSTT();
    
    // Cleanup
    return () => {
      dispatch(clearSTTError());
    };
  }, [dispatch, id, barcode, currentSTT]);

  // Get available status transitions based on current status
  const getAvailableStatusTransitions = () => {
    if (!currentSTT) return [];
    
    const currentStatus = currentSTT.status;
    
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
        return [];
      case STT_STATUS.RETURN:
        return [STT_STATUS.PENDING];
      default:
        return [];
    }
  };

  // Check if user has permission to update status
  const canUpdateStatus = () => {
    if (!user || !currentSTT) return false;
    
    // Check user role and permissions
    const hasPermission = user.role?.permissions?.includes('stt:update');
    
    // Check if there are available transitions
    const hasTransitions = getAvailableStatusTransitions().length > 0;
    
    return hasPermission && hasTransitions;
  };

  // Handle status update
  const handleStatusUpdate = async () => {
    if (!selectedStatus || !currentSTT) return;
    
    try {
      const params: any = {
        id: currentSTT._id,
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
      setReceiverName('');
      setNotes('');
      setShowReceiverInput(false);
      
      Alert.alert('Sukses', 'Status STT berhasil diperbarui');
    } catch (err) {
      console.error('Error updating status:', err);
      Alert.alert('Error', 'Gagal memperbarui status STT');
    }
  };

  // Handle share STT
  const handleShare = async () => {
    if (!currentSTT) return;
    
    try {
      const message = `
STT: ${currentSTT.noSTT}
Status: ${getSTTStatusLabel(currentSTT.status)}
Tanggal: ${formatDate(currentSTT.createdAt)}
Pengirim: ${currentSTT.pengirim?.nama || 'Unknown'}
Penerima: ${currentSTT.penerima?.nama || 'Unknown'}
Barang: ${currentSTT.namaBarang}
Jumlah: ${currentSTT.jumlahColly} colly
Berat: ${currentSTT.berat} kg
Total: ${formatCurrency(currentSTT.harga)}
      `;
      
      await Share.share({
        message,
        title: `Samudra ERP - STT ${currentSTT.noSTT}`,
      });
    } catch (err) {
      console.error('Error sharing STT:', err);
    }
  };

  // Render loading state
  if (isLoading) {
    return <AppLoading message="Memuat data STT..." />;
  }

  // Render error state
  if (error) {
    return <AppError message={error} onRetry={() => dispatch(clearSTTError())} />;
  }

  // Render empty state
  if (!currentSTT) {
    return <AppError message="Data STT tidak ditemukan" onRetry={() => navigation.goBack()} />;
  }

  // Calculate status progress
  const calculateProgress = () => {
    const statuses = [
      STT_STATUS.PENDING,
      STT_STATUS.PICKUP,
      STT_STATUS.MUAT,
      STT_STATUS.TRANSIT,
      STT_STATUS.LANSIR,
      STT_STATUS.TERKIRIM,
    ];
    
    const currentIndex = statuses.indexOf(currentSTT.status);
    if (currentIndex === -1) return 0;
    
    return (currentIndex + 1) / statuses.length;
  };

  // Get readable address
  const getAddress = (type: 'sender' | 'receiver') => {
    const entity = type === 'sender' ? currentSTT.pengirim : currentSTT.penerima;
    if (!entity) return 'Alamat tidak tersedia';
    
    return entity.alamat || 'Alamat tidak tersedia';
  };

  return (
    <View style={styles.container}>
      <AppHeader
        title="Detail STT"
        backButton
        rightAction={{
          icon: 'dots-vertical',
          onPress: () => setMenuVisible(true),
        }}
      />
      
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={{ x: 0, y: 0 }}
        style={styles.menu}
      >
        <Menu.Item
          title="Bagikan"
          icon="share-variant"
          onPress={() => {
            setMenuVisible(false);
            handleShare();
          }}
        />
        {canUpdateStatus() && (
          <Menu.Item
            title="Perbarui Status"
            icon="update"
            onPress={() => {
              setMenuVisible(false);
              setStatusDialogVisible(true);
            }}
          />
        )}
        <Menu.Item
          title="Cetak STT"
          icon="printer"
          onPress={() => {
            setMenuVisible(false);
            Alert.alert('Info', 'Fitur cetak belum tersedia di aplikasi mobile');
          }}
        />
      </Menu>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* STT Header */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.sttHeader}>
              <View>
                <Text style={styles.sttNumber}>{currentSTT.noSTT}</Text>
                <Text style={styles.sttDate}>{formatDateTime(currentSTT.createdAt)}</Text>
              </View>
              <Badge
                style={[
                  styles.statusBadge,
                  { backgroundColor: getSTTStatusColor(currentSTT.status, theme) },
                ]}
              >
                {getSTTStatusLabel(currentSTT.status)}
              </Badge>
            </View>
            
            <Divider style={styles.divider} />
            
            <Text style={styles.sectionTitle}>Status Pengiriman</Text>
            <ProgressBar
              progress={calculateProgress()}
              color={getSTTStatusColor(currentSTT.status, theme)}
              style={styles.progressBar}
            />
            <View style={styles.statusSteps}>
              <Text style={styles.statusStep}>Dibuat</Text>
              <Text style={styles.statusStep}>Pickup</Text>
              <Text style={styles.statusStep}>Muat</Text>
              <Text style={styles.statusStep}>Transit</Text>
              <Text style={styles.statusStep}>Diantar</Text>
              <Text style={styles.statusStep}>Terkirim</Text>
            </View>
          </Card.Content>
        </Card>
        
        {/* Package Details */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Detail Barang</Text>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Nama Barang</Text>
              <Text style={styles.detailValue}>{currentSTT.namaBarang}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Jenis Komoditi</Text>
              <Text style={styles.detailValue}>{currentSTT.komoditi}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Kemasan</Text>
              <Text style={styles.detailValue}>{currentSTT.packing}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Jumlah</Text>
              <Text style={styles.detailValue}>{currentSTT.jumlahColly} colly</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Berat</Text>
              <Text style={styles.detailValue}>{currentSTT.berat} kg</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Harga per Kilo</Text>
              <Text style={styles.detailValue}>{formatCurrency(currentSTT.hargaPerKilo)}</Text>
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Total Biaya</Text>
              <Text style={[styles.detailValue, styles.totalValue]}>
                {formatCurrency(currentSTT.harga)}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Metode Pembayaran</Text>
              <Text style={styles.detailValue}>{getPaymentTypeLabel(currentSTT.paymentType)}</Text>
            </View>
            
            {currentSTT.keterangan && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Keterangan</Text>
                <Text style={styles.detailValue}>{currentSTT.keterangan}</Text>
              </View>
            )}
          </Card.Content>
        </Card>
        
        {/* Sender & Receiver */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Pengirim & Penerima</Text>
            
            <List.Item
              title={currentSTT.pengirim?.nama || 'Unknown'}
              description={getAddress('sender')}
              left={(props) => (
                <Avatar.Icon
                  {...props}
                  icon="account-arrow-left"
                  color={theme.colors.surface}
                  style={{ backgroundColor: theme.colors.primary }}
                />
              )}
              style={styles.listItem}
            />
            
            <MaterialCommunityIcons
              name="arrow-down"
              size={24}
              color={theme.colors.primary}
              style={styles.arrowIcon}
            />
            
            <List.Item
              title={currentSTT.penerima?.nama || 'Unknown'}
              description={getAddress('receiver')}
              left={(props) => (
                <Avatar.Icon
                  {...props}
                  icon="account-arrow-right"
                  color={theme.colors.surface}
                  style={{ backgroundColor: theme.colors.accent }}
                />
              )}
              style={styles.listItem}
            />
          </Card.Content>
        </Card>
        
        {/* Route Information */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Rute Pengiriman</Text>
            
            <List.Item
              title={currentSTT.cabangAsal?.namaCabang || 'Unknown'}
              description="Cabang Asal"
              left={(props) => (
                <Avatar.Icon
                  {...props}
                  icon="office-building"
                  color={theme.colors.surface}
                  style={{ backgroundColor: theme.colors.primary }}
                />
              )}
              style={styles.listItem}
            />
            
            <MaterialCommunityIcons
              name="arrow-down"
              size={24}
              color={theme.colors.primary}
              style={styles.arrowIcon}
            />
            
            <List.Item
              title={currentSTT.cabangTujuan?.namaCabang || 'Unknown'}
              description="Cabang Tujuan"
              left={(props) => (
                <Avatar.Icon
                  {...props}
                  icon="office-building-marker"
                  color={theme.colors.surface}
                  style={{ backgroundColor: theme.colors.accent }}
                />
              )}
              style={styles.listItem}
            />
            
            {currentSTT.kodePenerus && currentSTT.kodePenerus !== '70' && (
              <>
                <Divider style={styles.divider} />
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Kode Penerus</Text>
                  <Text style={styles.detailValue}>
                    {currentSTT.kodePenerus} - 
                    {currentSTT.kodePenerus === '71' ? ' Dibayar Pengirim' :
                      currentSTT.kodePenerus === '72' ? ' Dibayar Penerima' :
                      currentSTT.kodePenerus === '73' ? ' Dimajukan Cabang Penerima' : ''}
                  </Text>
                </View>
                
                {currentSTT.penerus && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Penerus</Text>
                    <Text style={styles.detailValue}>{currentSTT.penerus.namaPenerus}</Text>
                  </View>
                )}
              </>
            )}
          </Card.Content>
        </Card>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
    alignSelf: 'flex-start',
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
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  statusSteps: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  statusStep: {
    fontSize: 10,
    opacity: 0.7,
    textAlign: 'center',
    width: 50,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    opacity: 0.7,
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'right',
  },
  totalValue: {
    fontSize: 16,
    color: '#1565C0',
  },
  listItem: {
    padding: 0,
    marginVertical: 8,
  },
  arrowIcon: {
    alignSelf: 'center',
  },
  menu: {
    position: 'absolute',
    top: 60,
    right: 16,
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
});

export default STTDetailsScreen;