import React, { useEffect } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { store } from './src/store';
import { RootNavigator } from './src/navigation/RootNavigator';
import { theme } from './src/constants/theme';
import { navigationRef } from './src/navigation/navigationRef';
import AuthManager from './src/services/AuthManager';

// Define app theme extending DefaultTheme
const paperTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: theme.colors.primary,
    accent: theme.colors.secondary,
    background: theme.colors.background,
    surface: theme.colors.surface,
    text: theme.colors.text,
    error: theme.colors.error,
  },
};

export default function App() {
  // Initialize push notifications
  useEffect(() => {
    // To be implemented when setting up notifications
  }, []);

  return (
    <SafeAreaProvider>
      <ReduxProvider store={store}>
        <PaperProvider theme={paperTheme}>
          <NavigationContainer ref={navigationRef}>
            <AuthManager>
              <RootNavigator />
            </AuthManager>
          </NavigationContainer>
          <StatusBar style="auto" />
        </PaperProvider>
      </ReduxProvider>
    </SafeAreaProvider>
  );
}