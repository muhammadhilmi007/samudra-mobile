// src/components/common/AppLoading.tsx
import React from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { useTheme } from 'react-native-paper';

interface AppLoadingProps {
  message?: string;
  size?: 'small' | 'large';
  fullScreen?: boolean;
}

const AppLoading: React.FC<AppLoadingProps> = ({
  message = 'Memuat...',
  size = 'large',
  fullScreen = true,
}) => {
  const theme = useTheme();
  
  if (fullScreen) {
    return (
      <View style={styles.fullScreen}>
        <ActivityIndicator size={size} color={theme.colors.primary} />
        {message && <Text style={[styles.message, { color: theme.colors.surface }]}>{message}</Text>}
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={theme.colors.primary} />
      {message && <Text style={[styles.message, { color: theme.colors.surface }]}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 999,
  },
  container: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    marginTop: 8,
    textAlign: 'center',
  },
});

export default AppLoading;