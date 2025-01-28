export const ABSOLUTE_ROUTES = {
  dashboard: '/dashboard',
  userManagement: {
    base: '/user-management',
  },
  softwarePackages: {
    base: '/software-packages',
  },
  permissionManagement: {
    base: '/permission-management',
  },
  auditLogs: {
    base: '/audit-logs',
  },
  ssoSettings: {
    base: '/sso-settings',
  },
  intergrations: {
    base: '/intergrations',
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

export const DEFAULT_RETURN_URL = ABSOLUTE_ROUTES.dashboard;
