// src/components/common/AppEmpty.tsx
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface AppEmptyProps {
  icon?: string;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const AppEmpty: React.FC<AppEmptyProps> = ({
  icon = 'database-off',
  title,
  message,
  actionLabel,
  onAction,
}) => {
  const theme = useTheme();
  
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        name={icon as any}
        size={64}
        color={theme.colors.outline}
      />
      
      <Text style={[styles.title, { color: theme.colors.onSurface }]}>
        {title}
      </Text>
      
      {message && (
        <Text style={[styles.message, { color: theme.colors.secondary }]}>
          {message}
        </Text>
      )}
      
      {actionLabel && onAction && (
        <Button
          mode="contained"
          onPress={onAction}
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          labelStyle={{ color: theme.colors.surface }}
        >
          {actionLabel}
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  message: {
    marginTop: 8,
    marginBottom: 24,
    textAlign: 'center',
    fontSize: 14,
  },
  button: {
    marginTop: 16,
  },
});

export default AppEmpty;