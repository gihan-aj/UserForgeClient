export const ABSOLUTE_ROUTES = {
  home: '/home',
  dashboard: '/dashboard',
  appPortal: {
    base: '/app-portal',
  },
  userManagement: {
    base: '/user-management',
  },
  roleManagement: {
    base: '/role-management',
  },
  permissionManagement: {
    base: '/permission-management',
  },
  appManagement: {
    base: '/app-management',
  },
  auditLogs: {
    base: '/audit-logs',
  },
  support: {
    base: '/support',
  },
  settings: {
    base: '/settings',
  },
  user: {
    userLogin: '/user/login',
    userProfile: '/user/user-profile',
    userSettings: '/user/user-settings',
    userRegistration: '/user/registration',
  },
};

export const DEFAULT_RETURN_URL = ABSOLUTE_ROUTES.home;
