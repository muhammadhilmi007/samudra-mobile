// src/components/form/FormSelect.tsx
import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import {
  TextInput,
  HelperText,
  Menu,
  useTheme,
  Text,
  List,
  Divider,
} from 'react-native-paper';

interface SelectOption {
  label: string;
  value: string | number;
  icon?: string;
}

interface FormSelectProps {
  label: string;
  value: string | number;
  options: SelectOption[];
  onSelect: (option: SelectOption) => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  style?: any;
  testID?: string;
}

const FormSelect: React.FC<FormSelectProps> = ({
  label,
  value,
  options,
  onSelect,
  onBlur,
  placeholder = 'Pilih opsi',
  disabled = false,
  error,
  style,
  testID,
}) => {
  const theme = useTheme();
  const [menuVisible, setMenuVisible] = useState(false);
  
  // Find the selected option to display its label
  const selectedOption = options.find(option => option.value === value);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  // Open menu
  const openMenu = () => {
    if (!disabled) {
      setMenuVisible(true);
    }
  };

  // Close menu
  const closeMenu = () => {
    setMenuVisible(false);
    if (onBlur) onBlur();
  };

  // Handle option selection
  const handleSelect = (option: SelectOption) => {
    onSelect(option);
    closeMenu();
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        activeOpacity={disabled ? 1 : 0.7}
        onPress={openMenu}
        testID={testID}
      >
        <TextInput
          label={label}
          value={displayText}
          mode="outlined"
          editable={false}
          pointerEvents="none"
          error={!!error}
          style={styles.input}
          right={<TextInput.Icon name="menu-down" />}
        />
      </TouchableOpacity>
      
      {error && (
        <HelperText type="error" visible={!!error} style={styles.errorText}>
          {error}
        </HelperText>
      )}
      
      <Menu
        visible={menuVisible}
        onDismiss={closeMenu}
        anchor={{ x: 0, y: 0 }}
        style={styles.menu}
        contentStyle={styles.menuContent}
      >
        {options.map((option, index) => (
          <React.Fragment key={option.value.toString()}>
            <TouchableOpacity
              onPress={() => handleSelect(option)}
              style={[
                styles.menuItem,
                option.value === value && {
                  backgroundColor: theme.colors.primary + '20', // 20% opacity
                },
              ]}
            >
              <List.Item
                title={option.label}
                left={
                  option.icon
                    ? props => <List.Icon {...props} icon={option.icon} />
                    : undefined
                }
                right={
                  option.value === value
                    ? props => <List.Icon {...props} icon="check" color={theme.colors.primary} />
                    : undefined
                }
                titleStyle={
                  option.value === value
                    ? { color: theme.colors.primary, fontWeight: 'bold' }
                    : {}
                }
                style={styles.listItem}
              />
            </TouchableOpacity>
            {index < options.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </Menu>
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
  menu: {
    width: '92%',
    marginLeft: '4%',
    marginTop: 60,
  },
  menuContent: {
    maxHeight: 300,
  },
  menuItem: {
    width: '100%',
  },
  listItem: {
    padding: 0,
  },
});

export default FormSelect;