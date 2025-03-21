// src/components/common/AppHeader.tsx
import React from 'react';
import { StyleSheet } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  backButton?: boolean;
  rightAction?: {
    icon: string;
    onPress: () => void;
    label?: string;
  };
  secondRightAction?: {
    icon: string;
    onPress: () => void;
    label?: string;
  };
}

const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  backButton = false,
  rightAction,
  secondRightAction,
}) => {
  const navigation = useNavigation();
  const theme = useTheme();
  
  return (
    <Appbar.Header
      style={[styles.header, { backgroundColor: theme.colors.primary }]}
    >
      {backButton && (
        <Appbar.BackAction onPress={() => navigation.goBack()} color={theme.colors.surface} />
      )}
      
      <Appbar.Content
        title={title}
        subtitle={subtitle}
        titleStyle={styles.title}
        subtitleStyle={styles.subtitle}
      />
      
      {secondRightAction && (
        <Appbar.Action
          icon={({ size, color }) => (
            <MaterialCommunityIcons name={secondRightAction.icon as any} size={size} color={color} />
          )}
          onPress={secondRightAction.onPress}
          color={theme.colors.surface}
        />
      )}
      
      {rightAction && (
        <Appbar.Action
          icon={({ size, color }) => (
            <MaterialCommunityIcons name={rightAction.icon as any} size={size} color={color} />
          )}
          onPress={rightAction.onPress}
          color={theme.colors.surface}
        />
      )}
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  header: {
    elevation: 4,
  },
  title: {
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 12,
  },
});

export default AppHeader;