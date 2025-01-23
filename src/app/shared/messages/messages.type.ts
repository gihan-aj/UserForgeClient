export type Messages = {
  app: {
    title: string;
    menu: {
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
  };
};
