// src/components/stt/STTCard.tsx
import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Card, Text, Badge, useTheme, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { STT } from '../../types/models/stt';
import { formatDate } from '../../utils/formatters/dateFormatter';
import { formatCurrency } from '../../utils/formatters/currencyFormatter';
import { getSTTStatusColor, getSTTStatusLabel } from '../../utils/formatters/statusFormatter';
import { getPaymentTypeLabel } from '../../utils/formatters/paymentFormatter';

interface STTCardProps {
  stt: STT;
  onPress?: (stt: STT) => void;
  showActions?: boolean;
}

const STTCard: React.FC<STTCardProps> = ({ stt, onPress, showActions = false }) => {
  const theme = useTheme();

  const handlePress = () => {
    if (onPress) {
      onPress(stt);
    }
  };

  return (
    <Card style={styles.card} onPress={handlePress}>
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.sttNumber}>{stt.noSTT}</Text>
            <Text style={[styles.date, { color: theme.colors.secondary }]}>
              {formatDate(stt.createdAt)}
            </Text>
          </View>
          
          <Badge
            style={[
              styles.statusBadge,
              { backgroundColor: getSTTStatusColor(stt.status, theme) },
            ]}
          >
            {getSTTStatusLabel(stt.status)}
          </Badge>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name="map-marker-radius"
                size={20}
                color={theme.colors.primary}
              />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Asal</Text>
              <Text style={styles.detailValue}>
                {stt.cabangAsal?.namaCabang || 'Cabang ' + stt.cabangAsalId}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name="map-marker"
                size={20}
                color={theme.colors.primary}
              />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Tujuan</Text>
              <Text style={styles.detailValue}>
                {stt.cabangTujuan?.namaCabang || 'Cabang ' + stt.cabangTujuanId}
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
              <Text style={styles.detailLabel}>Pengirim</Text>
              <Text style={styles.detailValue}>
                {stt.pengirim?.nama || 'Pengirim ' + stt.pengirimId}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name="account-arrow-right"
                size={20}
                color={theme.colors.primary}
              />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Penerima</Text>
              <Text style={styles.detailValue}>
                {stt.penerima?.nama || 'Penerima ' + stt.penerimaId}
              </Text>
            </View>
          </View>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.packageDetails}>
          <View style={styles.packageItem}>
            <Text style={styles.packageLabel}>Barang</Text>
            <Text style={styles.packageValue}>{stt.namaBarang}</Text>
          </View>
          
          <View style={styles.packageItem}>
            <Text style={styles.packageLabel}>Jumlah</Text>
            <Text style={styles.packageValue}>{stt.jumlahColly} colly</Text>
          </View>
          
          <View style={styles.packageItem}>
            <Text style={styles.packageLabel}>Berat</Text>
            <Text style={styles.packageValue}>{stt.berat} kg</Text>
          </View>
          
          <View style={styles.packageItem}>
            <Text style={styles.packageLabel}>Pembayaran</Text>
            <Text style={styles.packageValue}>{getPaymentTypeLabel(stt.paymentType)}</Text>
          </View>
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Total Biaya</Text>
          <Text style={[styles.priceValue, { color: theme.colors.primary }]}>
            {formatCurrency(stt.harga)}
          </Text>
        </View>

        {showActions && (
          <>
            <Divider style={styles.divider} />
            <View style={styles.actionContainer}>
              <TouchableOpacity style={styles.actionButton}>
                <MaterialCommunityIcons
                  name="barcode-scan"
                  size={20}
                  color={theme.colors.primary}
                />
                <Text style={[styles.actionText, { color: theme.colors.primary }]}>Scan</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton}>
                <MaterialCommunityIcons
                  name="eye"
                  size={20}
                  color={theme.colors.primary}
                />
                <Text style={[styles.actionText, { color: theme.colors.primary }]}>Detail</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton}>
                <MaterialCommunityIcons
                  name="truck-fast"
                  size={20}
                  color={theme.colors.primary}
                />
                <Text style={[styles.actionText, { color: theme.colors.primary }]}>Tracking</Text>
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
  sttNumber: {
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
  packageDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  packageItem: {
    width: '50%',
    marginBottom: 8,
  },
  packageLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  packageValue: {
    fontSize: 14,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  priceLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  priceValue: {
    fontSize: 16,
    fontWeight: 'bold',
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

export default STTCard;