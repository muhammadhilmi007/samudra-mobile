// src/components/form/DatePicker.tsx
import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Platform } from 'react-native';
import { TextInput, HelperText, useTheme } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface DatePickerProps {
  label: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  minDate?: Date;
  maxDate?: Date;
  format?: string;
  mode?: 'date' | 'time' | 'datetime';
  style?: any;
  testID?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onChange,
  onBlur,
  placeholder = 'Pilih tanggal',
  disabled = false,
  error,
  minDate,
  maxDate,
  format: dateFormat = 'dd/MM/yyyy',
  mode = 'date',
  style,
  testID,
}) => {
  const theme = useTheme();
  const [show, setShow] = useState(false);
  
  // Format the selected date for display
  const getFormattedDate = () => {
    if (!value) return '';
    
    try {
      if (mode === 'date') {
        return format(value, dateFormat, { locale: id });
      } else if (mode === 'time') {
        return format(value, 'HH:mm', { locale: id });
      } else if (mode === 'datetime') {
        return format(value, `${dateFormat} HH:mm`, { locale: id });
      }
    } catch (err) {
      console.error('Error formatting date:', err);
    }
    
    return '';
  };

  // Open date picker
  const showDatePicker = () => {
    if (!disabled) {
      setShow(true);
    }
  };

  // Handle date change
  const handleChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || value;
    
    // Hide the picker on iOS
    if (Platform.OS === 'ios') {
      // For iOS, we don't hide the picker automatically
    } else {
      setShow(false);
    }
    
    onChange(currentDate || null);
  };

  // Handle cancel (iOS only)
  const handleCancel = () => {
    setShow(false);
    if (onBlur) onBlur();
  };

  // Handle confirm (iOS only)
  const handleConfirm = (selectedDate: Date) => {
    setShow(false);
    onChange(selectedDate);
    if (onBlur) onBlur();
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        activeOpacity={disabled ? 1 : 0.7}
        onPress={showDatePicker}
        testID={testID}
      >
        <TextInput
          label={label}
          value={getFormattedDate()}
          placeholder={placeholder}
          mode="outlined"
          editable={false}
          pointerEvents="none"
          error={!!error}
          style={styles.input}
          right={
            <TextInput.Icon
              name={
                mode === 'date'
                  ? 'calendar'
                  : mode === 'time'
                  ? 'clock-outline'
                  : 'calendar-clock'
              }
            />
          }
        />
      </TouchableOpacity>
      
      {error && (
        <HelperText type="error" visible={!!error} style={styles.errorText}>
          {error}
        </HelperText>
      )}
      
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={value || new Date()}
          mode={mode === 'datetime' ? 'date' : mode}
          is24Hour={true}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleChange}
          minimumDate={minDate}
          maximumDate={maxDate}
          style={styles.datePicker}
        />
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
  datePicker: {
    width: '100%',
  },
});

export default DatePicker;