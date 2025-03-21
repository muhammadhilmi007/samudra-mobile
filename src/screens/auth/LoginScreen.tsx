// src/screens/auth/LoginScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Surface,
  HelperText,
  useTheme,
  ActivityIndicator,
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation';
import { login, clearAuthError } from '../../store/slices/authSlice';
import { AppDispatch, RootState } from '../../store';
import { CONFIG } from '../../constants/config';
import useFormValidation from '../../hooks/useFormValidation';

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'>;
};

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  // Clear auth errors when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  // Form validation config
  const formConfig = {
    username: {
      validation: {
        required: true,
        minLength: 3,
      },
      errorMessage: {
        required: 'Username wajib diisi',
        minLength: 'Username minimal 3 karakter',
      },
    },
    password: {
      validation: {
        required: true,
        minLength: 6,
      },
      errorMessage: {
        required: 'Password wajib diisi',
        minLength: 'Password minimal 6 karakter',
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
  } = useFormValidation(formConfig, { username: '', password: '' });

  // Handle login
  const handleLogin = async () => {
    if (validateForm()) {
      await dispatch(
        login({
          username: values.username,
          password: values.password,
        })
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logoContainer}>
            <Image
              source={require('../../../assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={[styles.appName, { color: theme.colors.primary }]}>
              {CONFIG.APP_NAME}
            </Text>
            <Text style={[styles.appVersion, { color: theme.colors.secondary }]}>
              Version {CONFIG.APP_VERSION}
            </Text>
          </View>

          <Surface style={styles.formContainer}>
            <Text style={styles.loginTitle}>Login</Text>

            {error && (
              <HelperText type="error" visible={!!error} style={styles.errorText}>
                {error}
              </HelperText>
            )}

            <TextInput
              label="Username"
              value={values.username}
              onChangeText={(text) => handleChange('username', text)}
              onBlur={() => handleBlur('username')}
              style={styles.input}
              autoCapitalize="none"
              left={<TextInput.Icon icon="account" />}
              error={touched.username && !!errors.username}
              disabled={isLoading}
            />
            {touched.username && errors.username && (
              <HelperText type="error" visible={true}>
                {errors.username}
              </HelperText>
            )}

            <TextInput
              label="Password"
              value={values.password}
              onChangeText={(text) => handleChange('password', text)}
              onBlur={() => handleBlur('password')}
              secureTextEntry={!showPassword}
              style={styles.input}
              left={<TextInput.Icon icon="lock" />}
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
              error={touched.password && !!errors.password}
              disabled={isLoading}
            />
            {touched.password && errors.password && (
              <HelperText type="error" visible={true}>
                {errors.password}
              </HelperText>
            )}

            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={() => navigation.navigate('ForgotPassword')}
              disabled={isLoading}
            >
              <Text style={{ color: theme.colors.primary }}>Lupa Password?</Text>
            </TouchableOpacity>

            <Button
              mode="contained"
              onPress={handleLogin}
              style={styles.loginButton}
              labelStyle={styles.loginButtonLabel}
              disabled={isLoading || (!isValid && Object.keys(touched).length > 0)}
              loading={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </Surface>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.colors.secondary }]}>
              PT Sarana Mudah Raya "Samudra" © 2025
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 120,
    height: 120,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 12,
  },
  appVersion: {
    fontSize: 14,
    marginTop: 4,
  },
  formContainer: {
    padding: 24,
    borderRadius: 12,
    elevation: 4,
  },
  loginTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    marginBottom: 8,
  },
  errorText: {
    marginBottom: 16,
    fontSize: 14,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 4,
    marginBottom: 24,
  },
  loginButton: {
    marginTop: 8,
    paddingVertical: 8,
  },
  loginButtonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 32,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
  },
});

export default LoginScreen;