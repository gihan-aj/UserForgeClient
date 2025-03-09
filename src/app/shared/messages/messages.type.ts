export type Messages = {
  user: {
    validation: {
      login: {
        email: {
          required: string;
          invalid: string;
        };
        password: {
          required: string;
        };
      };
      registration: {
        firstName: {
          required: string;
          minLength: string;
          maxLength: string;
        };
        lastName: {
          required: string;
          minLength: string;
          maxLength: string;
        };
        email: {
          required: string;
          invalid: string;
        };
        phoneNumber: {
          invalid: string;
        };
        dateOfBirth: {
          invalidAge: string;
          invalidFormat: string;
          genericError: string;
        };
        password: {
          required: string;
          minLength: string;
          maxLength: string;
          requireDigit: string;
          requireLowercase: string;
          requireUppercase: string;
          requireNonAlphanumeric: string;
        };
        confirmPassword: {
          required: string;
          passwordMismatch: string;
        };
      };
    };
    notification: {
      login: {
        success: string;
        fail: string;
      };
      refresh: {
        fail: string;
      };
      logout: {
        success: string;
        fail: string;
      };
      alreadyLoggedIn: string;
      saveUserSettings: {
        success: string;
        fail: string;
      };
      fetchPermissions: {
        fail: string;
      };
      registration: {
        success: string;
        fail: string;
      };
      emailConfirmation: {
        loading: string;
        success: string;
        fail: string;
      };
      userDetails: {
        fail: string;
      };
    };
    alert: {
      registration: {
        title: string;
        message: string;
      };
      sendEmail: {
        emailConfirmationLink: {
          success: {
            title: string;
            message: string;
          };
          failure: {
            title: string;
            message: string;
          };
        };
        passwordResetLink: {
          success: {
            title: string;
            message: string;
          };
          failure: {
            title: string;
            message: string;
          };
        };
        resetPassword: {
          success: {
            title: string;
            message: string;
          };
        };
      };
      userProfileUpdated: {
        success: {
          title: string;
          message: string;
        };
      };
    };
    confirmation: {
      logout: {
        title: string;
        message: string;
        action: string;
      };
      editUserDetails: {
        title: string;
        message: string;
        action: string;
      };
    };
  };
  userManagement: {
    confirmation: {
      activateUsers: {
        title: string;
        message: string;
        messageSingle: string;
        action: string;
      };
      deactivateUsers: {
        title: string;
        message: string;
        messageSingle: string;
        action: string;
      };
      editUser: {
        title: string;
        message: string;
        action: string;
      };
      deleteUsers: {
        title: string;
        message: string;
        messageSingle: string;
        action: string;
      };
      assignRoles: {
        title: string;
        message: string;
        messageSingle: string;
        action: string;
      };
    };
    alert: {
      activate: {
        success: {
          title: string;
          mssage: string;
        };
      };
      deactivate: {
        success: {
          title: string;
          mssage: string;
        };
      };
      delete: {
        success: {
          title: string;
          mssage: string;
        };
      };
      restrictedAction: {
        title: string;
        mssage: string;
      };
      noRolesAssigned: {
        title: string;
        mssage: string;
      };
      assignRole: {
        success: {
          title: string;
          message: string;
        };
      };
      assignRoles: {
        success: {
          title: string;
          message: string;
        };
      };
    };
  };
  roleManagement: {
    validation: {
      roleName: {
        required: string;
        minLength: string;
        maxLength: string;
      };
      description: {
        maxLength: string;
      };
    };
    confirmation: {
      edit: {
        title: string;
        message: string;
        action: string;
      };
      activate: {
        title: string;
        message: {
          single: string;
          multiple: string;
        };
        action: string;
      };
      deactivate: {
        title: string;
        message: {
          single: string;
          multiple: string;
        };
        action: string;
      };
      delete: {
        title: string;
        message: {
          single: string;
          multiple: string;
        };
        action: string;
      };
    };
    notification: {
      create: {
        success: string;
        fail: string;
      };
      edit: {
        success: string;
        fail: string;
      };
      activate: {
        success: {
          single: string;
          multiple: string;
        };
        fail: {
          single: string;
          multiple: string;
        };
      };
      deactivate: {
        success: {
          single: string;
          multiple: string;
        };
        fail: {
          single: string;
          multiple: string;
        };
      };
      delete: {
        success: {
          single: string;
          multiple: string;
        };
        fail: {
          single: string;
          multiple: string;
        };
      };
    };
    alert: {
      protected: {
        title: string;
        message: string;
      };
      activate: {
        title: string;
        message: string;
      };
      deactivate: {
        title: string;
        message: string;
      };
      delete: {
        title: string;
        message: string;
      };
      appNotSelected: {
        title: string;
        message: string;
      };
    };
  };
  appManagement: {
    validation: {
      name: {
        required: string;
        minLength: string;
        maxLength: string;
      };
      description: {
        maxLength: string;
      };
    };
    confirmation: {
      editApp: {
        title: string;
        message: string;
        action: string;
      };
      activate: {
        title: string;
        message: {
          single: string;
          multiple: string;
        };
        action: string;
      };
      deactivate: {
        title: string;
        message: {
          single: string;
          multiple: string;
        };
        action: string;
      };
      delete: {
        title: string;
        message: {
          single: string;
          multiple: string;
        };
        action: string;
      };
    };
    notification: {
      create: {
        success: string;
        fail: string;
      };
      edit: {
        success: string;
        fail: string;
      };
      activate: {
        success: {
          single: string;
          multiple: string;
        };
        fail: {
          single: string;
          multiple: string;
        };
      };
      deactivate: {
        success: {
          single: string;
          multiple: string;
        };
        fail: {
          single: string;
          multiple: string;
        };
      };
      delete: {
        success: {
          single: string;
          multiple: string;
        };
        fail: {
          single: string;
          multiple: string;
        };
      };
    };
    alert: {
      protected: {
        title: string;
        message: string;
      };
      activate: {
        title: string;
        message: string;
      };
      deactivate: {
        title: string;
        message: string;
      };
      delete: {
        title: string;
        message: string;
      };
    };
  };
};
