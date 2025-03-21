// src/components/common/StatusBadge.tsx
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Badge, useTheme } from 'react-native-paper';

interface StatusBadgeProps {
  status: string;
  getStatusColor: (status: string, theme: any) => string;
  getStatusLabel: (status: string) => string;
  size?: 'small' | 'medium' | 'large';
  style?: any;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  getStatusColor,
  getStatusLabel,
  size = 'medium',
  style,
}) => {
  const theme = useTheme();
  const backgroundColor = getStatusColor(status, theme);
  const label = getStatusLabel(status);

  // If we want a custom size badge, we need to create our own
  if (size === 'small' || size === 'large') {
    return (
      <View
        style={[
          styles.customBadge,
          size === 'small' ? styles.smallBadge : styles.largeBadge,
          { backgroundColor },
          style,
        ]}
      >
        <Text
          style={[
            styles.customBadgeText,
            size === 'small' ? styles.smallBadgeText : styles.largeBadgeText,
            { color: 'white' },
          ]}
        >
          {label}
        </Text>
      </View>
    );
  }

  // Use the default Paper Badge for medium size
  return (
    <Badge
      style={[
        styles.badge,
        { backgroundColor },
        style,
      ]}
    >
      {label}
    </Badge>
  );
};

const styles = StyleSheet.create({
  badge: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  customBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  smallBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  largeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  customBadgeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  smallBadgeText: {
    fontSize: 10,
  },
  largeBadgeText: {
    fontSize: 14,
  },
});

export default StatusBadge;