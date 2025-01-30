import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  private permissionsSubject = new BehaviorSubject<string[]>([]);
  permissions$ = this.permissionsSubject.asObservable();

  constructor() {}

  setpermissions(permissions: string[]) {
    this.permissionsSubject.next(permissions);
  }

  userHasPermissions(): boolean {
    return this.permissionsSubject.value.length > 0;
  }

  hasPermission(permission: string): boolean {
    return this.permissionsSubject.value.includes(permission);
  }

  hasAnyPermission(prefix: string): boolean {
    return this.permissionsSubject.value.some((p) => p.startsWith(prefix));
  }
}
