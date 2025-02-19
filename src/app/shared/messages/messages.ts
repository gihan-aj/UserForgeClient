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
        loading: 'Please wait for confirmation.',
      },
      userDetails: {
        fail: 'Failed to fetch user details. Plase log out and log in again.',
      },
    },
    alert: {
      registration: {
        title: 'Account Created',
        message:
          'Account is successfully created. Please check your mail inbox for email confirmation link.',
      },
      sendEmail: {
        emailConfirmationLink: {
          success: {
            title: 'Sending Email Successful',
            message:
              'Email confirmation link was sent successfully. Please check the inbox.',
          },
          failure: {
            title: 'Sending Email Failed',
            message:
              'Email confirmation link was not sent. Please try again later.',
          },
        },
        passwordResetLink: {
          success: {
            title: 'Sending Email Successful',
            message:
              'Password reseet link was sent successfully. Please check the inbox.',
          },
          failure: {
            title: 'Sending Email Failed',
            message:
              'Password reset link was not sent. Please try again later.',
          },
        },
        resetPassword: {
          success: {
            title: 'Password is reset',
            message: 'You can login with the new password now.',
          },
        },
      },
      userProfileUpdated: {
        success: {
          title: 'User Profile Updated.',
          message: 'Your user prfile details updated successfully.',
        },
      },
    },
    confirmation: {
      logout: {
        title: 'Log Out?',
        message: 'Are you sure you want to log out from this device?',
        action: 'Log out',
      },
      editUserDetails: {
        title: 'Edit User Profile?',
        message: 'Are you sure you want to edit your user profile?',
        action: 'Yes',
      },
    },
  },
  userManagement: {
    confirmation: {
      activateUsers: {
        title: 'Confirm Activation',
        message: 'Are you sure you want to activate selected users?',
        messageSingle:
          'Are you sure you want to activate user with email: {email}?',
        action: 'Activate',
      },
      deactivateUsers: {
        title: 'Confirm Deactivation',
        message: 'Are you sure you want to deactivate selected users?',
        messageSingle:
          'Are you sure you want to deactivate user with email: {email}?',
        action: 'Deactivate',
      },
      editUser: {
        title: 'Confiirm Edit',
        message: 'Are you sure you want to edit user with email: {email}',
        action: 'Edit',
      },
      deleteUsers: {
        title: 'Confirm Delete',
        message: 'Are you sure you want to activate selected users?',
        messageSingle:
          'Are you sure you want to activate user with email: {email}?',
        action: 'Delete',
      },
      assignRoles: {
        title: 'Confirm Role Assignment',
        message:
          'Are you sure you want to change roles for these users? Selecting multiple user will prevent you from seeing already assigned roles.',
        messageSingle:
          'Are you sure you want to change roles for the user with email : {email}',
        action: 'Yes',
      },
    },
    alert: {
      activate: {
        success: {
          title: 'Successfully Activated!',
          mssage: '',
        },
      },
      deactivate: {
        success: {
          title: 'Successfully Deactivated!',
          mssage: '',
        },
      },
      delete: {
        success: {
          title: 'Successfully Deleted!',
          mssage: '',
        },
      },
      restrictedAction: {
        title: 'Restricted Action!',
        mssage: 'You cannot {action} a default user.',
      },
      noRolesAssigned: {
        title: 'No Roles Assigned',
        mssage: 'You have to assign atleast one role to a user.',
      },
      assignRole: {
        success: {
          title: 'Role Changed',
          message: 'Role was assigned successfully.',
        },
      },
      assignRoles: {
        success: {
          title: 'Roles Changed',
          message: 'Roles were assigned successfully.',
        },
      },
    },
  },
  roleManagement: {
    validation: {
      roleName: {
        required: 'Role name is required.',
        minLength:
          'Role name must be at least {roleNameMinLnegth} characters long.',
        maxLength:
          'Role name must be maximum {roleNameMaxLnegth} characters long.',
      },
      description: {
        maxLength:
          'description must be maximum {descriptionMaxLnegth} characters long.',
      },
    },
  },
};
