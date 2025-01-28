export type Messages = {
  user: {
    login: {
      validation: {
        email: {
          required: string;
          invalid: string;
        };
        password: {
          required: string;
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
};
