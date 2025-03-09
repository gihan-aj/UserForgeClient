import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { UserComponent } from './user/user.component';
import { authGuard } from './shared/guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { permissionGuard } from './shared/guards/permission.guard';
import { UserManagementComponent } from './user-management/user-management.component';
import { AccessDeniedComponent } from './shared/components/access-denied/access-denied.component';
import { PermissionsComponent } from './permissions/permissions.component';
import { RoleManagementComponent } from './role-management/role-management.component';
import { AppManagementComponent } from './app-management/app-management.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard, permissionGuard],
    data: {
      breadcrumb: 'Dashboard',
      permission: 'dashboard.access',
    },
  },
  {
    path: 'app-management',
    component: AppManagementComponent,
    canActivate: [authGuard, permissionGuard],
    data: {
      breadcrumb: 'Apps Management',
      permission: 'apps.access',
    },
  },
  {
    path: 'user-management',
    component: UserManagementComponent,
    canActivate: [authGuard, permissionGuard],
    data: {
      breadcrumb: 'User Management',
      permission: 'users.access',
    },
  },
  {
    path: 'role-management',
    component: RoleManagementComponent,
    canActivate: [authGuard, permissionGuard],
    data: {
      breadcrumb: 'Role Management',
      permission: 'roles.access',
    },
    loadChildren: () =>
      import('./role-management/role-management.routes').then((r) => r.routes),
  },
  {
    path: 'permissions',
    component: PermissionsComponent,
    canActivate: [authGuard, permissionGuard],
    data: {
      breadcrumb: 'Permission Management',
      permission: 'permissions.access',
    },
  },
  {
    path: 'not-found',
    component: NotFoundComponent,
    data: {
      breadcrumb: 'Not Found',
    },
  },
  {
    path: 'access-denied',
    component: AccessDeniedComponent,
    data: {
      breadcrumb: 'Access Denied',
    },
  },
  {
    path: 'user',
    component: UserComponent,
    loadChildren: () => import('./user/user.routes').then((u) => u.routes),
  },

  {
    path: '**',
    component: NotFoundComponent,
    pathMatch: 'full',
    data: {
      breadcrumb: 'Not Found',
    },
  },
];
