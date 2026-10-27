import { Route } from '@angular/router';
import { RoleListComponent } from './role-list/role-list.component';
import { RoleEditComponent } from './role-edit/role-edit.component';
import { RoleAddComponent } from './role-add/role-add.component';
import { PermissionsComponent } from './permissions/permissions.component';
import { AutomationRulesComponent } from './automation-rules/automation-rules.component';
import { AuditLogsComponent } from './audit-logs/audit-logs.component';
import { BranchManagementComponent } from './branch-management/branch-management.component';

export const ROLE_ROUTES: Route[] = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
  {
    path: 'list',
    component: RoleListComponent,
    data: { title: 'Staff Management & Branch Personnel', roles: ['Admin', 'Branch Manager', 'Moderator'] },
  },
  {
    path: 'branches',
    component: BranchManagementComponent,
    data: { title: 'Branch Management & Store Capacities', roles: ['Admin', 'Branch Manager', 'Moderator'] },
  },
  {
    path: 'permissions',
    component: PermissionsComponent,
    data: { title: 'Roles & Staff Permissions Matrix', roles: ['Admin'] },
  },
  {
    path: 'automation',
    component: AutomationRulesComponent,
    data: { title: 'Store Branch Automation & Rules', roles: ['Admin'] },
  },
  {
    path: 'audit-logs',
    component: AuditLogsComponent,
    data: { title: 'Security & Operational Audit Trail', roles: ['Admin', 'Moderator'] },
  },
  {
    path: 'edit',
    component: RoleEditComponent,
    data: { title: 'Role Edit', roles: ['Admin'] },
  },
  {
    path: 'add',
    component: RoleAddComponent,
    data: { title: 'Role Add', roles: ['Admin'] },
  },
];

export const ROLES_ROUTES = ROLE_ROUTES;
