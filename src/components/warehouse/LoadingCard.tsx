// src/components/warehouse/LoadingCard.tsx
import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Card, Text, Badge, useTheme, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Loading } from '../../types/models/warehouse';
import { formatDate, formatDateTime } from '../../utils/formatters/dateFormatter';
import { getLoadingStatusColor, getLoadingStatusLabel } from '../../utils/formatters/statusFormatter';

interface LoadingCardProps {
  loading: Loading;
  onPress?: (loading: Loading) => void;
  showActions?: boolean;
}

const LoadingCard: React.FC<LoadingCardProps> = ({
  loading,
  onPress,
  showActions = false,
}) => {
  const theme = useTheme();

  const handlePress = () => {
    if (onPress) {
      onPress(loading);
    }
  };

  return (
    <Card style={styles.card} onPress={handlePress}>
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.loadingNumber}>{loading.idMuat}</Text>
            <Text style={[styles.date, { color: theme.colors.secondary }]}>
              {formatDate(loading.createdAt)}
            </Text>
          </View>
          
          <Badge
            style={[
              styles.statusBadge,
              { backgroundColor: getLoadingStatusColor(loading.status, theme) },
            ]}
          >
            {getLoadingStatusLabel(loading.status)}
          </Badge>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.detailsContainer}>
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
                {loading.antrianTruck?.truck?.noPolisi || 'Tidak tersedia'}
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
                {loading.antrianTruck?.supir?.nama || 'Tidak tersedia'}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name="clipboard-check"
                size={20}
                color={theme.colors.primary}
              />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Checker</Text>
              <Text style={styles.detailValue}>
                {loading.checker?.nama || 'Tidak tersedia'}
              </Text>
            </View>
          </View>

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
              <Text style={styles.detailValue}>{loading.sttIds.length} STT</Text>
            </View>
          </View>

          <View style={styles.routeRow}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name="map-marker-path"
                size={20}
                color={theme.colors.primary}
              />
            </View>
            <View style={styles.routeContent}>
              <View style={styles.routePoints}>
                <Text style={styles.routePoint} numberOfLines={1}>
                  {loading.cabangMuat?.namaCabang || 'Cabang ' + loading.cabangMuatId}
                </Text>
                <MaterialCommunityIcons
                  name="arrow-right"
                  size={16}
                  color={theme.colors.primary}
                  style={styles.routeArrow}
                />
                <Text style={styles.routePoint} numberOfLines={1}>
                  {loading.cabangBongkar?.namaCabang || 'Cabang ' + loading.cabangBongkarId}
                </Text>
              </View>
            </View>
          </View>

          {loading.waktuBerangkat && (
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
                  {formatDateTime(loading.waktuBerangkat, 'dd MMM yyyy, HH:mm')}
                </Text>
              </View>
            </View>
          )}

          {loading.waktuSampai && (
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
                  {formatDateTime(loading.waktuSampai, 'dd MMM yyyy, HH:mm')}
                </Text>
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
              
              {loading.status === 'MUAT' && (
                <TouchableOpacity style={styles.actionButton}>
                  <MaterialCommunityIcons
                    name="truck-fast"
                    size={20}
                    color={theme.colors.primary}
                  />
                  <Text style={[styles.actionText, { color: theme.colors.primary }]}>Berangkat</Text>
                </TouchableOpacity>
              )}
              
              {loading.status === 'BERANGKAT' && (
                <TouchableOpacity style={styles.actionButton}>
                  <MaterialCommunityIcons
                    name="map-marker-check"
                    size={20}
                    color={theme.colors.primary}
                  />
                  <Text style={[styles.actionText, { color: theme.colors.primary }]}>Sampai</Text>
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
  loadingNumber: {
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
  routeRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  routeContent: {
    flex: 1,
  },
  routePoints: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routePoint: {
    fontSize: 14,
    flex: 1,
  },
  routeArrow: {
    marginHorizontal: 4,
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

export default LoadingCard;