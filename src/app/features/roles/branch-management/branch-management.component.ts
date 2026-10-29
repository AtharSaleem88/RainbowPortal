import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgbModal, NgbModalModule, NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { RainbowBranch } from '@core/models/workflow.model';
import { WorkflowConfigService } from '@core/services/workflow-config.service';
import { AuthenticationService } from '@core/services/auth.service';
import { showSaveSuccess, showSaveValidation } from '@shared/utils/save-alert';
import { ThemedNativeSelectDirective } from '../../products/themed-select/themed-native-select.directive';

@Component({
  selector: 'app-branch-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    NgbModalModule,
    NgbPaginationModule,
    NgbTooltipModule,
    ThemedNativeSelectDirective
  ],
  templateUrl: './branch-management.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: [`
    .font-jost {
      font-family: 'Jost', -apple-system, BlinkMacSystemFont, sans-serif;
    }
    .cat-main-card {
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
      background: #ffffff;
      overflow: hidden;
    }
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
        &:focus {
          border-color: #2e3192;
          box-shadow: 0 0 0 3px rgba(46, 49, 146, 0.1);
        }
      }
    }
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
      }
      td {
        padding: 12px 16px;
        font-size: 13px;
        border-bottom: 1px solid #f1f5f9;
        vertical-align: middle;
      }
      tbody tr:hover {
        background-color: #f8fafc;
      }
    }
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
      &:hover {
        background: #f1f5f9;
        color: #2e3192;
        border-color: #cbd5e1;
      }
    }
  `]
})
export class BranchManagementComponent implements OnInit {
  private workflowConfig = inject(WorkflowConfigService);
  private authService = inject(AuthenticationService);
  private modalService = inject(NgbModal);

  currentUser = this.authService.user;
  branches: RainbowBranch[] = [];

  // Scoping & Filters
  selectedCity: string = 'all';
  selectedStatus: string = 'all';
  searchTerm: string = '';

  // Pagination
  currentPage: number = 1;
  pageSize: number = 8;

  // Modals & Forms
  activeModalBranch: Partial<RainbowBranch> = {};
  isCreating: boolean = false;
  activeModalRef: any = null;

  // Pause Modal
  targetBranchToPause: RainbowBranch | null = null;
  pauseActionType: 'Pause' | 'Resume' = 'Pause';
  pauseReason: string = 'High Order Surge';
  pauseCustomNote: string = '';

  // Responsive expand for mobile
  expandedRowIds = new Set<string>();

  resetFilters(): void {
    this.selectedCity = 'all';
    this.selectedStatus = 'all';
    this.searchTerm = '';
    this.currentPage = 1;
  }

  get currentBranchDisplayName(): string {
    const code = this.currentUser?.branchCode || 'VAL-01';
    const found = this.branches.find(b => b.branchCode === code);
    return found ? `${found.name} (${found.branchCode})` : 'Assigned Branch';
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(u => {
      this.currentUser = u;
    });

    this.workflowConfig.branches$.subscribe(bList => {
      this.branches = bList;
    });
  }

  get isBranchLocked(): boolean {
    return this.currentUser?.role === 'Branch Manager';
  }

  get canEditBranchConfig(): boolean {
    return this.currentUser?.role === 'Admin';
  }

  get canToggleBranchPause(): boolean {
    return this.currentUser?.role === 'Admin' || this.currentUser?.role === 'Moderator';
  }

  get currentBranchCode(): string {
    return this.currentUser?.branchCode || 'VAL-01';
  }

  get filteredBranches(): RainbowBranch[] {
    return this.branches.filter(b => {
      if (this.isBranchLocked && b.branchCode !== this.currentBranchCode) {
        return false;
      }
      if (this.selectedCity !== 'all' && b.city !== this.selectedCity) {
        return false;
      }
      if (this.selectedStatus !== 'all' && b.status !== this.selectedStatus) {
        return false;
      }
      if (this.searchTerm.trim()) {
        const q = this.searchTerm.toLowerCase();
        const matchName = b.name.toLowerCase().includes(q);
        const matchCode = b.branchCode.toLowerCase().includes(q);
        const matchCity = b.city.toLowerCase().includes(q);
        const matchAddress = b.address.toLowerCase().includes(q);
        if (!matchName && !matchCode && !matchCity && !matchAddress) {
          return false;
        }
      }
      return true;
    });
  }

  get paginatedBranches(): RainbowBranch[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredBranches.slice(start, start + this.pageSize);
  }

  get cities(): string[] {
    return [...new Set(this.branches.map(b => b.city))].sort();
  }

  get metrics() {
    const list = this.isBranchLocked ? this.branches.filter(b => b.branchCode === this.currentBranchCode) : this.branches;
    const total = list.length;
    const activeOrders = list.reduce((acc, b) => acc + (b.activeOrders || 0), 0);
    const avgUtil = total > 0 ? Math.round(list.reduce((acc, b) => acc + (b.utilizationRate || 0), 0) / total) : 0;
    const highLoadCount = list.filter(b => b.utilizationRate >= 80 || b.status === 'Paused').length;
    return { total, activeOrders, avgUtil, highLoadCount };
  }

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

  openCreateModal(content: any): void {
    if (!this.canEditBranchConfig) return;
    this.isCreating = true;
    this.activeModalBranch = {
      id: '',
      branchCode: '',
      name: '',
      city: 'Karachi',
      address: '',
      phone: '+92',
      email: '',
      latitude: 24.8607,
      longitude: 67.0011,
      deliveryRadiusKm: 8,
      operatingHours: '08:00 AM - 11:30 PM',
      maxCapacityOrders: 50,
      activeOrders: 0,
      utilizationRate: 0,
      pickersOnDuty: 4,
      ridersAvailable: 6,
      status: 'Active',
      autoRerouteThreshold: 80,
      instantDeliveryEnabled: true,
      codMaxLimit: 50000
    };
    this.activeModalRef = this.modalService.open(content, { size: 'lg', centered: true, backdrop: 'static' });
  }

  openEditModal(branch: RainbowBranch, content: any): void {
    if (!this.canEditBranchConfig && this.currentUser?.role !== 'Branch Manager') return;
    this.isCreating = false;
    this.activeModalBranch = JSON.parse(JSON.stringify(branch));
    this.activeModalRef = this.modalService.open(content, { size: 'lg', centered: true, backdrop: 'static' });
  }

  openPauseModal(branch: RainbowBranch, content: any): void {
    if (!this.canToggleBranchPause) return;
    this.targetBranchToPause = branch;
    this.pauseActionType = branch.status === 'Paused' ? 'Resume' : 'Pause';
    this.pauseReason = branch.utilizationRate >= 80 ? 'Store Capacity Overload (>80%)' : 'Operational Maintenance';
    this.pauseCustomNote = '';
    this.activeModalRef = this.modalService.open(content, { centered: true, backdrop: 'static' });
  }

  confirmPauseToggle(): void {
    if (!this.targetBranchToPause) return;
    const newStatus = this.pauseActionType === 'Pause' ? 'Paused' : 'Active';
    const reasonText = `${this.pauseReason}${this.pauseCustomNote ? ': ' + this.pauseCustomNote : ''}`;
    this.workflowConfig.toggleBranchStatus(this.targetBranchToPause.branchCode, newStatus, reasonText, this.currentUser);
    void showSaveSuccess(`Branch "${this.targetBranchToPause.name}" is now ${newStatus}. Influx ${this.pauseActionType === 'Pause' ? 'paused' : 'restored'}.`);
    if (this.activeModalRef) {
      this.activeModalRef.close();
    }
  }

  saveBranchDetails(): void {
    if (!this.activeModalBranch.name?.trim()) {
      void showSaveValidation('Please enter a branch name.');
      return;
    }
    if (!this.activeModalBranch.branchCode?.trim()) {
      void showSaveValidation('Please enter a unique branch code (e.g. VAL-01, KHI-02).');
      return;
    }
    if (!this.activeModalBranch.address?.trim()) {
      void showSaveValidation('Please provide store physical address.');
      return;
    }

    if (this.isCreating) {
      this.activeModalBranch.id = this.activeModalBranch.branchCode.toUpperCase();
    }

    this.workflowConfig.saveBranch(this.activeModalBranch as RainbowBranch, this.currentUser, this.isCreating);
    void showSaveSuccess(`Branch "${this.activeModalBranch.name}" configuration saved successfully.`);
    if (this.activeModalRef) {
      this.activeModalRef.close();
    }
  }

  exportToCsv(): void {
    const headers = ['Branch Code', 'Branch Name', 'City', 'Address', 'Phone', 'Operating Hours', 'Radius (km)', 'Active Orders', 'Max Capacity', 'Load %', 'Status'];
    const rows = this.filteredBranches.map(b => [
      b.branchCode,
      `"${b.name}"`,
      b.city,
      `"${b.address}"`,
      b.phone,
      `"${b.operatingHours}"`,
      b.deliveryRadiusKm,
      b.activeOrders,
      b.maxCapacityOrders,
      `${b.utilizationRate}%`,
      b.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rainbow-branches-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
