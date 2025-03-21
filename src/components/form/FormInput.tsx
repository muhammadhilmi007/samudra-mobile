// src/components/form/FormInput.tsx
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInput, HelperText, useTheme } from 'react-native-paper';

interface FormInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'number-pad' | 'decimal-pad' | 'numeric' | 'email-address' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  disabled?: boolean;
  error?: string;
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  style?: any;
  testID?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  value,
  onChangeText,
  onBlur,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  autoCorrect = false,
  disabled = false,
  error,
  multiline = false,
  numberOfLines = 1,
  maxLength,
  leftIcon,
  rightIcon,
  onRightIconPress,
  style,
  testID,
}) => {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

  // Handle secure text entry with visibility toggle
  const isSecure = secureTextEntry && !isPasswordVisible;
  
  // Password visibility toggle icon
  const passwordVisibilityIcon = secureTextEntry
    ? isPasswordVisible
      ? 'eye-off'
      : 'eye'
    : undefined;
  
  // Handle right icon (password visibility or custom)
  const rightIconToShow = secureTextEntry
    ? passwordVisibilityIcon
    : rightIcon;
  
  // Handle right icon press (password visibility or custom)
  const handleRightIconPress = secureTextEntry
    ? () => setIsPasswordVisible(!isPasswordVisible)
    : onRightIconPress;

  return (
    <View style={[styles.container, style]}>
      <TextInput
        label={label}
        value={value}
        onChangeText={onChangeText}
        onBlur={() => {
          setIsFocused(false);
          if (onBlur) onBlur();
        }}
        onFocus={() => setIsFocused(true)}
        placeholder={placeholder}
        secureTextEntry={isSecure}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        disabled={disabled}
        error={!!error}
        multiline={multiline}
        numberOfLines={multiline ? numberOfLines : 1}
        maxLength={maxLength}
        left={leftIcon ? <TextInput.Icon name={leftIcon} /> : undefined}
        right={
          rightIconToShow ? (
            <TextInput.Icon
              name={rightIconToShow}
              onPress={handleRightIconPress}
              color={
                secureTextEntry
                  ? theme.colors.primary
                  : undefined
              }
            />
          ) : undefined
        }
        mode="outlined"
        style={styles.input}
        testID={testID}
      />
      
      {error && (
        <HelperText type="error" visible={!!error} style={styles.errorText}>
          {error}
        </HelperText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: 'transparent',
  },
  errorText: {
    marginTop: 4,
    marginBottom: 0,
  },
});

export default FormInput;