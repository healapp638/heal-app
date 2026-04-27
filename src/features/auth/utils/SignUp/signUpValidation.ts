import { DobDateParts } from '../../../../modals/DobPickerModal';
import AppUtils from '../../../../utils/appUtils';

type Country = {
  name: string;
  isoCode: string;
} | null;

type AppKeys = {
  toastEnterFullName?: string;
  toastSelectCountry?: string;
  toastEnterEmail?: string;
  toastInvalidEmail?: string;
  toastSelectBirthDate?: string;
  ageRequirementMsg?: string;
  toastEnterPassword?: string;
  toastPasswordRequirementsDetailed?: string;
  passwordRequirementTitle?: string;
  passwordReq1?: string;
  passwordReq2?: string;
  passwordReq3?: string;
  passwordReq4?: string;
  toastEnterConfirmPassword?: string;
  toastPasswordMismatch?: string;
};

type SignUpValidationParams = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  selectedCountry: Country;
  isDobSelected: boolean;
  selectedDate: DobDateParts;
  localizedMonths: string[];
  appkeys?: AppKeys;
};

type SignUpValidationResult = {
  isValid: boolean;
  message: string;
  duration?: number;
};

const ENGLISH_MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const getMonthIndex = (monthName: string, localizedMonths: string[]) => {
  const localizedIndex = localizedMonths.indexOf(monthName);

  if (localizedIndex !== -1) {
    return localizedIndex;
  }

  return ENGLISH_MONTHS.indexOf(monthName);
};

export const isAtLeast13YearsOld = (
  date: DobDateParts,
  localizedMonths: string[],
) => {
  const monthIndex = getMonthIndex(date.month, localizedMonths);
  const day = Number(date.day);
  const year = Number(date.year);

  if (monthIndex < 0 || Number.isNaN(day) || Number.isNaN(year)) {
    return false;
  }

  const birthDate = new Date(year, monthIndex, day);
  if (Number.isNaN(birthDate.getTime())) {
    return false;
  }

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age -= 1;
  }

  return age >= 13;
};

export const isPasswordValid = (value: string) => {
  const hasMinLength = value.length >= 8;
  const hasUppercase = /[A-Z]/.test(value);
  const hasNumber = /\d/.test(value);
  const hasSpecialChar = /[!@#$%^&*]/.test(value);

  return hasMinLength && hasUppercase && hasNumber && hasSpecialChar;
};

export const validateSignUpForm = ({
  fullName,
  email,
  password,
  confirmPassword,
  selectedCountry,
  isDobSelected,
  selectedDate,
  localizedMonths,
  appkeys,
}: SignUpValidationParams): SignUpValidationResult => {
  const trimmedFullName = fullName.trim();
  const trimmedEmail = email.trim();

  if (!trimmedFullName) {
    return {
      isValid: false,
      message: appkeys?.toastEnterFullName || 'Please enter your full name.',
    };
  }

  if (!selectedCountry) {
    return {
      isValid: false,
      message: appkeys?.toastSelectCountry || 'Please select your country.',
    };
  }

  if (!trimmedEmail) {
    return {
      isValid: false,
      message: appkeys?.toastEnterEmail || 'Please enter your email.',
    };
  }

  if (!AppUtils.validateEmail(trimmedEmail)) {
    return {
      isValid: false,
      message:
        appkeys?.toastInvalidEmail || 'Please enter a valid email address.',
    };
  }

  if (!isDobSelected) {
    return {
      isValid: false,
      message:
        appkeys?.toastSelectBirthDate || 'Please select your birth date.',
    };
  }

  if (!isAtLeast13YearsOld(selectedDate, localizedMonths)) {
    return {
      isValid: false,
      message:
        appkeys?.ageRequirementMsg ||
        'You must be at least 13 years old to use HEAL.',
    };
  }

  if (!password) {
    return {
      isValid: false,
      message: appkeys?.toastEnterPassword || 'Please enter your password.',
    };
  }

  if (!isPasswordValid(password)) {
    return {
      isValid: false,
      message:
        appkeys?.toastPasswordRequirementsDetailed ||
        'Password must be at least 8 characters, include 1 uppercase letter, 1 number, and 1 special character.',
      duration: 4500,
    };
  }

  if (!confirmPassword) {
    return {
      isValid: false,
      message:
        appkeys?.toastEnterConfirmPassword || 'Please confirm your password.',
    };
  }

  if (password !== confirmPassword) {
    return {
      isValid: false,
      message: appkeys?.toastPasswordMismatch || 'Passwords do not match.',
    };
  }

  return {
    isValid: true,
    message: '',
  };
};
