// src/components/form/FormSubmitButton.tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, useTheme } from 'react-native-paper';

interface FormSubmitButtonProps {
  onSubmit: () => void;
  label: string;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: any;
  testID?: string;
  submitIcon?: string;
  secondaryAction?: {
    label: string;
    onPress: () => void;
    icon?: string;
  };
}

const FormSubmitButton: React.FC<FormSubmitButtonProps> = ({
  onSubmit,
  label,
  loading = false,
  disabled = false,
  fullWidth = true,
  style,
  testID,
  submitIcon = 'check',
  secondaryAction,
}) => {
  const theme = useTheme();

  // If we have a secondary action, we want to show both buttons side by side
  const hasSecondaryAction = !!secondaryAction;

  return (
    <View
      style={[
        styles.container,
        hasSecondaryAction && styles.rowContainer,
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      {hasSecondaryAction && (
        <Button
          mode="outlined"
          onPress={secondaryAction.onPress}
          icon={secondaryAction.icon}
          style={[
            styles.button,
            styles.secondaryButton,
            hasSecondaryAction && styles.halfWidthButton,
          ]}
          disabled={loading || disabled}
          color={theme.colors.primary}
          testID={`${testID}-secondary`}
        >
          {secondaryAction.label}
        </Button>
      )}

      <Button
        mode="contained"
        onPress={onSubmit}
        loading={loading}
        disabled={loading || disabled}
        icon={!loading ? submitIcon : undefined}
        style={[
          styles.button,
          styles.primaryButton,
          hasSecondaryAction && styles.halfWidthButton,
        ]}
        labelStyle={styles.buttonLabel}
        color={theme.colors.primary}
        testID={testID}
      >
        {label}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    marginBottom: 16,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fullWidth: {
    width: '100%',
  },
  button: {
    borderRadius: 4,
    paddingVertical: 6,
  },
  primaryButton: {
    flex: 1,
  },
  secondaryButton: {
    flex: 1,
    marginRight: 8,
  },
  halfWidthButton: {
    flex: 1,
  },
  buttonLabel: {
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 0.5,
  },
});

export default FormSubmitButton;