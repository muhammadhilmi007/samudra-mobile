// src/components/common/AppButton.tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, useTheme } from 'react-native-paper';

interface AppButtonProps {
  mode?: 'text' | 'outlined' | 'contained';
  onPress: () => void;
  label: string;
  icon?: string;
  loading?: boolean;
  disabled?: boolean;
  color?: string;
  textColor?: string;
  fullWidth?: boolean;
  style?: any;
  labelStyle?: any;
  uppercase?: boolean;
  compact?: boolean;
}

const AppButton: React.FC<AppButtonProps> = ({
  mode = 'contained',
  onPress,
  label,
  icon,
  loading = false,
  disabled = false,
  color,
  textColor,
  fullWidth = false,
  style,
  labelStyle,
  uppercase = false,
  compact = false,
}) => {
  const theme = useTheme();

  // Determine button colors
  const buttonColor = color || 
    (mode === 'contained' ? theme.colors.primary : 
     mode === 'outlined' ? 'transparent' : 'transparent');
  
  // Determine text colors
  const buttonTextColor = textColor || 
    (mode === 'contained' ? theme.colors.surface : 
     mode === 'outlined' ? theme.colors.primary : theme.colors.primary);

  return (
    <View style={[fullWidth && styles.fullWidth]}>
      <Button
        mode={mode}
        onPress={onPress}
        icon={icon}
        loading={loading}
        disabled={disabled}
        color={buttonColor}
        style={[
          styles.button,
          mode === 'outlined' && styles.outlinedButton,
          fullWidth && styles.fullWidthButton,
          style,
        ]}
        labelStyle={[
          { color: buttonTextColor },
          styles.label,
          labelStyle,
        ]}
        uppercase={uppercase}
        compact={compact}
      >
        {label}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 4,
    paddingVertical: 6,
  },
  outlinedButton: {
    borderWidth: 1,
  },
  fullWidth: {
    width: '100%',
  },
  fullWidthButton: {
    width: '100%',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 0.5,
  },
});

export default AppButton;