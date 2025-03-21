// src/screens/dashboard/DashboardScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  Text,
  Card,
  Surface,
  useTheme,
  Avatar,
  IconButton,
  Divider,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DashboardStackParamList } from '../../types/navigation';
import { RootState, AppDispatch } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { api } from '../../api/endpoints/api';
import { formatCurrency } from '../../utils/formatters/currencyFormatter';
import { formatDate } from '../../utils/formatters/dateFormatter';
import AppLoading from '../../components/common/AppLoading';
import AppError from '../../components/common/AppError';

interface DashboardData {
  todaySummary: {
    total_stt: number;
    total_revenue: number;
    total_delivery: number;
    total_pickup: number;
  };
  monthSummary: {
    total_stt: number;
    total_revenue: number;
    total_delivery: number;
    pending_stt: number;
  };
  recentSTT: Array<{
    _id: string;
    noSTT: string;
    namaBarang: string;
    status: string;
    createdAt: string;
    cabangAsalId: string;
    cabangTujuanId: string;
    cabangAsal?: {
      namaCabang: string;
    };
    cabangTujuan?: {
      namaCabang: string;
    };
  }>;
  pendingTasks: Array<{
    _id: string;
    type: 'pickup' | 'delivery' | 'loading';
    title: string;
    description: string;
    date: string;
  }>;
}

type DashboardScreenNavigationProp = NativeStackNavigationProp<
  DashboardStackParamList,
  'Dashboard'
>;

const DashboardScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<DashboardScreenNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setError(null);
      const response = await api.get('/dashboard/mobile');
      setDashboardData(response.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Gagal memuat data dashboard. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch data when component mounts
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Handle refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
  };

  // Navigate to profile screen
  const navigateToProfile = () => {
    navigation.navigate('Profile');
  };

  // Navigate to settings screen
  const navigateToSettings = () => {
    navigation.navigate('Settings');
  };

  // Show loading indicator
  if (isLoading) {
    return <AppLoading message="Memuat dashboard..." />;
  }

  // Show error message
  if (error) {
    return <AppError message={error} onRetry={fetchDashboardData} />;
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <Surface style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.userInfo}>
            <Avatar.Text
              size={48}
              label={user?.nama ? user.nama.substring(0, 2).toUpperCase() : 'US'}
              color={theme.colors.surface}
              style={{ backgroundColor: theme.colors.primary }}
            />
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{user?.nama || 'User'}</Text>
              <Text style={styles.userRole}>{user?.jabatan || 'Staff'}</Text>
              <Text style={styles.branchName}>
                {user?.cabang?.namaCabang || 'Cabang Pusat'}
              </Text>
            </View>
          </View>
          <View style={styles.actions}>
            <IconButton
              icon="account-circle"
              size={24}
              onPress={navigateToProfile}
              color={theme.colors.primary}
            />
            <IconButton
              icon="cog"
              size={24}
              onPress={navigateToSettings}
              color={theme.colors.primary}
            />
            <IconButton
              icon="logout"
              size={24}
              onPress={handleLogout}
              color={theme.colors.primary}
            />
          </View>
        </View>
      </Surface>

      {/* Today's Summary */}
      <Card style={styles.summaryCard}>
        <Card.Title
          title="Ringkasan Hari Ini"
          subtitle={formatDate(new Date().toISOString())}
          left={(props) => (
            <Avatar.Icon
              {...props}
              icon="calendar-today"
              color={theme.colors.surface}
              style={{ backgroundColor: theme.colors.primary }}
            />
          )}
        />
        <Card.Content>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                {dashboardData?.todaySummary?.total_stt || 0}
              </Text>
              <Text style={styles.summaryLabel}>STT</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                {dashboardData?.todaySummary?.total_pickup || 0}
              </Text>
              <Text style={styles.summaryLabel}>Pickup</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                {dashboardData?.todaySummary?.total_delivery || 0}
              </Text>
              <Text style={styles.summaryLabel}>Delivery</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: theme.colors.primary }]}>
                {formatCurrency(dashboardData?.todaySummary?.total_revenue || 0, { decimals: 0 })}
              </Text>
              <Text style={styles.summaryLabel}>Pendapatan</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Monthly Summary */}
      <Card style={styles.summaryCard}>
        <Card.Title
          title="Ringkasan Bulan Ini"
          left={(props) => (
            <Avatar.Icon
              {...props}
              icon="calendar-month"
              color={theme.colors.surface}
              style={{ backgroundColor: theme.colors.accent }}
            />
          )}
        />
        <Card.Content>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                {dashboardData?.monthSummary?.total_stt || 0}
              </Text>
              <Text style={styles.summaryLabel}>STT</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                {dashboardData?.monthSummary?.total_delivery || 0}
              </Text>
              <Text style={styles.summaryLabel}>Delivery</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: theme.colors.warning }]}>
                {dashboardData?.monthSummary?.pending_stt || 0}
              </Text>
              <Text style={styles.summaryLabel}>Pending</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: theme.colors.primary }]}>
                {formatCurrency(dashboardData?.monthSummary?.total_revenue || 0, { decimals: 0 })}
              </Text>
              <Text style={styles.summaryLabel}>Pendapatan</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Quick Actions */}
      <Card style={styles.actionsCard}>
        <Card.Title title="Aksi Cepat" />
        <Card.Content>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.quickAction}
              onPress={() => navigation.navigate('Profile')}
            >
              <View style={[styles.actionIcon, { backgroundColor: theme.colors.primary }]}>
                <MaterialCommunityIcons name="account" size={24} color="white" />
              </View>
              <Text style={styles.actionLabel}>Profil</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.quickAction}
              onPress={() => {
                // Navigate to STT Scanner in STT Stack
                // This requires a more complex navigation
                // Using any navigation to bypass TypeScript checking
                (navigation as any).navigate('STTTab', { screen: 'STTScanner' });
              }}
            >
              <View style={[styles.actionIcon, { backgroundColor: theme.colors.accent }]}>
                <MaterialCommunityIcons name="barcode-scan" size={24} color="white" />
              </View>
              <Text style={styles.actionLabel}>Scan STT</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.quickAction}
              onPress={() => {
                // Navigate to STT Search in STT Stack
                (navigation as any).navigate('STTTab', { screen: 'STTSearch' });
              }}
            >
              <View style={[styles.actionIcon, { backgroundColor: theme.colors.info }]}>
                <MaterialCommunityIcons name="magnify" size={24} color="white" />
              </View>
              <Text style={styles.actionLabel}>Cari STT</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.quickAction}
              onPress={navigateToSettings}
            >
              <View style={[styles.actionIcon, { backgroundColor: theme.colors.success }]}>
                <MaterialCommunityIcons name="cog" size={24} color="white" />
              </View>
              <Text style={styles.actionLabel}>Pengaturan</Text>
            </TouchableOpacity>
          </View>
        </Card.Content>
      </Card>

      {/* Pending Tasks */}
      {dashboardData?.pendingTasks && dashboardData.pendingTasks.length > 0 && (
        <Card style={styles.tasksCard}>
          <Card.Title
            title="Tugas Menunggu"
            left={(props) => (
              <Avatar.Icon
                {...props}
                icon="clipboard-list"
                color="white"
                style={{ backgroundColor: theme.colors.warning }}
              />
            )}
          />
          <Card.Content>
            {dashboardData.pendingTasks.map((task) => (
              <TouchableOpacity
                key={task._id}
                style={styles.taskItem}
                onPress={() => {
                  // Handle navigation based on task type
                  switch (task.type) {
                    case 'pickup':
                      (navigation as any).navigate('PickupTab');
                      break;
                    case 'delivery':
                      (navigation as any).navigate('DeliveryTab');
                      break;
                    case 'loading':
                      (navigation as any).navigate('WarehouseTab');
                      break;
                  }
                }}
              >
                <View style={styles.taskIcon}>
                  <MaterialCommunityIcons
                    name={
                      task.type === 'pickup'
                        ? 'truck-delivery'
                        : task.type === 'delivery'
                        ? 'truck-fast'
                        : 'warehouse'
                    }
                    size={20}
                    color={theme.colors.primary}
                  />
                </View>
                <View style={styles.taskContent}>
                  <Text style={styles.taskTitle}>{task.title}</Text>
                  <Text style={styles.taskDescription}>{task.description}</Text>
                  <Text style={styles.taskDate}>{formatDate(task.date)}</Text>
                </View>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={24}
                  color={theme.colors.primary}
                />
              </TouchableOpacity>
            ))}
          </Card.Content>
        </Card>
      )}

      {/* Recent STT */}
      {dashboardData?.recentSTT && dashboardData.recentSTT.length > 0 && (
        <Card style={styles.recentCard}>
          <Card.Title
            title="STT Terbaru"
            left={(props) => (
              <Avatar.Icon
                {...props}
                icon="file-document"
                color="white"
                style={{ backgroundColor: theme.colors.primary }}
              />
            )}
          />
          <Card.Content>
            {dashboardData.recentSTT.map((stt) => (
              <TouchableOpacity
                key={stt._id}
                style={styles.sttItem}
                onPress={() => {
                  // Navigate to STT Details
                  (navigation as any).navigate('STTTab', {
                    screen: 'STTDetails',
                    params: { id: stt._id },
                  });
                }}
              >
                <View style={styles.sttHeader}>
                  <Text style={styles.sttNumber}>{stt.noSTT}</Text>
                  <Text style={styles.sttDate}>{formatDate(stt.createdAt)}</Text>
                </View>
                <View style={styles.sttDetails}>
                  <Text style={styles.sttName} numberOfLines={1}>
                    {stt.namaBarang}
                  </Text>
                  <Text style={styles.sttRoute}>
                    {stt.cabangAsal?.namaCabang || 'Cabang ' + stt.cabangAsalId} →{' '}
                    {stt.cabangTujuan?.namaCabang || 'Cabang ' + stt.cabangTujuanId}
                  </Text>
                </View>
                <View style={[styles.sttStatus, { 
                  backgroundColor: 
                    stt.status === 'TERKIRIM' ? theme.colors.success :
                    stt.status === 'LANSIR' ? theme.colors.info :
                    stt.status === 'PENDING' ? theme.colors.warning :
                    theme.colors.primary 
                }]}>
                  <Text style={styles.sttStatusText}>
                    {stt.status === 'TERKIRIM' ? 'Terkirim' :
                     stt.status === 'LANSIR' ? 'Diantar' :
                     stt.status === 'PENDING' ? 'Menunggu' :
                     stt.status === 'MUAT' ? 'Muat' :
                     stt.status === 'TRANSIT' ? 'Transit' :
                     stt.status === 'RETURN' ? 'Retur' : stt.status}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </Card.Content>
        </Card>
      )}

      {/* App info and version */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Samudra ERP v1.0.0</Text>
        <Text style={styles.footerText}>© PT Sarana Mudah Raya 2025</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 16,
    elevation: 4,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userDetails: {
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userRole: {
    fontSize: 14,
    opacity: 0.7,
  },
  branchName: {
    fontSize: 12,
    opacity: 0.5,
  },
  actions: {
    flexDirection: 'row',
  },
  summaryCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  summaryItem: {
    width: '50%',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  summaryLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  actionsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  quickAction: {
    width: '25%',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  actionLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  tasksCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  taskIcon: {
    marginRight: 12,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  taskDescription: {
    fontSize: 12,
    opacity: 0.7,
  },
  taskDate: {
    fontSize: 10,
    opacity: 0.5,
    marginTop: 4,
  },
  recentCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  sttItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sttHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  sttNumber: {
    fontWeight: 'bold',
  },
  sttDate: {
    fontSize: 12,
    opacity: 0.6,
  },
  sttDetails: {
    marginBottom: 8,
  },
  sttName: {
    fontSize: 14,
  },
  sttRoute: {
    fontSize: 12,
    opacity: 0.7,
  },
  sttStatus: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  sttStatusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    opacity: 0.6,
  },
});

export default DashboardScreen;