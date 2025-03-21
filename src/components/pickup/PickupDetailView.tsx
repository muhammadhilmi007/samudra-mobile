// src/components/pickup/PickupDetailView.tsx
import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Card, Text, Divider, Badge, useTheme, Avatar, List } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pickup } from '../../types/models/pickup';
import { formatDate, formatDateTime } from '../../utils/formatters/dateFormatter';

interface PickupDetailViewProps {
  pickup: Pickup;
}

const PickupDetailView: React.FC<PickupDetailViewProps> = ({ pickup }) => {
  const theme = useTheme();

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.pickupNumber}>{pickup.noPengambilan}</Text>
              <Text style={styles.pickupDate}>{formatDateTime(pickup.tanggal)}</Text>
            </View>
            <Badge
              style={[
                styles.badge,
                { backgroundColor: pickup.waktuPulang ? theme.colors.success : theme.colors.warning }
              ]}
            >
              {pickup.waktuPulang ? 'Selesai' : 'Dalam Proses'}
            </Badge>
          </View>

          <Divider style={styles.divider} />

          <Text style={styles.sectionTitle}>Informasi Pengambilan</Text>
          
          <View style={styles.detailRow}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name="account"
                size={24}
                color={theme.colors.primary}
              />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Pengirim</Text>
              <Text style={styles.detailValue}>
                {pickup.pengirim?.nama || 'Pengirim ' + pickup.pengirimId}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name="cube-outline"
                size={24}
                color={theme.colors.primary}
              />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Jumlah STT</Text>
              <Text style={styles.detailValue}>{pickup.sttIds?.length || 0} STT</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name="clock-outline"
                size={24}
                color={theme.colors.primary}
              />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Waktu Berangkat</Text>
              <Text style={styles.detailValue}>
                {pickup.waktuBerangkat ? formatDateTime(pickup.waktuBerangkat) : 'Belum Berangkat'}
              </Text>
            </View>
          </View>

          {pickup.waktuPulang && (
            <View style={styles.detailRow}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons
                  name="clock-check-outline"
                  size={24}
                  color={theme.colors.primary}
                />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Waktu Pulang</Text>
                <Text style={styles.detailValue}>{formatDateTime(pickup.waktuPulang)}</Text>
              </View>
            </View>
          )}

          {pickup.estimasiPengambilan && (
            <View style={styles.detailRow}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons
                  name="calendar-clock"
                  size={24}
                  color={theme.colors.primary}
                />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Estimasi Pengambilan</Text>
                <Text style={styles.detailValue}>{pickup.estimasiPengambilan}</Text>
              </View>
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Kendaraan Info */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Informasi Kendaraan</Text>
          
          <View style={styles.kendaraanContainer}>
            <View style={styles.kendaraanIconContainer}>
              <Avatar.Icon
                icon="truck"
                size={50}
                color={theme.colors.surface}
                style={{ backgroundColor: theme.colors.primary }}
              />
            </View>
            
            <View style={styles.kendaraanDetails}>
              <Text style={styles.kendaraanName}>
                {pickup.kendaraan?.namaKendaraan || 'Kendaraan'}
              </Text>
              <Text style={styles.kendaraanPlat}>
                {pickup.kendaraan?.noPolisi || 'No. Polisi tidak tersedia'}
              </Text>
            </View>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.crewContainer}>
            <View style={styles.crewMember}>
              <Avatar.Icon
                icon="account"
                size={40}
                color={theme.colors.surface}
                style={{ backgroundColor: theme.colors.accent }}
              />
              <View style={styles.crewDetails}>
                <Text style={styles.crewRole}>Supir</Text>
                <Text style={styles.crewName}>
                  {pickup.supir?.nama || 'Supir ' + pickup.supirId}
                </Text>
              </View>
            </View>

            {pickup.kenek && (
              <View style={styles.crewMember}>
                <Avatar.Icon
                  icon="account-outline"
                  size={40}
                  color={theme.colors.surface}
                  style={{ backgroundColor: theme.colors.accent }}
                />
                <View style={styles.crewDetails}>
                  <Text style={styles.crewRole}>Kenek</Text>
                  <Text style={styles.crewName}>
                    {pickup.kenek?.nama || 'Kenek ' + pickup.kenekId}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </Card.Content>
      </Card>

      {/* STT List */}
      {pickup.stts && pickup.stts.length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Daftar STT</Text>
            
            {pickup.stts.map((stt, index) => (
              <React.Fragment key={stt._id}>
                <List.Item
                  title={stt.noSTT}
                  description={`${stt.namaBarang} - ${stt.jumlahColly} colly (${stt.berat} kg)`}
                  left={props => <List.Icon {...props} icon="file-document-outline" />}
                  style={styles.sttItem}
                />
                {index < pickup.stts.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </Card.Content>
        </Card>
      )}

      {/* Created By */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.createdByContainer}>
            <Text style={styles.createdByLabel}>Dibuat oleh:</Text>
            <Text style={styles.createdByValue}>
              {pickup.user?.nama || 'User ' + pickup.userId}
            </Text>
            <Text style={styles.createdByDate}>
              {formatDateTime(pickup.createdAt)}
            </Text>
          </View>
        </Card.Content>
      </Card>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
  },
  pickupNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  pickupDate: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 4,
  },
  badge: {
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
  iconContainer: {
    width: 30,
    marginRight: 10,
    alignItems: 'center',
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
    fontWeight: 'bold',
  },
  kendaraanContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  kendaraanIconContainer: {
    marginRight: 16,
  },
  kendaraanDetails: {
    flex: 1,
  },
  kendaraanName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  kendaraanPlat: {
    fontSize: 14,
    opacity: 0.8,
  },
  crewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  crewMember: {
    alignItems: 'center',
    padding: 8,
  },
  crewDetails: {
    alignItems: 'center',
    marginTop: 8,
  },
  crewRole: {
    fontSize: 12,
    opacity: 0.7,
  },
  crewName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  sttItem: {
    paddingLeft: 0,
    paddingVertical: 8,
  },
  createdByContainer: {
    alignItems: 'center',
  },
  createdByLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  createdByValue: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4,
  },
  createdByDate: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 4,
  },
});

export default PickupDetailView;