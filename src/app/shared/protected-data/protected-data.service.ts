import { Injectable } from '@angular/core';
import { ProtectedApps } from './protected-apps.enum';
import { ProtectedRoles } from './protected-roles.enum';
import { ProtectedUsers } from './protected-users.enum';

@Injectable({
  providedIn: 'root',
})
export class ProtectedDataService {
  isProtectedApp(appName: string): boolean {
    return Object.values(ProtectedApps).includes(appName as ProtectedApps);
  }

  isProtectedRole(roleName: string): boolean {
    return Object.values(ProtectedRoles).includes(roleName as ProtectedRoles);
  }

  isProtectedUser(userEmail: string): boolean {
    return Object.values(ProtectedUsers).includes(userEmail as ProtectedUsers);
  }
}
