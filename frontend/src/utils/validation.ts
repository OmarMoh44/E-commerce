// Validation utility functions
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateField = (value: any, rules: ValidationRule): ValidationResult => {
  const errors: string[] = [];

  // Required validation
  if (rules.required && (!value || value.trim() === '')) {
    errors.push('This field is required');
  }

  // Skip other validations if value is empty and not required
  if (!value || value.trim() === '') {
    return { isValid: errors.length === 0, errors };
  }

  // Min length validation
  if (rules.minLength && value.length < rules.minLength) {
    errors.push(`Minimum length is ${rules.minLength} characters`);
  }

  // Max length validation
  if (rules.maxLength && value.length > rules.maxLength) {
    errors.push(`Maximum length is ${rules.maxLength} characters`);
  }

  // Pattern validation
  if (rules.pattern && !rules.pattern.test(value)) {
    errors.push('Invalid format');
  }

  // Custom validation
  if (rules.custom) {
    const customError = rules.custom(value);
    if (customError) {
      errors.push(customError);
    }
  }

  return { isValid: errors.length === 0, errors };
};

// Common validation rules
export const validationRules = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    custom: (value: string) => {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return 'Please enter a valid email address';
      }
      return null;
    }
  },
  password: {
    required: true,
    minLength: 8,
    custom: (value: string) => {
      if (value.length < 8) {
        return 'Password must be at least 8 characters long';
      }
      if (!/(?=.*[a-z])/.test(value)) {
        return 'Password must contain at least one lowercase letter';
      }
      if (!/(?=.*[A-Z])/.test(value)) {
        return 'Password must contain at least one uppercase letter';
      }
      if (!/(?=.*\d)/.test(value)) {
        return 'Password must contain at least one number';
      }
      return null;
    }
  },
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s]+$/,
    custom: (value: string) => {
      if (!/^[a-zA-Z\s]+$/.test(value)) {
        return 'Name can only contain letters and spaces';
      }
      return null;
    }
  },
  phone: {
    required: true,
    pattern: /^\+?[\d\s\-\(\)]+$/,
    custom: (value: string) => {
      const cleanPhone = value.replace(/[\s\-\(\)]/g, '');
      if (cleanPhone.length < 10) {
        return 'Phone number must be at least 10 digits';
      }
      return null;
    }
  },
  price: {
    required: true,
    custom: (value: string) => {
      const numValue = parseFloat(value);
      if (isNaN(numValue) || numValue <= 0) {
        return 'Price must be a positive number';
      }
      return null;
    }
  },
  quantity: {
    required: true,
    custom: (value: string) => {
      const numValue = parseInt(value);
      if (isNaN(numValue) || numValue <= 0) {
        return 'Quantity must be a positive number';
      }
      return null;
    }
  }
};

// Form validation helper
export const validateForm = (formData: Record<string, any>, rules: Record<string, ValidationRule>): Record<string, ValidationResult> => {
  const results: Record<string, ValidationResult> = {};

  for (const [fieldName, fieldRules] of Object.entries(rules)) {
    results[fieldName] = validateField(formData[fieldName], fieldRules);
  }

  return results;
};

// Check if form is valid
export const isFormValid = (validationResults: Record<string, ValidationResult>): boolean => {
  return Object.values(validationResults).every(result => result.isValid);
};

// Get all form errors
export const getFormErrors = (validationResults: Record<string, ValidationResult>): string[] => {
  const errors: string[] = [];
  Object.values(validationResults).forEach(result => {
    errors.push(...result.errors);
  });
  return errors;
}; 