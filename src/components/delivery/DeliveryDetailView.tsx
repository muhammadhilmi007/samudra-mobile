// src/components/delivery/DeliveryDetailView.tsx
import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Card, Text, Badge, Divider, useTheme, Avatar, List } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Delivery } from '../../types/models/delivery';
import { formatDate, formatDateTime } from '../../utils/formatters/dateFormatter';
import { getDeliveryStatusColor, getDeliveryStatusLabel } from '../../utils/formatters/statusFormatter';
import { getPaymentTypeLabel } from '../../utils/formatters/paymentFormatter';

interface DeliveryDetailViewProps {
  delivery: Delivery;
}

const DeliveryDetailView: React.FC<DeliveryDetailViewProps> = ({ delivery }) => {
  const theme = useTheme();

  return (
    <ScrollView style={styles.container}>
      {/* Header Information */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.deliveryNumber}>{delivery.idLansir}</Text>
              <Text style={styles.deliveryDate}>{formatDateTime(delivery.berangkat)}</Text>
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

          <Text style={styles.sectionTitle}>Informasi Pengiriman</Text>
          
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
              <Text style={styles.detailValue}>{formatDateTime(delivery.berangkat)}</Text>
            </View>
          </View>

          {delivery.sampai && (
            <View style={styles.detailRow}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons
                  name="clock-check-outline"
                  size={24}
                  color={theme.colors.primary}
                />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Waktu Sampai</Text>
                <Text style={styles.detailValue}>{formatDateTime(delivery.sampai)}</Text>
              </View>
            </View>
          )}

          {delivery.kilometerBerangkat && (
            <View style={styles.detailRow}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons
                  name="speedometer"
                  size={24}
                  color={theme.colors.primary}
                />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>KM Berangkat</Text>
                <Text style={styles.detailValue}>{delivery.kilometerBerangkat} km</Text>
              </View>
            </View>
          )}

          {delivery.kilometerPulang && (
            <View style={styles.detailRow}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons
                  name="speedometer"
                  size={24}
                  color={theme.colors.primary}
                />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>KM Pulang</Text>
                <Text style={styles.detailValue}>{delivery.kilometerPulang} km</Text>
              </View>
            </View>
          )}

          {delivery.estimasiLansir && (
            <View style={styles.detailRow}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons
                  name="calendar-clock"
                  size={24}
                  color={theme.colors.primary}
                />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Estimasi Pengiriman</Text>
                <Text style={styles.detailValue}>{delivery.estimasiLansir}</Text>
              </View>
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Kendaraan & Crew Information */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Kendaraan & Crew</Text>
          
          <View style={styles.vehicleContainer}>
            <View style={styles.vehicleIconContainer}>
              <Avatar.Icon
                icon="truck"
                size={50}
                color={theme.colors.surface}
                style={{ backgroundColor: theme.colors.primary }}
              />
            </View>
            
            <View style={styles.vehicleDetails}>
              <Text style={styles.vehicleName}>
                {delivery.antrianKendaraan?.kendaraan?.namaKendaraan || 'Kendaraan'}
              </Text>
              <Text style={styles.vehiclePlat}>
                {delivery.antrianKendaraan?.kendaraan?.noPolisi || 'No. Polisi tidak tersedia'}
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
                  {delivery.antrianKendaraan?.supir?.nama || 'Tidak tersedia'}
                </Text>
              </View>
            </View>

            {delivery.antrianKendaraan?.kenek && (
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
                    {delivery.antrianKendaraan?.kenek?.nama || 'Tidak tersedia'}
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.crewMember}>
              <Avatar.Icon
                icon="clipboard-check"
                size={40}
                color={theme.colors.surface}
                style={{ backgroundColor: theme.colors.accent }}
              />
              <View style={styles.crewDetails}>
                <Text style={styles.crewRole}>Checker</Text>
                <Text style={styles.crewName}>
                  {delivery.checker?.nama || 'Tidak tersedia'}
                </Text>
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Delivery Status */}
      {delivery.status === 'TERKIRIM' && delivery.namaPenerima && (
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Status Pengiriman</Text>
            
            <View style={styles.receiverContainer}>
              <Avatar.Icon
                icon="account-check"
                size={50}
                color={theme.colors.surface}
                style={{ backgroundColor: theme.colors.success }}
              />
              
              <View style={styles.receiverDetails}>
                <Text style={styles.receiverLabel}>Diterima Oleh:</Text>
                <Text style={styles.receiverName}>{delivery.namaPenerima}</Text>
                {delivery.sampai && (
                  <Text style={styles.receiverDate}>
                    {formatDateTime(delivery.sampai)}
                  </Text>
                )}
              </View>
            </View>

            {delivery.keterangan && (
              <View style={styles.notesContainer}>
                <Text style={styles.notesLabel}>Keterangan:</Text>
                <Text style={styles.notesText}>{delivery.keterangan}</Text>
              </View>
            )}
          </Card.Content>
        </Card>
      )}

      {/* STT List */}
      {delivery.stts && delivery.stts.length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Daftar STT</Text>
            
            {delivery.stts.map((stt, index) => (
              <React.Fragment key={stt._id}>
                <List.Item
                  title={stt.noSTT}
                  description={`${stt.namaBarang} - ${stt.jumlahColly} colly (${stt.berat} kg)`}
                  left={props => <List.Icon {...props} icon="file-document-outline" />}
                  right={props => (
                    <View style={styles.sttInfo}>
                      <Text style={styles.sttPaymentType}>
                        {getPaymentTypeLabel(stt.paymentType)}
                      </Text>
                      <Text style={styles.sttRecipient}>
                        {stt.penerima?.nama || 'Penerima tidak tersedia'}
                      </Text>
                    </View>
                  )}
                  style={styles.sttItem}
                />
                {index < delivery.stts.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </Card.Content>
        </Card>
      )}

      {/* Created By */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.createdByContainer}>
            <Text style={styles.createdByLabel}>Admin:</Text>
            <Text style={styles.createdByValue}>
              {delivery.admin?.nama || 'Admin ' + delivery.adminId}
            </Text>
            <Text style={styles.createdByDate}>
              {formatDateTime(delivery.createdAt)}
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
  deliveryNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  deliveryDate: {
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
  vehicleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  vehicleIconContainer: {
    marginRight: 16,
  },
  vehicleDetails: {
    flex: 1,
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  vehiclePlat: {
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
    textAlign: 'center',
  },
  receiverContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  receiverDetails: {
    marginLeft: 16,
  },
  receiverLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  receiverName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
  receiverDate: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 4,
  },
  notesContainer: {
    marginTop: 16,
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  notesText: {
    fontSize: 14,
    lineHeight: 20,
  },
  sttItem: {
    paddingLeft: 0,
    paddingVertical: 8,
  },
  sttInfo: {
    alignItems: 'flex-end',
  },
  sttPaymentType: {
    fontSize: 12,
    opacity: 0.7,
  },
  sttRecipient: {
    fontSize: 12,
    marginTop: 4,
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

export default DeliveryDetailView;