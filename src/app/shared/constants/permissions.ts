export const PERMISSIONS = {
  home: {
    access: 'home.access',
  },
  dashboard: {
    access: 'dashboard.access',
  },
  users: {
    access: 'users.access',
    create: 'users.create',
    edit: 'users.edit',
    delete: 'users.delete',
    statusChange: 'users.status',
    readRoles: 'users.roles.access',
    manageRoles: 'users.roles.manage',
  },
  roles: {
    access: 'roles.access',
    create: 'roles.create',
    edit: 'roles.edit',
    delete: 'roles.delete',
    statusChange: 'roles.status',
    readPermissions: 'roles.permissions.access',
    managePermissions: 'roles.permissions.manage',
  },
  apps: {
    access: 'apps.access',
    create: 'apps.create',
    edit: 'apps.edit',
    delete: 'apps.delete',
    statusChange: 'apps.status',
  },
  permissions: {
    access: 'permissions.access',
  },
  appPortal: {
    access: 'app-portal.access',
  },
  auditLogs: {
    access: 'audit.access',
    export: 'audit.export',
  },
  settings: {
    access: 'settings.access',
    manage: 'settings.manage',
  },
};
