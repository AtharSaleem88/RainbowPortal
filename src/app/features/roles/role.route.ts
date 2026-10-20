import { Route } from '@angular/router'
import { RoleList } from './role-list/role-list'
import { RoleEdit } from './role-edit/role-edit'
import { RoleAdd } from './role-add/role-add'
import { Permissions } from './permissions/permissions'

export const ROLE_ROUTES: Route[] = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
  {
    path: 'list',
    component: RoleList,
    data: { title: 'Roles List' },
  },
  {
    path: 'permissions',
    component: Permissions,
    data: { title: 'Roles & Staff Permissions' },
  },
  {
    path: 'edit',
    component: RoleEdit,
    data: { title: 'Role Edit' },
  },
  {
    path: 'add',
    component: RoleAdd,
    data: { title: 'Role Add' },
  }
]
