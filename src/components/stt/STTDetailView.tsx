// src/components/stt/STTDetailView.tsx
import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, Card, Badge, Divider, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { STT } from '../../types/models/stt';
import { formatCurrency } from '../../utils/formatters/currencyFormatter';
import { formatDate, formatDateTime } from '../../utils/formatters/dateFormatter';
import { getSTTStatusColor, getSTTStatusLabel } from '../../utils/formatters/statusFormatter';
import { getPaymentTypeLabel } from '../../utils/formatters/paymentFormatter';

interface STTDetailViewProps {
  stt: STT;
}

const STTDetailView: React.FC<STTDetailViewProps> = ({ stt }) => {
  const theme = useTheme();

  // Get readable address
  const getAddress = (type: 'sender' | 'receiver') => {
    const entity = type === 'sender' ? stt.pengirim : stt.penerima;
    if (!entity) return 'Alamat tidak tersedia';
    
    return entity.alamat || 'Alamat tidak tersedia';
  };

  return (
    <ScrollView style={styles.container}>
      {/* STT Header */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.sttHeader}>
            <View>
              <Text style={styles.sttNumber}>{stt.noSTT}</Text>
              <Text style={styles.sttDate}>{formatDateTime(stt.createdAt)}</Text>
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
          
          <Text style={styles.sectionTitle}>Detail Barang</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Nama Barang</Text>
            <Text style={styles.detailValue}>{stt.namaBarang}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Jenis Komoditi</Text>
            <Text style={styles.detailValue}>{stt.komoditi}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Kemasan</Text>
            <Text style={styles.detailValue}>{stt.packing}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Jumlah</Text>
            <Text style={styles.detailValue}>{stt.jumlahColly} colly</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Berat</Text>
            <Text style={styles.detailValue}>{stt.berat} kg</Text>
          </View>
          
          <Divider style={styles.divider} />
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Total Biaya</Text>
            <Text style={[styles.detailValue, styles.totalValue]}>
              {formatCurrency(stt.harga)}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Metode Pembayaran</Text>
            <Text style={styles.detailValue}>{getPaymentTypeLabel(stt.paymentType)}</Text>
          </View>
        </Card.Content>
      </Card>
      
      {/* Cabang Information */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Rute Pengiriman</Text>
          
          <View style={styles.detailRow}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name="office-building"
                size={24}
                color={theme.colors.primary}
              />
            </View>
            <View style={styles.routeInfo}>
              <Text style={styles.routeLabel}>Cabang Asal</Text>
              <Text style={styles.routeValue}>
                {stt.cabangAsal?.namaCabang || 'Cabang ' + stt.cabangAsalId}
              </Text>
            </View>
          </View>

          <MaterialCommunityIcons
            name="arrow-down"
            size={24}
            color={theme.colors.primary}
            style={styles.arrowIcon}
          />
          
          <View style={styles.detailRow}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name="office-building-marker"
                size={24}
                color={theme.colors.primary}
              />
            </View>
            <View style={styles.routeInfo}>
              <Text style={styles.routeLabel}>Cabang Tujuan</Text>
              <Text style={styles.routeValue}>
                {stt.cabangTujuan?.namaCabang || 'Cabang ' + stt.cabangTujuanId}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
      
      {/* Sender & Receiver */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Pengirim & Penerima</Text>
          
          <View style={styles.detailRow}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name="account-arrow-left"
                size={24}
                color={theme.colors.primary}
              />
            </View>
            <View style={styles.routeInfo}>
              <Text style={styles.routeLabel}>Pengirim</Text>
              <Text style={styles.routeValue}>
                {stt.pengirim?.nama || 'Pengirim ' + stt.pengirimId}
              </Text>
              <Text style={styles.routeAddress}>{getAddress('sender')}</Text>
            </View>
          </View>

          <MaterialCommunityIcons
            name="arrow-down"
            size={24}
            color={theme.colors.primary}
            style={styles.arrowIcon}
          />
          
          <View style={styles.detailRow}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name="account-arrow-right"
                size={24}
                color={theme.colors.primary}
              />
            </View>
            <View style={styles.routeInfo}>
              <Text style={styles.routeLabel}>Penerima</Text>
              <Text style={styles.routeValue}>
                {stt.penerima?.nama || 'Penerima ' + stt.penerimaId}
              </Text>
              <Text style={styles.routeAddress}>{getAddress('receiver')}</Text>
            </View>
          </View>
        </Card.Content>
      </Card>
      
      {/* Additional Information */}
      {stt.keterangan && (
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Informasi Tambahan</Text>
            <Text style={styles.noteText}>{stt.keterangan}</Text>
          </Card.Content>
        </Card>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  detailRow: {
    flexDirection: 'row',
    marginBottom: 12,
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
  iconContainer: {
    width: 30,
    marginRight: 10,
    alignItems: 'center',
  },
  routeInfo: {
    flex: 1,
  },
  routeLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  routeValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  routeAddress: {
    fontSize: 12,
    opacity: 0.8,
    marginTop: 2,
  },
  arrowIcon: {
    alignSelf: 'center',
    marginVertical: 8,
  },
  noteText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default STTDetailView;