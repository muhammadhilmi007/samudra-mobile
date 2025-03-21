// src/components/pickup/PickupRequestCard.tsx
import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Card, Text, Avatar, Badge, useTheme, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PickupRequest } from '../../types/models/pickup';
import { formatDate } from '../../utils/formatters/dateFormatter';
import { getPickupRequestStatusColor, getPickupRequestStatusLabel } from '../../utils/formatters/statusFormatter';

interface PickupRequestCardProps {
  request: PickupRequest;
  onPress?: (request: PickupRequest) => void;
  showActions?: boolean;
}

const PickupRequestCard: React.FC<PickupRequestCardProps> = ({ 
  request, 
  onPress, 
  showActions = false 
}) => {
  const theme = useTheme();

  const handlePress = () => {
    if (onPress) {
      onPress(request);
    }
  };

  return (
    <Card style={styles.card} onPress={handlePress}>
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.date}>{formatDate(request.tanggal)}</Text>
            <Text style={styles.sender}>
              {request.pengirim?.nama || 'Pengirim ' + request.pengirimId}
            </Text>
          </View>
          
          <Badge
            style={[
              styles.statusBadge,
              { backgroundColor: getPickupRequestStatusColor(request.status, theme) },
            ]}
          >
            {getPickupRequestStatusLabel(request.status)}
          </Badge>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name="map-marker"
                size={20}
                color={theme.colors.primary}
              />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Alamat Pengambilan</Text>
              <Text style={styles.detailValue}>
                {request.alamatPengambilan}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name="target"
                size={20}
                color={theme.colors.primary}
              />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Tujuan</Text>
              <Text style={styles.detailValue}>
                {request.tujuan}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name="cube-outline"
                size={20}
                color={theme.colors.primary}
              />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Jumlah Colly</Text>
              <Text style={styles.detailValue}>
                {request.jumlahColly} colly
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
              <Text style={styles.detailLabel}>Dibuat Oleh</Text>
              <Text style={styles.detailValue}>
                {request.user?.nama || 'User ' + request.userId}
              </Text>
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
              
              {request.status === 'PENDING' && (
                <TouchableOpacity style={styles.actionButton}>
                  <MaterialCommunityIcons
                    name="truck-delivery"
                    size={20}
                    color={theme.colors.primary}
                  />
                  <Text style={[styles.actionText, { color: theme.colors.primary }]}>Pickup</Text>
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
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
  },
  date: {
    fontSize: 12,
    opacity: 0.7,
  },
  sender: {
    fontSize: 16,
    fontWeight: 'bold',
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

export default PickupRequestCard;