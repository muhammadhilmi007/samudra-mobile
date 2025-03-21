// src/screens/auth/ForgotPasswordScreen.tsx
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Surface,
  HelperText,
  useTheme,
  IconButton,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation';
import { api } from '../../api/endpoints/api';
import useFormValidation from '../../hooks/useFormValidation';
import AppLoading from '../../components/common/AppLoading';

type ForgotPasswordScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'ForgotPassword'
>;

const ForgotPasswordScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form validation config
  const formConfig = {
    email: {
      validation: {
        required: true,
        isEmail: true,
      },
      errorMessage: {
        required: 'Email wajib diisi',
        isEmail: 'Format email tidak valid',
      },
    },
  };

  // Initialize form hooks
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    isValid,
  } = useFormValidation(formConfig, { email: '' });

  // Handle submit
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Call the reset password API
      await api.post('/auth/forgot-password', { email: values.email });
      
      // Show success message
      setSuccess(true);
    } catch (err) {
      // Show error message
      console.error('Error resetting password:', err);
      
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Terjadi kesalahan saat mengirim permintaan reset password. Silakan coba lagi.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <IconButton
            icon="arrow-left"
            size={24}
            color={theme.colors.primary}
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.headerTitle}>Lupa Password</Text>
          <View style={{ width: 40 }} />
        </View>
        
        <Surface style={styles.formContainer}>
          {isLoading ? (
            <AppLoading message="Memproses permintaan..." fullScreen={false} />
          ) : success ? (
            <View style={styles.successContainer}>
              <IconButton
                icon="check-circle"
                size={64}
                color={theme.colors.surface}
                style={styles.successIcon}
              />
              <Text style={styles.successTitle}>Berhasil!</Text>
              <Text style={styles.successMessage}>
                Instruksi untuk reset password telah dikirim ke email Anda. Silakan periksa email dan ikuti petunjuk yang diberikan.
              </Text>
              <Button
                mode="contained"
                style={[styles.button, { backgroundColor: theme.colors.primary }]}
                labelStyle={styles.buttonLabel}
                onPress={() => navigation.navigate('Login')}
              >
                Kembali ke Login
              </Button>
            </View>
          ) : (
            <>
              <Text style={styles.title}>Reset Password</Text>
              <Text style={styles.description}>
                Masukkan alamat email yang terdaftar pada akun Anda. Kami akan mengirimkan instruksi untuk mereset password Anda.
              </Text>
              
              {error && (
                <HelperText type="error" visible={!!error} style={styles.errorText}>
                  {error}
                </HelperText>
              )}
              
              <TextInput
                label="Email"
                value={values.email}
                onChangeText={(text) => handleChange('email', text)}
                onBlur={() => handleBlur('email')}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                left={<TextInput.Icon icon="email" />}
                error={touched.email && !!errors.email}
                disabled={isLoading}
              />
              {touched.email && errors.email && (
                <HelperText type="error" visible={true}>
                  {errors.email}
                </HelperText>
              )}
              
              <Button
                mode="contained"
                onPress={handleSubmit}
                style={[styles.button, { backgroundColor: theme.colors.primary }]}
                labelStyle={styles.buttonLabel}
                disabled={isLoading || (!isValid && Object.keys(touched).length > 0)}
              >
                Kirim Instruksi
              </Button>
              
              <TouchableOpacity
                style={styles.backToLogin}
                onPress={() => navigation.navigate('Login')}
                disabled={isLoading}
              >
                <Text style={{ color: theme.colors.primary }}>
                  Kembali ke halaman Login
                </Text>
              </TouchableOpacity>
            </>
          )}
        </Surface>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  formContainer: {
    padding: 24,
    borderRadius: 12,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    marginBottom: 24,
    textAlign: 'center',
    opacity: 0.7,
  },
  input: {
    marginBottom: 8,
  },
  errorText: {
    marginBottom: 16,
  },
  button: {
    marginTop: 24,
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  backToLogin: {
    alignSelf: 'center',
    marginTop: 24,
  },
  successContainer: {
    alignItems: 'center',
    padding: 16,
  },
  successIcon: {
    margin: 0,
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  successMessage: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.7,
  },
});

export default ForgotPasswordScreen;