import { Messages } from './messages.type';

export const MESSAGES: Messages = {
  app: {
    title: 'User Forge',
    menu: {
      themeSelect: {
        light: 'Light',
        dark: 'Dark',
        system: 'System',
      },
      user: {
        login: 'Log in',
        register: 'Create new account',
        profile: 'View profile',
        settings: 'Settings',
        logout: 'Log out',
      },
    },
    topBar: {
      tooltip: {
        themeSelect: 'Select theme',
        user: 'User menu',
        sideMenu: 'Toggle side menu',
      },
    },
  },
};
