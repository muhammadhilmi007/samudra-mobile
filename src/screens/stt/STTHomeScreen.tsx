// src/screens/stt/STTHomeScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {
  Text,
  Card,
  Button,
  Avatar,
  Badge,
  IconButton,
  useTheme,
  FAB,
  Surface,
  Searchbar,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { STTStackParamList } from '../../types/navigation';
import { RootState, AppDispatch } from '../../store';
import { searchSTT, clearSTTError } from '../../store/slices/sttSlice';
import { STT_STATUS } from '../../constants/config';
import { formatDate } from '../../utils/formatters/dateFormatter';
import { getSTTStatusColor, getSTTStatusLabel } from '../../utils/formatters/statusFormatter';
import AppLoading from '../../components/common/AppLoading';
import AppError from '../../components/common/AppError';
import AppEmpty from '../../components/common/AppEmpty';
import STTCard from '../../components/stt/STTCard';

type STTHomeNavigationProp = NativeStackNavigationProp<
  STTStackParamList,
  'STTHome'
>;

const STTHomeScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<STTHomeNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  
  const { sttList, isLoading, error } = useSelector((state: RootState) => state.stt);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch STT data when component mounts
  useEffect(() => {
    fetchSTTData();
    
    // Cleanup
    return () => {
      dispatch(clearSTTError());
    };
  }, [dispatch]);

  // Fetch STT data
  const fetchSTTData = async () => {
    try {
      const params = {
        // Only show STTs from user's branch if they're not admin
        cabangId: user?.role?.namaRole !== 'ADMIN' ? user?.cabangId : undefined,
        // Sort by created date descending
        sort: '-createdAt',
        // Limit to 20 recent STTs
        limit: 20,
      };
      
      await dispatch(searchSTT(params));
    } catch (err) {
      console.error('Error fetching STT data:', err);
    } finally {
      setRefreshing(false);
    }
  };

  // Handle refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchSTTData();
  };

  // Handle search
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      fetchSTTData();
      return;
    }
    
    dispatch(searchSTT({
      noSTT: searchQuery,
      cabangId: user?.role?.namaRole !== 'ADMIN' ? user?.cabangId : undefined,
    }));
  };

  // Handle STT card press
  const handleSTTPress = (stt: any) => {
    navigation.navigate('STTDetails', {
      id: stt._id,
      barcode: stt.barcode,
    });
  };

  // Navigate to STT search
  const navigateToSearch = () => {
    navigation.navigate('STTSearch');
  };

  // Navigate to STT scanner
  const navigateToScanner = () => {
    navigation.navigate('STTScanner');
  };

  // Navigate to create STT
  const navigateToCreateSTT = () => {
    navigation.navigate('CreateSTT');
  };

  // Get STT status counts
  const getSTTStatusCounts = () => {
    const counts = {
      [STT_STATUS.PENDING]: 0,
      [STT_STATUS.MUAT]: 0,
      [STT_STATUS.TRANSIT]: 0,
      [STT_STATUS.LANSIR]: 0,
      [STT_STATUS.TERKIRIM]: 0,
      total: sttList.length,
    };
    
    sttList.forEach(stt => {
      if (counts[stt.status] !== undefined) {
        counts[stt.status]++;
      }
    });
    
    return counts;
  };

  // Get filtered STT list based on search
  const getFilteredSTTList = () => {
    if (!searchQuery.trim()) return sttList;
    
    return sttList.filter(stt =>
      stt.noSTT.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stt.namaBarang.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const statusCounts = getSTTStatusCounts();
  const filteredSTTList = getFilteredSTTList();

  return (
    <View style={styles.container}>
      <Surface style={styles.header}>
        <Text style={styles.title}>Surat Tanda Terima</Text>
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Cari No. STT"
            onChangeText={setSearchQuery}
            value={searchQuery}
            onSubmitEditing={handleSearch}
            style={styles.searchbar}
            icon="magnify"
            clearIcon="close"
            onClearIconPress={() => {
              setSearchQuery('');
              fetchSTTData();
            }}
          />
          <IconButton
            icon="barcode-scan"
            size={24}
            color={theme.colors.primary}
            onPress={navigateToScanner}
            style={styles.scanButton}
          />
        </View>
      </Surface>
      
      {isLoading && !refreshing ? (
        <AppLoading message="Memuat data STT..." fullScreen={false} />
      ) : error ? (
        <AppError message={error} onRetry={fetchSTTData} />
      ) : (
        <>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {/* Status Summary */}
            <Card style={styles.summaryCard}>
              <Card.Content>
                <Text style={styles.sectionTitle}>Ringkasan Status</Text>
                <View style={styles.statusSummary}>
                  <View style={styles.statusItem}>
                    <Text style={styles.statusCount}>{statusCounts.total}</Text>
                    <Text style={styles.statusLabel}>Total</Text>
                  </View>
                  <View style={styles.statusItem}>
                    <Text style={styles.statusCount}>{statusCounts[STT_STATUS.PENDING]}</Text>
                    <Text style={styles.statusLabel}>Menunggu</Text>
                  </View>
                  <View style={styles.statusItem}>
                    <Text style={styles.statusCount}>{statusCounts[STT_STATUS.MUAT]}</Text>
                    <Text style={styles.statusLabel}>Muat</Text>
                  </View>
                  <View style={styles.statusItem}>
                    <Text style={styles.statusCount}>
                      {statusCounts[STT_STATUS.TRANSIT] + statusCounts[STT_STATUS.LANSIR]}
                    </Text>
                    <Text style={styles.statusLabel}>Dikirim</Text>
                  </View>
                  <View style={styles.statusItem}>
                    <Text style={styles.statusCount}>{statusCounts[STT_STATUS.TERKIRIM]}</Text>
                    <Text style={styles.statusLabel}>Selesai</Text>
                  </View>
                </View>
              </Card.Content>
            </Card>
            
            {/* Quick Actions */}
            <Card style={styles.actionsCard}>
              <Card.Content>
                <Text style={styles.sectionTitle}>Aksi Cepat</Text>
                <View style={styles.quickActions}>
                  <TouchableOpacity
                    style={styles.quickAction}
                    onPress={navigateToCreateSTT}
                  >
                    <View style={[styles.actionIcon, { backgroundColor: theme.colors.primary }]}>
                      <MaterialCommunityIcons name="file-plus" size={24} color="white" />
                    </View>
                    <Text style={styles.actionLabel}>Buat STT</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.quickAction}
                    onPress={navigateToScanner}
                  >
                    <View style={[styles.actionIcon, { backgroundColor: theme.colors.accent }]}>
                      <MaterialCommunityIcons name="barcode-scan" size={24} color="white" />
                    </View>
                    <Text style={styles.actionLabel}>Scan STT</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.quickAction}
                    onPress={navigateToSearch}
                  >
                    <View style={[styles.actionIcon, { backgroundColor: theme.colors.info }]}>
                      <MaterialCommunityIcons name="magnify" size={24} color="white" />
                    </View>
                    <Text style={styles.actionLabel}>Cari Detail</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.quickAction}
                    onPress={() => {
                      // Filter by pending status
                      dispatch(searchSTT({
                        status: STT_STATUS.PENDING,
                        cabangId: user?.role?.namaRole !== 'ADMIN' ? user?.cabangId : undefined,
                      }));
                    }}
                  >
                    <View style={[styles.actionIcon, { backgroundColor: theme.colors.warning }]}>
                      <MaterialCommunityIcons name="clock-time-four" size={24} color="white" />
                    </View>
                    <Text style={styles.actionLabel}>Pending</Text>
                  </TouchableOpacity>
                </View>
              </Card.Content>
            </Card>
            
            {/* Recent STT List */}
            <Text style={[styles.sectionTitle, styles.recentTitle]}>
              STT Terbaru
            </Text>
            
            {filteredSTTList.length === 0 ? (
              <AppEmpty
                title="Tidak ada data STT"
                message={searchQuery ? "Tidak ada hasil yang cocok dengan pencarian Anda" : "Belum ada data STT yang tersedia"}
                icon="file-document-outline"
                actionLabel={searchQuery ? "Reset Pencarian" : "Refresh"}
                onAction={searchQuery ? () => {
                  setSearchQuery('');
                  fetchSTTData();
                } : fetchSTTData}
              />
            ) : (
              filteredSTTList.map((stt) => (
                <STTCard
                  key={stt._id}
                  stt={stt}
                  onPress={handleSTTPress}
                  showActions
                />
              ))
            )}
          </ScrollView>
          
          {/* FAB for creating new STT */}
          <FAB
            style={[styles.fab, { backgroundColor: theme.colors.primary }]}
            icon="plus"
            color="white"
            onPress={navigateToCreateSTT}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchbar: {
    flex: 1,
    elevation: 0,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
  scanButton: {
    margin: 0,
    marginLeft: 8,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80, // Space for FAB
  },
  summaryCard: {
    marginBottom: 16,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  statusSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusItem: {
    alignItems: 'center',
  },
  statusCount: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statusLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  actionsCard: {
    marginBottom: 16,
    borderRadius: 8,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAction: {
    alignItems: 'center',
    width: '25%',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  recentTitle: {
    marginTop: 8,
    marginBottom: 8,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});

export default STTHomeScreen;