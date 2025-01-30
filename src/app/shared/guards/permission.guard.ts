import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { PermissionService } from '../services/permission.service';

export const permissionGuard: CanActivateFn = (route, state) => {
  const permissionsService = inject(PermissionService);

  const permissionPrefix = route.data['permission'];
  if (permissionPrefix) {
    if (permissionsService.hasAnyPermission(permissionPrefix)) {
      return true;
    }
  }

  return false;
};
