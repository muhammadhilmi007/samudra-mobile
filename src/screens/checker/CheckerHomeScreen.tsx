// src/screens/checker/CheckerHomeScreen.tsx
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
  List,
  Divider,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CheckerStackParamList } from '../../types/navigation';
import { RootState, AppDispatch } from '../../store';
import { api } from '../../api/endpoints/api';
import { formatDate } from '../../utils/formatters/dateFormatter';
import AppLoading from '../../components/common/AppLoading';
import AppError from '../../components/common/AppError';
import AppEmpty from '../../components/common/AppEmpty';
import { getSTTStatusColor, getSTTStatusLabel } from '../../utils/formatters/statusFormatter';

type CheckerHomeNavigationProp = NativeStackNavigationProp<
  CheckerStackParamList,
  'CheckerHome'
>;

interface Task {
  id: string;
  type: 'pickup' | 'muat' | 'lansir';
  title: string;
  description: string;
  status: string;
  timestamp: string;
}

interface CheckerStats {
  today: {
    pickedUp: number;
    loaded: number;
    delivered: number;
    total: number;
  };
  pending: {
    pickup: number;
    muat: number;
    lansir: number;
  };
}

const CheckerHomeScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<CheckerHomeNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [stats, setStats] = useState<CheckerStats | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch checker dashboard data
  const fetchCheckerData = async () => {
    try {
      setError(null);
      setIsLoading(true);
      
      // Fetch checker stats
      const statsResponse = await api.get('/checker/stats');
      setStats(statsResponse.data);
      
      // Fetch pending tasks
      const tasksResponse = await api.get('/checker/tasks');
      setTasks(tasksResponse.data);
      
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching checker data:', err);
      setError('Failed to load checker data. Please try again.');
      setIsLoading(false);
    } finally {
      setRefreshing(false);
    }
  };

  // Fetch data when component mounts
  useEffect(() => {
    fetchCheckerData();
  }, []);

  // Handle refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchCheckerData();
  };

  // Navigate to scanner screen
  const navigateToScanner = () => {
    navigation.navigate('CheckerSTTScanner');
  };

  // Navigate to pickup assignment screen
  const navigateToPickupAssign = () => {
    navigation.navigate('CheckerPickupAssign');
  };

  // Navigate to loading assignment screen
  const navigateToLoadingAssign = () => {
    navigation.navigate('CheckerLoadingAssign');
  };

  // Navigate to delivery assignment screen
  const navigateToDeliveryAssign = () => {
    navigation.navigate('CheckerDeliveryAssign');
  };

  if (isLoading && !refreshing) {
    return <AppLoading message="Memuat data checker..." />;
  }

  if (error) {
    return <AppError message={error} onRetry={fetchCheckerData} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Panel Checker</Text>
        <View style={styles.headerRight}>
          <IconButton
            icon="refresh"
            size={24}
            color={theme.colors.primary}
            onPress={onRefresh}
          />
        </View>
      </View>
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Checker Stats */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Statistik Hari Ini</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats?.today.pickedUp || 0}</Text>
                <Text style={styles.statLabel}>Pickup</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats?.today.loaded || 0}</Text>
                <Text style={styles.statLabel}>Muat</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats?.today.delivered || 0}</Text>
                <Text style={styles.statLabel}>Lansir</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.colors.primary }]}>
                  {stats?.today.total || 0}
                </Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
            </View>
            
            <Divider style={styles.divider} />
            
            <Text style={styles.sectionTitle}>Menunggu Pengecekan</Text>
            <View style={styles.pendingContainer}>
              <TouchableOpacity
                style={styles.pendingItem}
                onPress={navigateToPickupAssign}
              >
                <View style={[styles.pendingIcon, { backgroundColor: theme.colors.primary }]}>
                  <MaterialCommunityIcons name="truck-delivery" color="white" size={24} />
                </View>
                <Text style={styles.pendingValue}>{stats?.pending.pickup || 0}</Text>
                <Text style={styles.pendingLabel}>Pickup</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.pendingItem}
                onPress={navigateToLoadingAssign}
              >
                <View style={[styles.pendingIcon, { backgroundColor: theme.colors.accent }]}>
                  <MaterialCommunityIcons name="package-variant" color="white" size={24} />
                </View>
                <Text style={styles.pendingValue}>{stats?.pending.muat || 0}</Text>
                <Text style={styles.pendingLabel}>Muat</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.pendingItem}
                onPress={navigateToDeliveryAssign}
              >
                <View style={[styles.pendingIcon, { backgroundColor: theme.colors.warning }]}>
                  <MaterialCommunityIcons name="truck-fast" color="white" size={24} />
                </View>
                <Text style={styles.pendingValue}>{stats?.pending.lansir || 0}</Text>
                <Text style={styles.pendingLabel}>Lansir</Text>
              </TouchableOpacity>
            </View>
          </Card.Content>
        </Card>
        
        {/* Quick Actions */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Aksi Cepat</Text>
            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={styles.actionItem}
                onPress={navigateToScanner}
              >
                <View style={[styles.actionIcon, { backgroundColor: theme.colors.primary }]}>
                  <MaterialCommunityIcons name="barcode-scan" color="white" size={24} />
                </View>
                <Text style={styles.actionLabel}>Scan STT</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.actionItem}
                onPress={navigateToPickupAssign}
              >
                <View style={[styles.actionIcon, { backgroundColor: theme.colors.accent }]}>
                  <MaterialCommunityIcons name="truck-delivery" color="white" size={24} />
                </View>
                <Text style={styles.actionLabel}>Pickup</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.actionItem}
                onPress={navigateToLoadingAssign}
              >
                <View style={[styles.actionIcon, { backgroundColor: theme.colors.info }]}>
                  <MaterialCommunityIcons name="package-variant" color="white" size={24} />
                </View>
                <Text style={styles.actionLabel}>Muat</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.actionItem}
                onPress={navigateToDeliveryAssign}
              >
                <View style={[styles.actionIcon, { backgroundColor: theme.colors.warning }]}>
                  <MaterialCommunityIcons name="truck-fast" color="white" size={24} />
                </View>
                <Text style={styles.actionLabel}>Lansir</Text>
              </TouchableOpacity>
            </View>
          </Card.Content>
        </Card>
        
        {/* Recent Tasks */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Tugas Terbaru</Text>
            
            {tasks.length === 0 ? (
              <AppEmpty
                title="Tidak ada tugas"
                message="Saat ini tidak ada tugas yang tersedia"
                icon="clipboard-check-outline"
              />
            ) : (
              tasks.map((task) => (
                <TouchableOpacity
                  key={task.id}
                  onPress={() => {
                    // Navigate based on task type
                    if (task.type === 'pickup') {
                      navigation.navigate('CheckerPickupAssign');
                    } else if (task.type === 'muat') {
                      navigation.navigate('CheckerLoadingAssign');
                    } else if (task.type === 'lansir') {
                      navigation.navigate('CheckerDeliveryAssign');
                    }
                  }}
                >
                  <List.Item
                    title={task.title}
                    description={task.description}
                    left={props => (
                      <List.Icon
                        {...props}
                        icon={
                          task.type === 'pickup'
                            ? 'truck-delivery'
                            : task.type === 'muat'
                            ? 'package-variant'
                            : 'truck-fast'
                        }
                        color={
                          task.type === 'pickup'
                            ? theme.colors.primary
                            : task.type === 'muat'
                            ? theme.colors.accent
                            : theme.colors.warning
                        }
                      />
                    )}
                    right={props => (
                      <View style={styles.taskRight}>
                        <Text style={styles.taskTime}>{formatDate(task.timestamp, 'HH:mm')}</Text>
                        <Badge style={[styles.taskBadge, { backgroundColor: getSTTStatusColor(task.status, theme) }]}>
                          {getSTTStatusLabel(task.status)}
                        </Badge>
                      </View>
                    )}
                    style={styles.taskItem}
                  />
                  <Divider />
                </TouchableOpacity>
              ))
            )}
          </Card.Content>
        </Card>
      </ScrollView>
      
      {/* FAB for quick scan */}
      <FAB
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        icon="barcode-scan"
        color="white"
        onPress={navigateToScanner}
      />
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
    paddingVertical: 16,
    backgroundColor: 'white',
    elevation: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 16,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statItem: {
    width: '25%',
    alignItems: 'center',
    paddingVertical: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  divider: {
    marginVertical: 16,
  },
  pendingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  pendingItem: {
    alignItems: 'center',
  },
  pendingIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  pendingValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  pendingLabel: {
    fontSize: 12,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionItem: {
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
  taskItem: {
    paddingLeft: 0,
  },
  taskRight: {
    alignItems: 'flex-end',
    paddingRight: 8,
  },
  taskTime: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 4,
  },
  taskBadge: {
    fontSize: 10,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});

export default CheckerHomeScreen;