import { Messages } from './messages.type';

export const MESSAGES: Messages = {
  user: {
    login: {
      validation: {
        email: {
          required: 'Email is required.',
          invalid: 'Email is invalid.',
        },
        password: {
          required: 'Password is required.',
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
      },
      confirmation: {
        logout: {
          title: 'Log Out Confirmation',
          message: 'Are you sure you want to log out from this device?',
          action: 'Log out',
        },
      },
    },
  },
};
