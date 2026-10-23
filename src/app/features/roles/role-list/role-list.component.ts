import { showSaveSuccess, showSaveValidation } from '@shared/utils/save-alert';
import { confirmAction } from '@shared/utils/confirmation';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgbDropdownModule, NgbModal, NgbModalModule, NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { BranchStaff, RAINBOW_STAFF_MEMBERS, StaffRole } from './data';
import { RAINBOW_BRANCH_OPTIONS, BranchOption } from '../../promotions/data';
import { AuthenticationService } from '@core/services/auth.service';

@Component({
  selector: 'app-role-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    NgbDropdownModule,
    NgbPaginationModule,
    NgbModalModule,
    NgbTooltipModule
  ],
  templateUrl: './role-list.component.html',
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

      &.btn-delete:hover {
        background: #fef2f2;
        color: #ef4444;
        border-color: #fca5a5;
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
export class RoleListComponent implements OnInit {
  title = 'Staff Management & Branch Personnel';
  staffMembers: BranchStaff[] = RAINBOW_STAFF_MEMBERS;
  branches: BranchOption[] = RAINBOW_BRANCH_OPTIONS;

  // Responsive row expand state (mobile child rows)
  expandedRowIds = new Set<string>();

  toggleRowExpand(id: string): void {
    if (this.expandedRowIds.has(id)) {
      this.expandedRowIds.delete(id);
    } else {
      this.expandedRowIds.add(id);
    }
  }

  isRowExpanded(id: string): boolean {
    return this.expandedRowIds.has(id);
  }

  authService = inject(AuthenticationService);
  currentUser = this.authService.user;

  // Filters
  selectedBranch: string = 'all';
  selectedRole: string = 'all';
  selectedStatus: string = 'all';
  searchTerm: string = '';

  // Pagination
  pageSize: number = 8;
  currentPage: number = 1;

  // Active Staff for Modals
  selectedStaff: BranchStaff | null = null;
  formStaff: Partial<BranchStaff> = {};
  isEditing: boolean = false;
  activeModalRef: any = null;
  actionFeedback: string | null = null;

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {
    this.applyBranchScoping(this.authService.user);
    this.authService.currentUser$.subscribe((user: any) => {
      this.currentUser = user;
      this.applyBranchScoping(user);
    });
  }

  applyBranchScoping(user: any) {
    if (user?.role === 'Branch Manager') {
      this.selectedBranch = user.branchCode || 'VAL-01';
    }
  }

  get isBranchLocked(): boolean {
    return this.currentUser?.role === 'Branch Manager';
  }

  get currentBranchDisplayName(): string {
    if (this.isBranchLocked) {
      return this.currentUser?.branchName || 'Rainbow Cash & Carry - Valencia';
    }
    const found = this.branches.find(b => b.id === this.selectedBranch);
    return found ? found.name : 'All Branches';
  }

  get counts() {
    return {
      all: this.staffMembers.length,
      managers: this.staffMembers.filter(s => s.role === 'Branch Manager').length,
      moderators: this.staffMembers.filter(s => s.role === 'Moderator').length,
      riders: this.staffMembers.filter(s => s.role === 'Rider').length,
      active: this.staffMembers.filter(s => s.status === 'Active' || s.status === 'On Delivery').length,
    };
  }

  get filteredStaff(): BranchStaff[] {
    return this.staffMembers.filter(s => {
      // Branch filter
      if (this.selectedBranch !== 'all' && s.branchId !== this.selectedBranch && !s.branchName.includes(this.selectedBranch)) {
        return false;
      }
      // Role filter
      if (this.selectedRole !== 'all' && s.role !== this.selectedRole) {
        return false;
      }
      // Status filter
      if (this.selectedStatus !== 'all' && s.status !== this.selectedStatus) {
        return false;
      }
      // Search
      if (this.searchTerm.trim()) {
        const q = this.searchTerm.toLowerCase();
        const matchesName = s.name.toLowerCase().includes(q);
        const matchesId = s.id.toLowerCase().includes(q);
        const matchesPhone = s.phone.toLowerCase().includes(q);
        const matchesEmail = s.email.toLowerCase().includes(q);
        const matchesCnic = s.cnic.toLowerCase().includes(q);
        const matchesVehicle = s.riderDetails?.vehicleRegNo ? s.riderDetails.vehicleRegNo.toLowerCase().includes(q) : false;
        const matchesBranch = s.branchName.toLowerCase().includes(q);
        if (!matchesName && !matchesId && !matchesPhone && !matchesEmail && !matchesCnic && !matchesVehicle && !matchesBranch) {
          return false;
        }
      }
      return true;
    });
  }

  get paginatedStaff(): BranchStaff[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredStaff.slice(start, start + this.pageSize);
  }

  get currentStartIndex(): number {
    if (this.filteredStaff.length === 0) return 0;
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get currentEndIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredStaff.length);
  }

  onSearchChange() {
    this.currentPage = 1;
  }

  clearSearch() {
    this.searchTerm = '';
    this.currentPage = 1;
  }

  setRoleTab(role: string) {
    this.selectedRole = role;
    this.currentPage = 1;
  }

  resetFilters() {
    if (!this.isBranchLocked) {
      this.selectedBranch = 'all';
    }
    this.selectedRole = 'all';
    this.selectedStatus = 'all';
    this.searchTerm = '';
    this.currentPage = 1;
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Active':
        return 'bg-success-subtle text-success border border-success-subtle';
      case 'On Delivery':
        return 'bg-info-subtle text-info border border-info-subtle';
      case 'Off Duty':
        return 'bg-secondary-subtle text-secondary border border-secondary-subtle';
      case 'Suspended':
        return 'bg-danger-subtle text-danger border border-danger-subtle';
      default:
        return 'bg-light text-dark border';
    }
  }

  openCreateModal(content: any) {
    this.isEditing = false;
    const defaultBranch = this.branches[0];
    this.formStaff = {
      name: '',
      role: 'Rider',
      branchId: defaultBranch.id,
      branchName: defaultBranch.name,
      branchCode: defaultBranch.id.toUpperCase(),
      city: defaultBranch.city as any,
      email: '',
      phone: '+92',
      cnic: '',
      shift: 'Morning (08:00 AM - 04:00 PM)',
      status: 'Active',
      riderDetails: {
        vehicleType: 'Motorbike',
        vehicleRegNo: '',
        licenseNo: '',
        appAccessPin: '1234',
        totalDeliveries: 0,
        rating: 5.0,
        maxCashLimit: 50000,
      },
      moderatorDetails: {
        canApproveReturns: true,
        canModerateFeedback: true,
        canOverridePrices: false,
        canCancelOrders: true,
        dailyApprovalsCount: 0,
      },
      managerDetails: {
        isKeyholder: true,
        maxDiscountAuth: 3000,
        directReporteesCount: 15,
        emergencyContact: '',
      },
    };
    this.activeModalRef = this.modalService.open(content, { size: 'lg', centered: true, backdrop: 'static' });
  }

  openEditModal(staff: BranchStaff, content: any) {
    this.isEditing = true;
    this.formStaff = JSON.parse(JSON.stringify(staff));
    if (!this.formStaff.riderDetails) {
      this.formStaff.riderDetails = {
        vehicleType: 'Motorbike',
        vehicleRegNo: '',
        licenseNo: '',
        appAccessPin: '1234',
        totalDeliveries: 0,
        rating: 5.0,
        maxCashLimit: 50000,
      };
    }
    if (!this.formStaff.moderatorDetails) {
      this.formStaff.moderatorDetails = {
        canApproveReturns: true,
        canModerateFeedback: true,
        canOverridePrices: false,
        canCancelOrders: true,
        dailyApprovalsCount: 0,
      };
    }
    if (!this.formStaff.managerDetails) {
      this.formStaff.managerDetails = {
        isKeyholder: true,
        maxDiscountAuth: 3000,
        directReporteesCount: 15,
        emergencyContact: '',
      };
    }
    this.activeModalRef = this.modalService.open(content, { size: 'lg', centered: true, backdrop: 'static' });
  }

  openDetailModal(staff: BranchStaff, content: any) {
    this.selectedStaff = staff;
    this.modalService.open(content, { size: 'lg', centered: true });
  }

  onBranchChange() {
    const b = this.branches.find(x => x.id === this.formStaff.branchId);
    if (b) {
      this.formStaff.branchName = b.name;
      this.formStaff.branchCode = b.id.toUpperCase();
      this.formStaff.city = b.city as any;
    }
  }

  saveStaff() {
    if (!this.formStaff.name?.trim()) {
      void showSaveValidation('Please enter staff full name.');
      return;
    }
    if (!this.formStaff.phone?.trim()) {
      void showSaveValidation('Please enter contact phone number.');
      return;
    }

    this.onBranchChange();

    if (this.isEditing && this.formStaff.id) {
      const idx = this.staffMembers.findIndex(s => s.id === this.formStaff.id);
      if (idx !== -1) {
        this.staffMembers[idx] = {
          ...this.staffMembers[idx],
          ...this.formStaff,
        } as BranchStaff;
        void showSaveSuccess(`Staff member "${this.formStaff.name}" updated successfully.`);
      }
    } else {
      const rolePrefix = this.formStaff.role === 'Branch Manager' ? 'MGR' : this.formStaff.role === 'Moderator' ? 'MOD' : 'RDR';
      const branchCodeShort = this.formStaff.branchCode || 'BR';
      const randomNum = Math.floor(100 + Math.random() * 900);
      const newId = `${rolePrefix}-${branchCodeShort}-${randomNum}`;

      const newStaff: BranchStaff = {
        id: newId,
        name: this.formStaff.name!,
        avatar: `assets/images/users/avatar-${(this.staffMembers.length % 12) + 1}.jpg`,
        role: this.formStaff.role as StaffRole,
        branchId: this.formStaff.branchId!,
        branchName: this.formStaff.branchName!,
        branchCode: this.formStaff.branchCode!,
        city: this.formStaff.city!,
        email: this.formStaff.email || `${this.formStaff.name?.toLowerCase().replace(/\s+/g, '.')}@rainbowcc.com.pk`,
        phone: this.formStaff.phone!,
        cnic: this.formStaff.cnic || '35202-0000000-1',
        shift: this.formStaff.shift as any,
        status: (this.formStaff.status as any) || 'Active',
        joiningDate: new Date().toLocaleDateString(),
        riderDetails: this.formStaff.role === 'Rider' ? this.formStaff.riderDetails : undefined,
        moderatorDetails: this.formStaff.role === 'Moderator' ? this.formStaff.moderatorDetails : undefined,
        managerDetails: this.formStaff.role === 'Branch Manager' ? this.formStaff.managerDetails : undefined,
      };

      this.staffMembers.unshift(newStaff);
      void showSaveSuccess(`New ${newStaff.role} "${newStaff.name}" assigned to ${newStaff.branchName}.`);
    }

    if (this.activeModalRef) {
      this.activeModalRef.close();
    }
  }

  toggleDutyStatus(staff: BranchStaff) {
    if (staff.status === 'Active' || staff.status === 'On Delivery') {
      staff.status = 'Off Duty';
      this.showNotification(`${staff.name} is now Off Duty.`);
    } else {
      staff.status = 'Active';
      this.showNotification(`${staff.name} is now Active & On Duty.`);
    }
  }

  async deleteStaff(staff: BranchStaff): Promise<void> {
    if (await confirmAction(`Are you sure you want to remove ${staff.name} (${staff.role} - ${staff.branchName})?`)) {
      this.staffMembers = this.staffMembers.filter(s => s.id !== staff.id);
      this.showNotification(`${staff.name} removed from branch staff.`);
    }
  }

  showNotification(msg: string) {
    this.actionFeedback = msg;
    setTimeout(() => {
      this.actionFeedback = null;
    }, 4500);
  }

  exportToCsv() {
    const headers = ['Staff ID', 'Name', 'Role', 'Branch', 'City', 'Phone', 'Email', 'Shift', 'Status', 'Joining Date'];
    const rows = this.filteredStaff.map(s => [
      s.id,
      `"${s.name}"`,
      `"${s.role}"`,
      `"${s.branchName}"`,
      s.city,
      s.phone,
      s.email,
      `"${s.shift}"`,
      s.status,
      s.joiningDate
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rainbow-staff-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export { RoleListComponent as RoleList };
