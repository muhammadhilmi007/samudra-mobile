// src/screens/dashboard/SettingsScreen.tsx
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import {
  Text,
  Card,
  List,
  Switch,
  Divider,
  Button,
  useTheme,
  Dialog,
  Portal,
  RadioButton,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppDispatch, RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';
import AppHeader from '../../components/common/AppHeader';
import { CONFIG } from '../../constants/config';

const SettingsScreen: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [locationTracking, setLocationTracking] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);
  const [aboutDialogVisible, setAboutDialogVisible] = useState(false);
  const [themeDialogVisible, setThemeDialogVisible] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('system');
  
  // Save settings to AsyncStorage when changed
  const saveSettings = async (key: string, value: boolean) => {
    try {
      await AsyncStorage.setItem(`@samudra_settings_${key}`, value.toString());
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  // Handle push notifications toggle
  const handlePushNotificationsToggle = (value: boolean) => {
    setPushNotifications(value);
    saveSettings('push_notifications', value);
  };

  // Handle email notifications toggle
  const handleEmailNotificationsToggle = (value: boolean) => {
    setEmailNotifications(value);
    saveSettings('email_notifications', value);
  };

  // Handle location tracking toggle
  const handleLocationTrackingToggle = (value: boolean) => {
    setLocationTracking(value);
    saveSettings('location_tracking', value);
  };

  // Handle auto refresh toggle
  const handleAutoRefreshToggle = (value: boolean) => {
    setAutoRefresh(value);
    saveSettings('auto_refresh', value);
  };

  // Handle theme change
  const handleThemeChange = (value: string) => {
    setSelectedTheme(value);
    saveSettings('theme', value === 'system');
    // This would normally be part of a theme state management system
  };

  // Handle logout
  const handleLogout = () => {
    setLogoutDialogVisible(false);
    dispatch(logout());
  };

  // Handle contact support
  const handleContactSupport = () => {
    const supportEmail = 'support@samudrapaket.com';
    const subject = encodeURIComponent('Samudra ERP Mobile Support');
    const body = encodeURIComponent(
      `App Version: ${CONFIG.APP_VERSION}\nUser: ${user?.nama} (${user?.username})\nCabang: ${user?.cabang?.namaCabang || 'Unknown'}\n\nDetail permasalahan:\n`
    );
    
    Linking.openURL(`mailto:${supportEmail}?subject=${subject}&body=${body}`);
  };

  // Handle privacy policy
  const handlePrivacyPolicy = () => {
    Linking.openURL('https://www.samudrapaket.com/privacy-policy');
  };

  // Handle terms of service
  const handleTermsOfService = () => {
    Linking.openURL('https://www.samudrapaket.com/terms-of-service');
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Pengaturan" backButton />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Notifications Settings */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Notifikasi</Text>
            
            <List.Item
              title="Notifikasi Push"
              description="Terima notifikasi langsung pada aplikasi"
              left={props => <List.Icon {...props} icon="bell" />}
              right={() => (
                <Switch
                  value={pushNotifications}
                  onValueChange={handlePushNotificationsToggle}
                  color={theme.colors.primary}
                />
              )}
              style={styles.listItem}
            />
            
            <Divider />
            
            <List.Item
              title="Notifikasi Email"
              description="Terima update melalui email"
              left={props => <List.Icon {...props} icon="email" />}
              right={() => (
                <Switch
                  value={emailNotifications}
                  onValueChange={handleEmailNotificationsToggle}
                  color={theme.colors.primary}
                />
              )}
              style={styles.listItem}
            />
          </Card.Content>
        </Card>
        
        {/* App Settings */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Aplikasi</Text>
            
            <List.Item
              title="Tracking Lokasi"
              description="Aktifkan untuk pengiriman dan pengambilan barang"
              left={props => <List.Icon {...props} icon="map-marker" />}
              right={() => (
                <Switch
                  value={locationTracking}
                  onValueChange={handleLocationTrackingToggle}
                  color={theme.colors.primary}
                />
              )}
              style={styles.listItem}
            />
            
            <Divider />
            
            <List.Item
              title="Auto Refresh"
              description="Refresh data secara otomatis"
              left={props => <List.Icon {...props} icon="refresh" />}
              right={() => (
                <Switch
                  value={autoRefresh}
                  onValueChange={handleAutoRefreshToggle}
                  color={theme.colors.primary}
                />
              )}
              style={styles.listItem}
            />
            
            <Divider />
            
            <TouchableOpacity onPress={() => setThemeDialogVisible(true)}>
              <List.Item
                title="Tema Aplikasi"
                description="Ubah tampilan aplikasi"
                left={props => <List.Icon {...props} icon="palette" />}
                right={props => <List.Icon {...props} icon="chevron-right" />}
                style={styles.listItem}
              />
            </TouchableOpacity>
          </Card.Content>
        </Card>
        
        {/* Support */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Bantuan</Text>
            
            <TouchableOpacity onPress={handleContactSupport}>
              <List.Item
                title="Kontak Support"
                description="Hubungi kami untuk bantuan"
                left={props => <List.Icon {...props} icon="headset" />}
                right={props => <List.Icon {...props} icon="chevron-right" />}
                style={styles.listItem}
              />
            </TouchableOpacity>
            
            <Divider />
            
            <TouchableOpacity onPress={handlePrivacyPolicy}>
              <List.Item
                title="Kebijakan Privasi"
                description="Baca kebijakan privasi kami"
                left={props => <List.Icon {...props} icon="shield-account" />}
                right={props => <List.Icon {...props} icon="chevron-right" />}
                style={styles.listItem}
              />
            </TouchableOpacity>
            
            <Divider />
            
            <TouchableOpacity onPress={handleTermsOfService}>
              <List.Item
                title="Ketentuan Layanan"
                description="Baca ketentuan layanan kami"
                left={props => <List.Icon {...props} icon="file-document" />}
                right={props => <List.Icon {...props} icon="chevron-right" />}
                style={styles.listItem}
              />
            </TouchableOpacity>
            
            <Divider />
            
            <TouchableOpacity onPress={() => setAboutDialogVisible(true)}>
              <List.Item
                title="Tentang Aplikasi"
                description="Informasi tentang aplikasi"
                left={props => <List.Icon {...props} icon="information" />}
                right={props => <List.Icon {...props} icon="chevron-right" />}
                style={styles.listItem}
              />
            </TouchableOpacity>
          </Card.Content>
        </Card>
        
        {/* Account Actions */}
        <Card style={styles.card}>
          <Card.Content>
            <TouchableOpacity onPress={() => setLogoutDialogVisible(true)}>
              <List.Item
                title="Logout"
                description="Keluar dari aplikasi"
                left={props => <List.Icon {...props} icon="logout" color={theme.colors.error} />}
                titleStyle={{ color: theme.colors.error }}
                style={styles.listItem}
              />
            </TouchableOpacity>
          </Card.Content>
        </Card>
        
        {/* Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Versi {CONFIG.APP_VERSION}</Text>
          <Text style={styles.copyrightText}>© 2025 PT Sarana Mudah Raya "Samudra"</Text>
        </View>
      </ScrollView>
      
      {/* Logout Dialog */}
      <Portal>
        <Dialog
          visible={logoutDialogVisible}
          onDismiss={() => setLogoutDialogVisible(false)}
          style={styles.dialog}
        >
          <Dialog.Title>Konfirmasi Logout</Dialog.Title>
          <Dialog.Content>
            <Text>Apakah Anda yakin ingin keluar dari aplikasi?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setLogoutDialogVisible(false)}>Batal</Button>
            <Button
              mode="contained"
              onPress={handleLogout}
              style={{ backgroundColor: theme.colors.error }}
            >
              Logout
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      
      {/* About Dialog */}
      <Portal>
        <Dialog
          visible={aboutDialogVisible}
          onDismiss={() => setAboutDialogVisible(false)}
          style={styles.dialog}
        >
          <Dialog.Title>Tentang Samudra ERP</Dialog.Title>
          <Dialog.Content>
            <View style={styles.aboutContent}>
              <MaterialCommunityIcons
                name="truck-fast"
                size={64}
                color={theme.colors.primary}
                style={styles.aboutIcon}
              />
              <Text style={styles.aboutTitle}>Samudra ERP</Text>
              <Text style={styles.aboutVersion}>Versi {CONFIG.APP_VERSION}</Text>
              <Text style={styles.aboutDescription}>
                Aplikasi manajemen logistik dan pengiriman barang untuk PT Sarana Mudah Raya "Samudra".
              </Text>
              <Text style={styles.aboutCopyright}>
                © 2025 PT Sarana Mudah Raya "Samudra"
              </Text>
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setAboutDialogVisible(false)}>Tutup</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      
      {/* Theme Dialog */}
      <Portal>
        <Dialog
          visible={themeDialogVisible}
          onDismiss={() => setThemeDialogVisible(false)}
          style={styles.dialog}
        >
          <Dialog.Title>Pilih Tema</Dialog.Title>
          <Dialog.Content>
            <RadioButton.Group
              onValueChange={value => handleThemeChange(value)}
              value={selectedTheme}
            >
              <RadioButton.Item
                label="Sistem (Otomatis)"
                value="system"
                style={styles.radioItem}
              />
              <RadioButton.Item
                label="Terang"
                value="light"
                style={styles.radioItem}
              />
              <RadioButton.Item
                label="Gelap"
                value="dark"
                style={styles.radioItem}
              />
            </RadioButton.Group>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setThemeDialogVisible(false)}>Tutup</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
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
  listItem: {
    paddingVertical: 8,
    paddingLeft: 0,
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  versionText: {
    fontSize: 14,
    opacity: 0.6,
  },
  copyrightText: {
    fontSize: 12,
    opacity: 0.5,
    marginTop: 4,
  },
  dialog: {
    borderRadius: 12,
  },
  aboutContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  aboutIcon: {
    marginBottom: 16,
  },
  aboutTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  aboutVersion: {
    fontSize: 14,
    marginTop: 4,
    opacity: 0.7,
  },
  aboutDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  aboutCopyright: {
    fontSize: 12,
    opacity: 0.5,
  },
  radioItem: {
    paddingVertical: 8,
  },
});

export default SettingsScreen;