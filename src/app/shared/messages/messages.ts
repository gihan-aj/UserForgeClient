import { Messages } from './messages.type';

export const MESSAGES: Messages = {
  user: {
    validation: {
      login: {
        email: {
          required: 'Email is required.',
          invalid: 'Email is invalid.',
        },
        password: {
          required: 'Password is required.',
        },
      },
      registration: {
        firstName: {
          required: 'First name is required.',
          minLength:
            'First name must be at least {firstNameMinLnegth} characters long.',
          maxLength:
            'First name must be maximum {firstNameMaxLnegth} characters long.',
        },
        lastName: {
          required: 'Last name is required.',
          minLength:
            'Last name must be at least {lastNameMinLnegth} characters long.',
          maxLength:
            'Last name must be maximum {lastNameMaxLnegth} characters long.',
        },
        email: {
          required: 'Email is required.',
          invalid: 'Email is invalid',
        },
        phoneNumber: {
          invalid: 'Phoen number is invalid',
        },
        dateOfBirth: {
          invalidAge: 'You must be at least {minAge} years old.',
          invalidFormat: 'Please enter a valid date in MM/DD/YYYY format.',
          genericError: 'Invalid date of birth.',
        },
        password: {
          required: 'Password is required.',
          minLength:
            'Password must be at least {passwordMinLength} characters long.',
          maxLength:
            'Password must be maximum {passwordMaxLength} characters long.',
          requireDigit: 'Password must contain at least one digit.',
          requireLowercase:
            'Password must contain at least one lowercase letter',
          requireUppercase:
            'Password must contain at least one uppercase letter',
          requireNonAlphanumeric:
            'Password must contain at least one non-alphanumeric character.',
        },
        confirmPassword: {
          required: 'Confirm Password is required',
          passwordMismatch: 'Password mismatch',
        },
      },
    },
    notification: {
      login: {
        success: 'Welcome! {firstName} {lastName}',
        fail: 'Sorry! Login failed.',
      },
      refresh: {
        fail: 'Authentication falied. Please log in again.',
      },
      logout: {
        success: 'Log out successful!',
        fail: 'Log out failed!',
      },
      alreadyLoggedIn: 'You have already logged in.',
      saveUserSettings: {
        success: 'Settings have been saved successfully.',
        fail: 'Saving settings failed.',
      },
      fetchPermissions: {
        fail: 'Sorry! Could not fetch you permissions.',
      },
      registration: {
        success: 'Account creation successful.',
        fail: 'Account creation failed.',
      },
      emailConfirmation: {
        success: 'Email confirmed successfully.',
        fail: 'Email confirmation failed.',
        loading: 'Please wait for confirmation.'
      },
    },
    alert: {
      registration: {
        title: 'Account Created',
        message:
          'Account is successfully created. Please check your mail inbox for email confirmation link.',
      },
    },
    confirmation: {
      logout: {
        title: 'Log Out Confirmation',
        message: 'Are you sure you want to log out from this device?',
        action: 'Log out',
      },
    },
  },
};
