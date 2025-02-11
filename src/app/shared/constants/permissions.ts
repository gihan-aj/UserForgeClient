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
    read: 'users.read',
    edit: 'users.edit',
    delete: 'users.delete',
    statusChange: 'users.status',
    readRoles: 'users.read.roles',
    manageRoles: 'users.manage.roles',
  },
  roles: {
    access: 'roles.access',
    create: 'roles.create',
    read: 'roles.read',
    edit: 'roles.edit',
    delete: 'roles.delete',
    statusChange: 'roles.status',
    readPermissions: 'roles.read.permissions',
    managePermissions: 'roles.manage.permissions',
  },
  apps: {
    access: 'apps.access',
    create: 'apps.create',
    read: 'apps.read',
    edit: 'apps.edit',
    delete: 'apps.delete',
    statusChange: 'apps.status',
  },
  permissions: {
    access: 'permissions.access',
    read: 'permissions.read',
  },
  appPortal: {
    access: 'app-portal.access',
  },
  auditLogs: {
    access: 'audit.access',
    export: 'audit.export',
  },
  settings: {
    manage: 'settings.manage',
  },
};
