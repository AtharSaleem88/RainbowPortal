import { Route } from '@angular/router';
import { RoleListComponent } from './role-list/role-list.component';
import { RoleEditComponent } from './role-edit/role-edit.component';
import { RoleAddComponent } from './role-add/role-add.component';
import { PermissionsComponent } from './permissions/permissions.component';

export const ROLE_ROUTES: Route[] = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
  {
    path: 'list',
    component: RoleListComponent,
    data: { title: 'Roles List' },
  },
  {
    path: 'permissions',
    component: PermissionsComponent,
    data: { title: 'Roles & Staff Permissions' },
  },
  {
    path: 'edit',
    component: RoleEditComponent,
    data: { title: 'Role Edit' },
  },
  {
    path: 'add',
    component: RoleAddComponent,
    data: { title: 'Role Add' },
  },
];

export const ROLES_ROUTES = ROLE_ROUTES;
