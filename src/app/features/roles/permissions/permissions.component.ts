import { showSaveSuccess } from '@shared/utils/save-alert';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgbDropdownModule, NgbModal, NgbModalModule, NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import {
  PermissionModule,
  RolePermissionDefinition,
  UserPermissionProfile,
  RAINBOW_PERMISSION_MODULES,
  RAINBOW_ROLE_DEFINITIONS,
  INITIAL_USER_PERMISSIONS,
  permissionState,
} from './data';
import { RAINBOW_BRANCH_OPTIONS, BranchOption } from '../../promotions/data';

@Component({
  selector: 'app-permissions',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    NgbDropdownModule,
    NgbModalModule,
    NgbPaginationModule,
    NgbTooltipModule
  ],
  templateUrl: './permissions.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: [`
    .font-jost {
      font-family: 'Jost', -apple-system, BlinkMacSystemFont, sans-serif;
    }

    /* Console Container Card */
    .cat-main-card {
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
      background: #ffffff;
      overflow: hidden;
    }

    /* KPI Metrics Cards */
    .cat-metric-card {
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
      background: #ffffff;
      padding: 16px 18px;
      height: 100%;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(15, 23, 42, 0.08);
        border-color: #cbd5e1;
      }
    }
    .cat-metric-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      flex-shrink: 0;
    }

    /* Segmented Controls for Status Tabs */
    .filter-segmented-control {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      background: #f1f5f9;
      padding: 4px;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }
    .segment-btn {
      padding: 5px 12px;
      font-size: 12.5px;
      font-weight: 600;
      border-radius: 6px;
      border: none;
      background: transparent;
      color: #64748b;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.15s ease;

      &:hover:not(.active) {
        color: #0f172a;
        background: rgba(255, 255, 255, 0.6);
      }

      &.active {
        background: #ffffff;
        color: #2e3192;
        box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08);
      }
    }
    .count-pill {
      font-size: 11px;
      padding: 1px 7px;
      border-radius: 10px;
      background: #e2e8f0;
      color: #475569;
      font-weight: 600;

      .active & {
        background: #eef2ff;
        color: #2e3192;
      }
    }

    /* Search Box Wrapper */
    .search-box-wrapper {
      position: relative;
      min-width: 250px;
      max-width: 320px;

      .search-icon {
        position: absolute;
        left: 11px;
        top: 50%;
        transform: translateY(-50%);
        color: #94a3b8;
        font-size: 15px;
        pointer-events: none;
      }

      .search-input {
        padding-left: 32px;
        padding-right: 30px;
        height: 34px;
        border-radius: 7px;
        border: 1px solid #cbd5e1;
        font-size: 12.5px;
        color: #0f172a;
        background: #ffffff;
        transition: all 0.15s ease;

        &:focus {
          border-color: #2e3192;
          box-shadow: 0 0 0 3px rgba(46, 49, 146, 0.1);
        }
      }

      .clear-search-btn {
        position: absolute;
        right: 8px;
        top: 50%;
        transform: translateY(-50%);
        border: none;
        background: transparent;
        color: #94a3b8;
        padding: 0;
        cursor: pointer;
        display: flex;
        align-items: center;
        font-size: 14px;

        &:hover {
          color: #475569;
        }
      }
    }

    /* Secondary Filter Strip */
    .filter-bar-strip {
      background: #fafbfc;
      border-top: 1px solid #f1f5f9;
      padding: 10px 16px;
    }
    .filter-control-wrap {
      display: inline-flex;
      align-items: center;
      gap: 7px;

      .filter-title {
        font-size: 11.5px;
        font-weight: 600;
        color: #64748b;
        text-transform: uppercase;
        letter-spacing: 0.4px;
        white-space: nowrap;
      }

      .filter-dropdown {
        height: 32px;
        border-radius: 6px;
        border: 1px solid #cbd5e1;
        font-size: 12px;
        font-weight: 500;
        color: #1e293b;
        background-color: #ffffff;
        padding: 4px 10px;
        cursor: pointer;

        &:focus {
          border-color: #2e3192;
          box-shadow: 0 0 0 2px rgba(46, 49, 146, 0.1);
        }
      }
    }

    /* Table Styles */
    .table-clean {
      th {
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        color: #475569;
        background: #f8fafc;
        border-bottom: 1px solid #e2e8f0;
        padding: 11px 16px;
        user-select: none;
      }
      td {
        padding: 12px 16px;
        font-size: 13px;
        border-bottom: 1px solid #f1f5f9;
        vertical-align: middle;
      }
      tbody tr {
        transition: background-color 0.15s ease;
        &:hover {
          background-color: #f8fafc;
        }
      }
    }

    /* Action Buttons */
    .cat-action-btn {
      width: 30px;
      height: 30px;
      border-radius: 6px;
      border: 1px solid #e2e8f0;
      background: #ffffff;
      color: #64748b;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.15s ease;
      text-decoration: none;

      &:hover {
        background: #f1f5f9;
        color: #2e3192;
        border-color: #cbd5e1;
      }
    }

    /* Permission Module Card */
    .permission-module-card {
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      background: #ffffff;
      overflow: hidden;
      margin-bottom: 16px;
      transition: all 0.15s ease;

      &:hover {
        border-color: #cbd5e1;
      }

      .module-card-header {
        background: #f8fafc;
        padding: 12px 16px;
        border-bottom: 1px solid #e2e8f0;
      }

      .permission-item-row {
        padding: 11px 16px;
        border-bottom: 1px solid #f1f5f9;
        transition: background-color 0.12s ease;

        &:last-child {
          border-bottom: none;
        }

        &:hover {
          background-color: #fafbfc;
        }
      }
    }

    /* Modal Button Styles */
    .btn-modal-cancel {
      padding: 7px 15px;
      font-size: 12.5px;
      font-weight: 600;
      border-radius: 7px;
      border: 1px solid #cbd5e1;
      background: #ffffff;
      color: #475569;
      cursor: pointer;
      transition: all 0.15s ease;
      &:hover {
        background: #f8fafc;
        color: #0f172a;
      }
    }

    .btn-modal-primary {
      padding: 7px 16px;
      font-size: 12.5px;
      font-weight: 600;
      border-radius: 7px;
      border: 1px solid #2e3192;
      background: #2e3192;
      color: #ffffff;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.15s ease;
      box-shadow: 0 1px 2px rgba(46, 49, 146, 0.2);
      &:hover {
        background: #25287a;
        border-color: #25287a;
      }
    }
  `]
})
export class PermissionsComponent implements OnInit {
  title = 'Roles & Permission Access Control';

  // State stats
  stats = permissionState;
  modules: PermissionModule[] = RAINBOW_PERMISSION_MODULES;
  roles: RolePermissionDefinition[] = RAINBOW_ROLE_DEFINITIONS;
  userProfiles: UserPermissionProfile[] = INITIAL_USER_PERMISSIONS;
  branches: BranchOption[] = RAINBOW_BRANCH_OPTIONS;

  // Active View Tab: 'role-matrix' | 'user-overrides' | 'simulator'
  activeTab: 'role-matrix' | 'user-overrides' | 'simulator' = 'role-matrix';

  // Selected Role for Role Permissions Editor
  selectedRoleName: string = 'Admin';

  // Selected User for User Permissions Editor
  selectedUserId: string = 'MGR-VAL-01';

  // Master Permissions State Maps
  rolePermissionsMap: { [role: string]: { [key: string]: boolean } } = {};
  userOverridesMap: { [staffId: string]: { [key: string]: boolean } } = {};

  // User Filter State
  userSearchTerm: string = '';
  userFilterBranch: string = 'all';
  userFilterRole: string = 'all';

  // User Pagination
  userPageSize: number = 8;
  userCurrentPage: number = 1;

  // Active User for Modal Editing
  modalSelectedUser: UserPermissionProfile | null = null;
  actionFeedback: string | null = null;

  // Responsive row expand state (mobile child rows)
  expandedUserIds = new Set<string>();

  toggleUserExpand(id: string): void {
    if (this.expandedUserIds.has(id)) {
      this.expandedUserIds.delete(id);
    } else {
      this.expandedUserIds.add(id);
    }
  }

  isUserExpanded(id: string): boolean {
    return this.expandedUserIds.has(id);
  }

  constructor(private modalService: NgbModal) {
    this.initPermissions();
  }

  ngOnInit(): void {}

  initPermissions() {
    // 1. Initialize role defaults
    this.roles.forEach(r => {
      this.rolePermissionsMap[r.role] = {};
      this.modules.forEach(m => {
        m.permissions.forEach(p => {
          this.rolePermissionsMap[r.role][p.key] = r.allowedKeys.includes(p.key);
        });
      });
    });

    // 2. Initialize user profiles with their role defaults
    this.userProfiles.forEach(u => {
      this.userOverridesMap[u.staffId] = {};
      const baseRole = this.rolePermissionsMap[u.role] || {};
      this.modules.forEach(m => {
        m.permissions.forEach(p => {
          this.userOverridesMap[u.staffId][p.key] = baseRole[p.key] ?? false;
        });
      });
    });
  }

  get currentRoleDef(): RolePermissionDefinition | undefined {
    return this.roles.find(r => r.role === this.selectedRoleName);
  }

  get currentUserProfile(): UserPermissionProfile | undefined {
    return this.userProfiles.find(u => u.staffId === this.selectedUserId);
  }

  get totalPermissionsCount(): number {
    return this.modules.reduce((sum, m) => sum + m.permissions.length, 0);
  }

  get filteredUsers(): UserPermissionProfile[] {
    return this.userProfiles.filter(u => {
      if (this.userFilterBranch !== 'all' && !u.branchName.includes(this.userFilterBranch)) return false;
      if (this.userFilterRole !== 'all' && u.role !== this.userFilterRole) return false;
      if (this.userSearchTerm.trim()) {
        const q = this.userSearchTerm.toLowerCase();
        const matchesName = u.staffName.toLowerCase().includes(q);
        const matchesId = u.staffId.toLowerCase().includes(q);
        const matchesPhone = u.phone.toLowerCase().includes(q);
        const matchesBranch = u.branchName.toLowerCase().includes(q);
        if (!matchesName && !matchesId && !matchesPhone && !matchesBranch) return false;
      }
      return true;
    });
  }

  get paginatedUsers(): UserPermissionProfile[] {
    const start = (this.userCurrentPage - 1) * this.userPageSize;
    return this.filteredUsers.slice(start, start + this.userPageSize);
  }

  get userStartIndex(): number {
    if (this.filteredUsers.length === 0) return 0;
    return (this.userCurrentPage - 1) * this.userPageSize + 1;
  }

  get userEndIndex(): number {
    return Math.min(this.userCurrentPage * this.userPageSize, this.filteredUsers.length);
  }

  onUserSearchChange() {
    this.userCurrentPage = 1;
  }

  clearUserSearch() {
    this.userSearchTerm = '';
    this.userCurrentPage = 1;
  }

  resetUserFilters() {
    this.userFilterBranch = 'all';
    this.userFilterRole = 'all';
    this.userSearchTerm = '';
    this.userCurrentPage = 1;
  }

  // Check if current role has permission
  isRolePermitted(key: string): boolean {
    return !!this.rolePermissionsMap[this.selectedRoleName]?.[key];
  }

  // Toggle role permission
  toggleRolePermission(key: string) {
    if (!this.rolePermissionsMap[this.selectedRoleName]) {
      this.rolePermissionsMap[this.selectedRoleName] = {};
    }
    this.rolePermissionsMap[this.selectedRoleName][key] = !this.rolePermissionsMap[this.selectedRoleName][key];
  }

  // Grant or Revoke all permissions in a module for current role
  toggleModuleForRole(module: PermissionModule, grantAll: boolean) {
    module.permissions.forEach(p => {
      this.rolePermissionsMap[this.selectedRoleName][p.key] = grantAll;
    });
    this.showNotification(`${grantAll ? 'Granted all' : 'Revoked all'} permissions in "${module.name}" for ${this.selectedRoleName}.`);
  }

  // Count active permissions for role
  getRoleActiveCount(roleName: string): number {
    const map = this.rolePermissionsMap[roleName] || {};
    return Object.values(map).filter(v => v === true).length;
  }

  // Count active permissions for user
  getUserActiveCount(staffId: string): number {
    const map = this.userOverridesMap[staffId] || {};
    return Object.values(map).filter(v => v === true).length;
  }

  // Reset role to built-in template
  resetRoleToDefaults() {
    const def = this.currentRoleDef;
    if (!def) return;
    this.modules.forEach(m => {
      m.permissions.forEach(p => {
        this.rolePermissionsMap[def.role][p.key] = def.allowedKeys.includes(p.key);
      });
    });
    this.showNotification(`Permissions for ${def.role} reset to recommended defaults.`);
  }

  // Save Role Permissions
  saveRolePermissions() {
    const activeCount = this.getRoleActiveCount(this.selectedRoleName);
    void showSaveSuccess(`Role permissions for "${this.selectedRoleName}" updated (${activeCount}/${this.totalPermissionsCount} permissions granted).`);
  }

  // Check user permission (user override or base role)
  isUserPermitted(staffId: string, key: string): boolean {
    return !!this.userOverridesMap[staffId]?.[key];
  }

  // Toggle user permission
  toggleUserPermission(staffId: string, key: string) {
    if (!this.userOverridesMap[staffId]) {
      this.userOverridesMap[staffId] = {};
    }
    this.userOverridesMap[staffId][key] = !this.userOverridesMap[staffId][key];
  }

  // Reset user permissions to their base role defaults
  resetUserToRoleDefaults(user: UserPermissionProfile) {
    const baseRole = this.rolePermissionsMap[user.role] || {};
    this.modules.forEach(m => {
      m.permissions.forEach(p => {
        this.userOverridesMap[user.staffId][p.key] = baseRole[p.key] ?? false;
      });
    });
    user.lastUpdated = 'Just now (Role Defaults Applied)';
    this.showNotification(`Permissions for ${user.staffName} reset to official ${user.role} defaults.`);
  }

  // Open User Customization Modal
  openUserCustomModal(user: UserPermissionProfile, content: any) {
    this.modalSelectedUser = user;
    this.modalService.open(content, { size: 'xl', centered: true, backdrop: 'static' });
  }

  saveUserPermissions(modalRef?: any) {
    if (this.modalSelectedUser) {
      this.modalSelectedUser.lastUpdated = 'Just now (Customized)';
      const count = this.getUserActiveCount(this.modalSelectedUser.staffId);
      void showSaveSuccess(`Custom permissions saved for ${this.modalSelectedUser.staffName} (${count}/${this.totalPermissionsCount} authorized).`);
    }
    if (modalRef) {
      modalRef.close();
    }
  }

  showNotification(msg: string) {
    this.actionFeedback = msg;
    setTimeout(() => {
      this.actionFeedback = null;
    }, 4500);
  }

  exportPermissionsToCsv() {
    const headers = ['Staff ID', 'Name', 'Role', 'Branch', 'Authorized Actions Count', 'Last Updated'];
    const rows = this.filteredUsers.map(u => [
      u.staffId,
      `"${u.staffName}"`,
      `"${u.role}"`,
      `"${u.branchName}"`,
      this.getUserActiveCount(u.staffId),
      `"${u.lastUpdated}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rainbow-permissions-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export { PermissionsComponent as Permissions };
