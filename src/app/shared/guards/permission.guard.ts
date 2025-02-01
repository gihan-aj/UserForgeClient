import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PermissionService } from '../services/permission.service';
import { ABSOLUTE_ROUTES } from '../constants/absolute-routes';

export const permissionGuard: CanActivateFn = (route, state) => {
  const permissionsService = inject(PermissionService);
  const router = inject(Router);
  const accessDeniedUrl = ABSOLUTE_ROUTES.accessDenied;

  const permissionPrefix = route.data['permission'];
  if (permissionPrefix) {
    if (permissionsService.hasAnyPermission(permissionPrefix)) {
      return true;
    }
  }

  router.navigateByUrl(accessDeniedUrl);
  return false;
};
