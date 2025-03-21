// src/screens/dashboard/ProfileScreen.tsx
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {
  Text,
  Avatar,
  Button,
  Card,
  List,
  Divider,
  IconButton,
  useTheme,
  Dialog,
  Portal,
  TextInput,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { AppDispatch, RootState } from '../../store';
import AppHeader from '../../components/common/AppHeader';
import { api } from '../../api/endpoints/api';
import AppLoading from '../../components/common/AppLoading';

const ProfileScreen: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [isLoading, setIsLoading] = useState(false);
  const [passwordDialogVisible, setPasswordDialogVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Handle profile image upload
  const handleImageUpload = async () => {
    try {
      // Request permission to access the image library
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
        return;
      }
      
      // Launch the image library
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        
        // Check file size (limit to 5MB)
        const fileInfo = await FileSystem.getInfoAsync(selectedImage.uri);
        if (fileInfo.size && fileInfo.size > 5 * 1024 * 1024) {
          Alert.alert('File too large', 'The image must be less than 5MB');
          return;
        }
        
        // Upload the image
        setIsLoading(true);
        
        // Create a FormData object
        const formData = new FormData();
        formData.append('profileImage', {
          uri: selectedImage.uri,
          name: 'profile-image.jpg',
          type: 'image/jpeg',
        } as any);
        
        // Send the image to the server
        const response = await api.post('/users/profile-image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        // Update the user data in the Redux store
        // This would typically be part of a user update action
        // dispatch(updateUser(response.data));
        
        // For now, just show success
        Alert.alert('Success', 'Profile image updated successfully');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'Failed to upload image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async () => {
    // Validate passwords
    if (!currentPassword) {
      setPasswordError('Current password is required');
      return;
    }
    
    if (!newPassword) {
      setPasswordError('New password is required');
      return;
    }
    
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    setPasswordError(null);
    setIsLoading(true);
    
    try {
      // Send the password change request
      await api.post('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      
      // Reset form and close dialog
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordDialogVisible(false);
      
      // Show success message
      Alert.alert('Success', 'Password changed successfully');
    } catch (error) {
      console.error('Error changing password:', error);
      
      if (error.response && error.response.data && error.response.data.message) {
        setPasswordError(error.response.data.message);
      } else {
        setPasswordError('Failed to change password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <AppHeader title="Profile" backButton />
        <View style={styles.centerContainer}>
          <Text>User data not available</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader
        title="Profil Saya"
        backButton
        rightAction={{
          icon: 'cog',
          onPress: () => {
            // Navigate to settings
          },
        }}
      />
      
      {isLoading && <AppLoading />}
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <TouchableOpacity onPress={handleImageUpload}>
            {user.fotoProfil ? (
              <Avatar.Image
                size={100}
                source={{ uri: user.fotoProfil }}
                style={styles.profileImage}
              />
            ) : (
              <Avatar.Text
                size={100}
                label={user.nama ? user.nama.substring(0, 2).toUpperCase() : 'US'}
                color={theme.colors.surface}
                style={[styles.profileImage, { backgroundColor: theme.colors.primary }]}
              />
            )}
            <View style={[styles.editImageButton, { backgroundColor: theme.colors.primary }]}>
              <MaterialCommunityIcons name="camera" size={16} color="white" />
            </View>
          </TouchableOpacity>
          
          <Text style={styles.userName}>{user.nama}</Text>
          <Text style={styles.userRole}>{user.jabatan}</Text>
          <Text style={styles.userBranch}>{user.cabang?.namaCabang || 'Cabang Pusat'}</Text>
        </View>
        
        {/* Personal Information */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Informasi Pribadi</Text>
            
            <List.Item
              title="Nama Lengkap"
              description={user.nama}
              left={props => <List.Icon {...props} icon="account" />}
              style={styles.listItem}
            />
            
            <Divider />
            
            <List.Item
              title="Jabatan"
              description={user.jabatan}
              left={props => <List.Icon {...props} icon="briefcase" />}
              style={styles.listItem}
            />
            
            <Divider />
            
            <List.Item
              title="Cabang"
              description={user.cabang?.namaCabang || 'Cabang Pusat'}
              left={props => <List.Icon {...props} icon="office-building" />}
              style={styles.listItem}
            />
          </Card.Content>
        </Card>
        
        {/* Contact Information */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Informasi Kontak</Text>
            
            <List.Item
              title="Email"
              description={user.email || 'Tidak ada'}
              left={props => <List.Icon {...props} icon="email" />}
              style={styles.listItem}
            />
            
            <Divider />
            
            <List.Item
              title="Telepon"
              description={user.telepon || 'Tidak ada'}
              left={props => <List.Icon {...props} icon="phone" />}
              style={styles.listItem}
            />
            
            <Divider />
            
            <List.Item
              title="Alamat"
              description={user.alamat || 'Tidak ada'}
              left={props => <List.Icon {...props} icon="map-marker" />}
              style={styles.listItem}
            />
          </Card.Content>
        </Card>
        
        {/* Account Settings */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Pengaturan Akun</Text>
            
            <List.Item
              title="Username"
              description={user.username}
              left={props => <List.Icon {...props} icon="account-key" />}
              style={styles.listItem}
            />
            
            <Divider />
            
            <TouchableOpacity onPress={() => setPasswordDialogVisible(true)}>
              <List.Item
                title="Ubah Password"
                description="Klik untuk mengubah password"
                left={props => <List.Icon {...props} icon="lock-reset" />}
                right={props => <List.Icon {...props} icon="chevron-right" />}
                style={styles.listItem}
              />
            </TouchableOpacity>
          </Card.Content>
        </Card>
      </ScrollView>
      
      {/* Change Password Dialog */}
      <Portal>
        <Dialog
          visible={passwordDialogVisible}
          onDismiss={() => {
            setPasswordDialogVisible(false);
            setPasswordError(null);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
          }}
          style={styles.dialog}
        >
          <Dialog.Title>Ubah Password</Dialog.Title>
          
          <Dialog.Content>
            {passwordError && (
              <Text style={[styles.errorText, { color: theme.colors.error }]}>
                {passwordError}
              </Text>
            )}
            
            <TextInput
              label="Password Saat Ini"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry={!showCurrentPassword}
              mode="outlined"
              style={styles.input}
              right={
                <TextInput.Icon
                  icon={showCurrentPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                />
              }
            />
            
            <TextInput
              label="Password Baru"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showNewPassword}
              mode="outlined"
              style={styles.input}
              right={
                <TextInput.Icon
                  icon={showNewPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowNewPassword(!showNewPassword)}
                />
              }
            />
            
            <TextInput
              label="Konfirmasi Password Baru"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              mode="outlined"
              style={styles.input}
              right={
                <TextInput.Icon
                  icon={showConfirmPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              }
            />
          </Dialog.Content>
          
          <Dialog.Actions>
            <Button
              onPress={() => {
                setPasswordDialogVisible(false);
                setPasswordError(null);
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
              }}
            >
              Batal
            </Button>
            <Button
              mode="contained"
              onPress={handlePasswordChange}
              disabled={isLoading}
            >
              Simpan
            </Button>
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImage: {
    marginBottom: 16,
  },
  editImageButton: {
    position: 'absolute',
    right: 0,
    bottom: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  userRole: {
    fontSize: 16,
    marginTop: 4,
    opacity: 0.7,
  },
  userBranch: {
    fontSize: 14,
    marginTop: 2,
    opacity: 0.5,
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
  dialog: {
    borderRadius: 12,
  },
  input: {
    marginBottom: 16,
  },
  errorText: {
    marginBottom: 16,
    fontSize: 14,
  },
});

export default ProfileScreen;