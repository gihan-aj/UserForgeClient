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
      sideMenu: {
        dashboard: 'Dashboard',
        userManagement: 'User Management',
        softwarePackages: 'Software Packages',
        permissionManagement: 'Permission Management',
        auditLogs: 'Audit Logs',
        ssoSettings: 'SSO Settings',
        intergrations: 'Intergrations',
        support: 'Support',
        settings: 'Settings',
      },
    },
    topBar: {
      tooltip: {
        themeSelect: 'Select theme',
        user: 'User menu',
        sideMenu: 'Toggle side menu',
      },
    },
    footer: {
      footerText: 'UserForge. All rights reserved.',
    },
  },
  page: {
    notFound: {
      title404: '404',
      titleNotFount: 'Not Found!',
      textNotFound: "Looks like this page doesn't exist!",
      buttonHome: 'Go to Dashboard',
    },
  },
};
