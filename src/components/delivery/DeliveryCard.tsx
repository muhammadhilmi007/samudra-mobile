// src/components/delivery/DeliveryCard.tsx
import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Card, Text, Badge, useTheme, Divider, Avatar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Delivery } from '../../types/models/delivery';
import { formatDate, formatDateTime } from '../../utils/formatters/dateFormatter';
import { getDeliveryStatusColor, getDeliveryStatusLabel } from '../../utils/formatters/statusFormatter';

interface DeliveryCardProps {
  delivery: Delivery;
  onPress?: (delivery: Delivery) => void;
  showActions?: boolean;
}

const DeliveryCard: React.FC<DeliveryCardProps> = ({
  delivery,
  onPress,
  showActions = false,
}) => {
  const theme = useTheme();

  const handlePress = () => {
    if (onPress) {
      onPress(delivery);
    }
  };

  return (
    <Card style={styles.card} onPress={handlePress}>
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.deliveryNumber}>{delivery.idLansir}</Text>
            <Text style={[styles.date, { color: theme.colors.secondary }]}>
              {formatDate(delivery.berangkat)}
            </Text>
          </View>
          
          <Badge
            style={[
              styles.statusBadge,
              { backgroundColor: getDeliveryStatusColor(delivery.status, theme) },
            ]}
          >
            {getDeliveryStatusLabel(delivery.status)}
          </Badge>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name="file-document-multiple"
                size={20}
                color={theme.colors.primary}
              />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Jumlah STT</Text>
              <Text style={styles.detailValue}>
                {delivery.sttIds.length} STT
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name="truck"
                size={20}
                color={theme.colors.primary}
              />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Kendaraan</Text>
              <Text style={styles.detailValue}>
                {delivery.antrianKendaraan?.kendaraan?.noPolisi || 'Tidak tersedia'}
              </Text>
            </View>
          </View>

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
                {delivery.antrianKendaraan?.supir?.nama || 'Tidak tersedia'}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name="clock-outline"
                size={20}
                color={theme.colors.primary}
              />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Waktu Berangkat</Text>
              <Text style={styles.detailValue}>
                {formatDateTime(delivery.berangkat, 'HH:mm')}
              </Text>
            </View>
          </View>

          {delivery.sampai && (
            <View style={styles.detailRow}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons
                  name="clock-check-outline"
                  size={20}
                  color={theme.colors.primary}
                />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Waktu Sampai</Text>
                <Text style={styles.detailValue}>
                  {formatDateTime(delivery.sampai, 'HH:mm')}
                </Text>
              </View>
            </View>
          )}

          {delivery.namaPenerima && (
            <View style={styles.detailRow}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons
                  name="account-check"
                  size={20}
                  color={theme.colors.primary}
                />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Diterima Oleh</Text>
                <Text style={styles.detailValue}>{delivery.namaPenerima}</Text>
              </View>
            </View>
          )}
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
              
              {delivery.status === 'LANSIR' && (
                <TouchableOpacity style={styles.actionButton}>
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={20}
                    color={theme.colors.primary}
                  />
                  <Text style={[styles.actionText, { color: theme.colors.primary }]}>Selesaikan</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity style={styles.actionButton}>
                <MaterialCommunityIcons
                  name="file-document-outline"
                  size={20}
                  color={theme.colors.primary}
                />
                <Text style={[styles.actionText, { color: theme.colors.primary }]}>Lihat STT</Text>
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
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
  },
  deliveryNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 12,
    marginTop: 2,
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

export default DeliveryCard;