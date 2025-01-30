import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { UserComponent } from './user/user.component';
import { authGuard } from './shared/guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { permissionGuard } from './shared/guards/permission.guard';

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
    path: 'not-found',
    component: NotFoundComponent,
    data: {
      breadcrumb: 'Not Found',
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
