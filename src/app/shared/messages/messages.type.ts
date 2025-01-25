export type Messages = {
  app: {
    title: string;
    menu: {
      sideMenu: {
        dashboard: string;
        userManagement: string;
        softwarePackages: string;
        permissionManagement: string;
        auditLogs: string;
        ssoSettings: string;
        intergrations: string;
        support: string;
        settings: string;
      };
      themeSelect: {
        light: string;
        dark: string;
        system: string;
      };
      user: {
        login: string;
        register: string;
        profile: string;
        settings: string;
        logout: string;
      };
    };
    topBar: {
      tooltip: {
        themeSelect: string;
        user: string;
        sideMenu: string;
      };
    };
    footer: {
      footerText: string;
    };
  };
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
    };
  };
  page: {
    notFound: {
      title404: string;
      titleNotFount: string;
      textNotFound: string;
      buttonHome: string;
    };
  };
};
