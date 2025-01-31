export type Messages = {
  user: {
    // login: {
    //   validation: {
    //     email: {
    //       required: string;
    //       invalid: string;
    //     };
    //     password: {
    //       required: string;
    //     };
    //   };
    //   notification: {
    //     login: {
    //       success: string;
    //       fail: string;
    //     };
    //     refresh: {
    //       fail: string;
    //     };
    //     logout: {
    //       success: string;
    //       fail: string;
    //     };
    //     alreadyLoggedIn: string;
    //     saveUserSettings: {
    //       success: string;
    //       fail: string;
    //     };
    //     fetchPermissions: {
    //       fail: string;
    //     };
    //   };
    //   confirmation: {
    //     logout: {
    //       title: string;
    //       message: string;
    //       action: string;
    //     };
    //   };
    // };
    // registration: {
    //   validation: {
    //     firstName: {
    //       required: string;
    //       minLength: string;
    //       maxLength: string;
    //     };
    //     lastName: {
    //       required: string;
    //       minLength: string;
    //       maxLength: string;
    //     };
    //     email: {
    //       required: string;
    //       invalid: string;
    //     };
    //     phoneNumber: {
    //       invalid: string;
    //     };
    //     dateOfBirth: {
    //       invalidAge: string;
    //       invalidFormat: string;
    //       genericError: string;
    //     };
    //     password: {
    //       required: string;
    //       minLength: string;
    //       maxLength: string;
    //       requireDigit: string;
    //       requireLowercase: string;
    //       requireUppercase: string;
    //       requireNonAlphanumeric: string;
    //     };
    //     confirmPassword: {
    //       required: string;
    //       passwordMismatch: string;
    //     };
    //   };
    // };
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
    };
    alert: {
      registration: {
        title: string;
        message: string;
      };
    };
    confirmation: {
      logout: {
        title: string;
        message: string;
        action: string;
      };
    };
  };
};
