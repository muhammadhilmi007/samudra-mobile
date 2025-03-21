// src/components/warehouse/TruckQueueCard.tsx
import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Card, Text, Badge, useTheme, Divider, Avatar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TruckQueue } from '../../types/models/warehouse';
import { formatDate } from '../../utils/formatters/dateFormatter';
import { getTruckQueueStatusColor, getTruckQueueStatusLabel } from '../../utils/formatters/statusFormatter';

interface TruckQueueCardProps {
  truckQueue: TruckQueue;
  onPress?: (truckQueue: TruckQueue) => void;
  showActions?: boolean;
  queueNumber?: number;
}

const TruckQueueCard: React.FC<TruckQueueCardProps> = ({
  truckQueue,
  onPress,
  showActions = false,
  queueNumber,
}) => {
  const theme = useTheme();

  const handlePress = () => {
    if (onPress) {
      onPress(truckQueue);
    }
  };

  return (
    <Card style={styles.card} onPress={handlePress}>
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {queueNumber !== undefined && (
              <View style={[styles.queueNumber, { backgroundColor: theme.colors.primary }]}>
                <Text style={styles.queueNumberText}>{queueNumber}</Text>
              </View>
            )}
            <View style={styles.truckInfo}>
              <Text style={styles.truckName}>
                {truckQueue.truck?.namaKendaraan || 'Truck'}
              </Text>
              <Text style={styles.licensePlate}>
                {truckQueue.truck?.noPolisi || 'No. Polisi tidak tersedia'}
              </Text>
            </View>
          </View>
          
          <Badge
            style={[
              styles.statusBadge,
              { backgroundColor: getTruckQueueStatusColor(truckQueue.status, theme) },
            ]}
          >
            {getTruckQueueStatusLabel(truckQueue.status)}
          </Badge>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name="account"
                size={20}
                color={theme.colors.primary}
              />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Supir</Text>
              <Text style={styles.detailValue}>
                {truckQueue.supir?.nama || 'Supir tidak tersedia'}
              </Text>
            </View>
          </View>

          {truckQueue.noTelp && (
            <View style={styles.detailRow}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons
                  name="phone"
                  size={20}
                  color={theme.colors.primary}
                />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Telepon Supir</Text>
                <Text style={styles.detailValue}>{truckQueue.noTelp}</Text>
              </View>
            </View>
          )}

          {truckQueue.kenek && (
            <View style={styles.detailRow}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons
                  name="account-outline"
                  size={20}
                  color={theme.colors.primary}
                />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Kenek</Text>
                <Text style={styles.detailValue}>
                  {truckQueue.kenek?.nama || 'Kenek tidak tersedia'}
                </Text>
              </View>
            </View>
          )}

          <View style={styles.detailRow}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name="calendar"
                size={20}
                color={theme.colors.primary}
              />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Tanggal Antri</Text>
              <Text style={styles.detailValue}>{formatDate(truckQueue.createdAt)}</Text>
            </View>
          </View>
        </View>

        {showActions && (
          <>
            <Divider style={styles.divider} />
            <View style={styles.actionContainer}>
              <TouchableOpacity style={styles.actionButton}>
                <MaterialCommunityIcons
                  name="eye"
                  size={20}
                  color={theme.colors.primary}
                />
                <Text style={[styles.actionText, { color: theme.colors.primary }]}>Detail</Text>
              </TouchableOpacity>
              
              {truckQueue.status === 'MENUNGGU' && (
                <TouchableOpacity style={styles.actionButton}>
                  <MaterialCommunityIcons
                    name="package-variant"
                    size={20}
                    color={theme.colors.primary}
                  />
                  <Text style={[styles.actionText, { color: theme.colors.primary }]}>Muat</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity style={styles.actionButton}>
                <MaterialCommunityIcons
                  name="phone"
                  size={20}
                  color={theme.colors.primary}
                />
                <Text style={[styles.actionText, { color: theme.colors.primary }]}>Hubungi</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  queueNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  queueNumberText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  truckInfo: {
    flex: 1,
  },
  truckName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  licensePlate: {
    fontSize: 12,
    opacity: 0.7,
  },
  statusBadge: {
    alignSelf: 'flex-start',
  },
  divider: {
    marginVertical: 12,
  },
  detailsContainer: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  iconContainer: {
    width: 24,
    alignItems: 'center',
    marginRight: 8,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  detailValue: {
    fontSize: 14,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  actionButton: {
    alignItems: 'center',
    padding: 8,
  },
  actionText: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default TruckQueueCard;