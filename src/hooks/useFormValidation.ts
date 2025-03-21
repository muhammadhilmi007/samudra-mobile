// src/hooks/useFormValidation.ts
import { useState, useCallback } from 'react';

interface Validation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  isEmail?: boolean;
  isNumeric?: boolean;
  isInteger?: boolean;
  min?: number;
  max?: number;
  custom?: (value: any) => boolean | string;
}

interface ValidationError {
  [key: string]: string;
}

interface FieldConfig {
  [key: string]: {
    validation: Validation;
    errorMessage?: {
      required?: string;
      minLength?: string;
      maxLength?: string;
      pattern?: string;
      isEmail?: string;
      isNumeric?: string;
      isInteger?: string;
      min?: string;
      max?: string;
      custom?: string;
    };
  };
}

type FormValues = {
  [key: string]: any;
};

/**
 * Custom hook for form validation
 * @param config Validation configuration for each field
 * @param initialValues Initial form values
 * @returns Form state and validation methods
 */
function useFormValidation(
  config: FieldConfig,
  initialValues: FormValues = {}
) {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<ValidationError>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  // Email validation pattern
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Validate a single field
  const validateField = useCallback(
    (name: string, value: any) => {
      if (!config[name]) return true;

      const { validation, errorMessage = {} } = config[name];
      
      // Required validation
      if (validation.required && (value === '' || value === null || value === undefined)) {
        return errorMessage.required || 'Field ini wajib diisi';
      }
      
      // Skip other validations if value is empty and not required
      if (value === '' || value === null || value === undefined) {
        return true;
      }

      // String length validations (for string values)
      if (typeof value === 'string') {
        if (validation.minLength && value.length < validation.minLength) {
          return errorMessage.minLength || 
            `Minimum ${validation.minLength} karakter`;
        }

        if (validation.maxLength && value.length > validation.maxLength) {
          return errorMessage.maxLength || 
            `Maksimum ${validation.maxLength} karakter`;
        }
      }

      // Pattern validation
      if (validation.pattern && !validation.pattern.test(value.toString())) {
        return errorMessage.pattern || 'Format tidak valid';
      }

      // Email validation
      if (validation.isEmail && !emailPattern.test(value.toString())) {
        return errorMessage.isEmail || 'Email tidak valid';
      }

      // Numeric validation
      if (validation.isNumeric && !/^-?\d*\.?\d+$/.test(value.toString())) {
        return errorMessage.isNumeric || 'Harus berupa angka';
      }

      // Integer validation
      if (validation.isInteger && !/^-?\d+$/.test(value.toString())) {
        return errorMessage.isInteger || 'Harus berupa bilangan bulat';
      }

      // Min/Max validations (for numeric values)
      const numValue = Number(value);
      if (!isNaN(numValue)) {
        if (validation.min !== undefined && numValue < validation.min) {
          return errorMessage.min || `Minimal ${validation.min}`;
        }

        if (validation.max !== undefined && numValue > validation.max) {
          return errorMessage.max || `Maksimal ${validation.max}`;
        }
      }

      // Custom validation
      if (validation.custom) {
        const customResult = validation.custom(value);
        if (customResult !== true) {
          return errorMessage.custom || customResult || 'Tidak valid';
        }
      }

      return true;
    },
    [config]
  );

  // Handle field change
  const handleChange = useCallback(
    (name: string, value: any) => {
      setValues((prev) => ({
        ...prev,
        [name]: value,
      }));

      if (touched[name]) {
        const validationResult = validateField(name, value);
        
        if (validationResult === true) {
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[name];
            return newErrors;
          });
        } else {
          setErrors((prev) => ({
            ...prev,
            [name]: validationResult as string,
          }));
        }
      }
    },
    [touched, validateField]
  );

  // Handle field blur
  const handleBlur = useCallback(
    (name: string) => {
      setTouched((prev) => ({
        ...prev,
        [name]: true,
      }));

      const validationResult = validateField(name, values[name]);
      
      if (validationResult === true) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      } else {
        setErrors((prev) => ({
          ...prev,
          [name]: validationResult as string,
        }));
      }
    },
    [values, validateField]
  );

  // Validate all fields
  const validateForm = useCallback(() => {
    const newErrors: ValidationError = {};
    let isValid = true;

    // Mark all fields as touched
    const newTouched: { [key: string]: boolean } = {};
    Object.keys(config).forEach((name) => {
      newTouched[name] = true;
    });
    setTouched(newTouched);

    // Validate each field
    Object.keys(config).forEach((name) => {
      const validationResult = validateField(name, values[name]);
      
      if (validationResult !== true) {
        newErrors[name] = validationResult as string;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [config, values, validateField]);

  // Reset form
  const resetForm = useCallback((newValues: FormValues = {}) => {
    setValues(newValues);
    setErrors({});
    setTouched({});
  }, []);

  // Set form values
  const setFormValues = useCallback((newValues: FormValues) => {
    setValues((prev) => ({
      ...prev,
      ...newValues,
    }));
  }, []);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
    setFormValues,
    isValid: Object.keys(errors).length === 0,
  };
}

export default useFormValidation;