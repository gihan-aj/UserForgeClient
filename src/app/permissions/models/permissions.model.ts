import { PermissionDetails } from '../interfaces/permission-details.interface';

export class Permissions {
  private _home: PermissionDetails[] = [];
  private _dashboard: PermissionDetails[] = [];
  private _users: PermissionDetails[] = [];
  private _roles: PermissionDetails[] = [];
  private _apps: PermissionDetails[] = [];
  private _permissions: PermissionDetails[] = [];
  private _appPortal: PermissionDetails[] = [];
  private _auditLogs: PermissionDetails[] = [];
  private _settings: PermissionDetails[] = [];

  private prefixMap: { [key: string]: PermissionDetails[] } = {
    'home.': this._home,
    'dashboard.': this._dashboard,
    'users.': this._users,
    'roles.': this._roles,
    'apps.': this._apps,
    'permissions.': this._permissions,
    'app-portal.': this._appPortal,
    'audit.': this._auditLogs,
    'settings.': this._settings,
  };

  constructor(permissions: PermissionDetails[]) {
    permissions.forEach((permission) => {
      for (const prefix in this.prefixMap) {
        if (permission.name.startsWith(prefix)) {
          this.prefixMap[prefix].push(permission);
          break;
        }
      }
    });
  }

  public get home(): PermissionDetails[] {
    return this._home;
  }

  public get dashboard(): PermissionDetails[] {
    return this._dashboard;
  }

  public get users(): PermissionDetails[] {
    return this._users;
  }

  public get roles(): PermissionDetails[] {
    return this._roles;
  }

  public get apps(): PermissionDetails[] {
    return this._apps;
  }

  public get permissions(): PermissionDetails[] {
    return this._permissions;
  }

  public get appPortal(): PermissionDetails[] {
    return this._appPortal;
  }

  public get auditLogs(): PermissionDetails[] {
    return this._auditLogs;
  }

  public get settings(): PermissionDetails[] {
    return this._settings;
  }
}
