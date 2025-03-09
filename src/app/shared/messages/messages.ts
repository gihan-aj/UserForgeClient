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
    confirmation: {
      edit: {
        title: 'Confirm Edit',
        message: 'Are you sure you want to edit the role: {roleName}?',
        action: 'Edit',
      },
      activate: {
        title: 'Confirm Activation',
        message: {
          single: 'Are you sure you want to activate the role: {roleName}?',
          multiple: 'Are you sure you want activate selected roles?',
        },
        action: 'Activate',
      },
      deactivate: {
        title: 'Confirm Deactivation',
        message: {
          single: 'Are you sure you want to deactivate the role: {roleName}?',
          multiple: 'Are you sure you want deactivate selected roles?',
        },
        action: 'Deactivate',
      },
      delete: {
        title: 'Confirm Delete',
        message: {
          single: 'Are you sure you want to delete the role: {roleName}?',
          multiple: 'Are you sure you want delete selected roles?',
        },
        action: 'Delete',
      },
    },
    notification: {
      create: {
        success: 'Role created successfully.',
        fail: 'Failed to create the role',
      },
      edit: {
        success: 'Role updated successfully.',
        fail: 'Failed to update the role.',
      },
      activate: {
        success: {
          single: 'Role was activated successfully.',
          multiple: 'Roles were activated successfully.',
        },
        fail: {
          single: 'Failed to activate the role.',
          multiple: 'Failed to activate roles.',
        },
      },
      deactivate: {
        success: {
          single: 'Role was deactivated successfully.',
          multiple: 'Roles were deactivated successfully.',
        },
        fail: {
          single: 'Failed to deactivate the role.',
          multiple: 'Failed to deactivate roles.',
        },
      },
      delete: {
        success: {
          single: 'Role was deleted successfully.',
          multiple: 'Roles were deleted successfully.',
        },
        fail: {
          single: 'Failed to delete the role.',
          multiple: 'Failed to delete roles.',
        },
      },
    },
    alert: {
      protected: {
        title: 'Restricted Action',
        message: 'You cannot {action} default roles.',
      },
      activate: {
        title: 'Activation Successful',
        message: '',
      },
      deactivate: {
        title: 'Deactivation Successful',
        message: '',
      },
      delete: {
        title: 'Delete Successful',
        message: '',
      },
      appNotSelected: {
        title: 'App Not Selected',
        message: 'Please select an app to proceed',
      },
    },
  },
  appManagement: {
    validation: {
      name: {
        required: 'App name is required.',
        minLength:
          'App name must be at least {appNameMinLnegth} characters long.',
        maxLength:
          'App name must be maximum {appNameMaxLnegth} characters long.',
      },
      description: {
        maxLength:
          'description must be maximum {descriptionMaxLnegth} characters long.',
      },
    },
    confirmation: {
      editApp: {
        title: 'Confirm Edit',
        message: 'Are you sure you want to edit the app: {appName}?',
        action: 'Edit',
      },
      activate: {
        title: 'Confirm Activation',
        message: {
          single: 'Are you sure you want to activate the app: {appName}?',
          multiple: 'Are you sure you want activate selected apps?',
        },
        action: 'Activate',
      },
      deactivate: {
        title: 'Confirm Deactivation',
        message: {
          single: 'Are you sure you want to deactivate the app: {appName}?',
          multiple: 'Are you sure you want deactivate selected apps?',
        },
        action: 'Deactivate',
      },
      delete: {
        title: 'Confirm Delete',
        message: {
          single: 'Are you sure you want to delete the app: {appName}?',
          multiple: 'Are you sure you want delete selected apps?',
        },
        action: 'Delete',
      },
    },
    notification: {
      create: {
        success: 'App created successfully.',
        fail: 'Failed to create the app',
      },
      edit: {
        success: 'App updated successfully.',
        fail: 'Failed to update the app.',
      },
      activate: {
        success: {
          single: 'App was activated successfully.',
          multiple: 'Apps were activated successfully.',
        },
        fail: {
          single: 'Failed to activate the app.',
          multiple: 'Failed to activate apps.',
        },
      },
      deactivate: {
        success: {
          single: 'App was deactivated successfully.',
          multiple: 'Apps were deactivated successfully.',
        },
        fail: {
          single: 'Failed to deactivate the app.',
          multiple: 'Failed to deactivate apps.',
        },
      },
      delete: {
        success: {
          single: 'App was deleted successfully.',
          multiple: 'Apps were deleted successfully.',
        },
        fail: {
          single: 'Failed to delete the app.',
          multiple: 'Failed to delete apps.',
        },
      },
    },
    alert: {
      protected: {
        title: 'Restricted Action',
        message: 'You cannot {action} default apps.',
      },
      activate: {
        title: 'Activation Successful',
        message: '',
      },
      deactivate: {
        title: 'Deactivation Successful',
        message: '',
      },
      delete: {
        title: 'Delete Successful',
        message: '',
      },
    },
  },
};
