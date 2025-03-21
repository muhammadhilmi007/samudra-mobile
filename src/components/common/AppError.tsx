// src/components/common/AppError.tsx
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface AppErrorProps {
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
}

const AppError: React.FC<AppErrorProps> = ({
  message,
  onRetry,
  retryLabel = 'Coba Lagi',
}) => {
  const theme = useTheme();
  
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        name="alert-circle-outline"
        size={64}
        color={theme.colors.error}
      />
      
      <Text style={[styles.message, { color: theme.colors.onSurface }]}>
        {message}
      </Text>
      
      {onRetry && (
        <Button
          mode="contained"
          onPress={onRetry}
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          labelStyle={{ color: theme.colors.surface }}
        >
          {retryLabel}
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
    fontSize: 16,
  },
  button: {
    marginTop: 8,
  },
});

export default AppError;