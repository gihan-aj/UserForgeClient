import { Routes } from '@angular/router';
import { RolesTableComponent } from './components/roles-table/roles-table.component';
import { RoleDetailsComponent } from './components/role-details/role-details.component';

export const routes: Routes = [
  {
    path: '',
    component: RolesTableComponent,
    data: {
      breadcrumb: '',
      permission: 'roles.access',
    },
  },
  {
    path: ':id',
    component: RoleDetailsComponent,
    data: {
      breadcrumb: 'Role Details',
      permission: 'roles.access',
    },
  },
];
