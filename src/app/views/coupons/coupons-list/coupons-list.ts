import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbModal, NgbModalModule, NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomerCoupon, RAINBOW_COUPONS } from './data';
import { RAINBOW_BRANCH_OPTIONS, BranchOption } from '../../promotions/data';

@Component({
  selector: 'app-coupons-list',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe, NgbDropdownModule, NgbPaginationModule, NgbModalModule, NgbTooltipModule],
  templateUrl: './coupons-list.html',
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

    .page-select-input {
      height: 34px;
      width: 120px;
      min-width: 120px;
      border-radius: 7px;
      border: 1px solid #cbd5e1;
      font-size: 12px;
      font-weight: 500;
      color: #1e293b;
      cursor: pointer;
      background-color: #ffffff;
      padding-left: 10px;
      padding-right: 28px;
      transition: all 0.15s ease;

      &:focus {
        border-color: #2e3192;
        box-shadow: 0 0 0 3px rgba(46, 49, 146, 0.1);
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

      &.btn-pause:hover {
        background: #fffbeb;
        color: #d97706;
        border-color: #fcd34d;
      }

      &.btn-play:hover {
        background: #ecfdf5;
        color: #059669;
        border-color: #a7f3d0;
      }
    }

    /* Form Controls */
    .form-control-sleek {
      border: 1px solid #cbd5e1;
      border-radius: 7px;
      font-size: 12.5px;
      color: #0f172a;
      transition: all 0.15s ease;

      &:focus {
        border-color: #2e3192;
        box-shadow: 0 0 0 3px rgba(46, 49, 146, 0.1);
      }
    }
  `]
})
export class CouponsList implements OnInit {
  title = 'Customer Coupons & Vouchers';
  coupons: CustomerCoupon[] = RAINBOW_COUPONS;
  branches: BranchOption[] = RAINBOW_BRANCH_OPTIONS;

  // Filters
  selectedBranch: string = 'all';
  selectedStatus: string = 'all';
  selectedDiscountType: string = 'all';
  selectedSegment: string = 'all';
  searchTerm: string = '';

  // Pagination
  pageSize: number = 8;
  currentPage: number = 1;

  // Modal State for Add / Edit
  isEditing: boolean = false;
  activeModalRef: any = null;
  formCoupon: Partial<CustomerCoupon> = {};
  selectedBranchMap: { [branchId: string]: boolean } = {};
  actionFeedback: string | null = null;
  copiedCode: string | null = null;

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {
    this.refreshAllStatuses();
  }

  // Automatically refresh coupon statuses relying on start & end dates
  refreshAllStatuses(): void {
    for (const c of this.coupons) {
      if (c.status !== 'Paused') {
        c.status = this.computeStatusFromDates(c.startDate, c.endDate);
      }
    }
  }

  computeStatusFromDates(startDateStr?: string, endDateStr?: string): 'Active' | 'Scheduled' | 'Expired' {
    if (!startDateStr || !endDateStr) return 'Active';
    const todayStr = new Date().toISOString().substring(0, 10);
    if (todayStr < startDateStr) {
      return 'Scheduled';
    } else if (todayStr > endDateStr) {
      return 'Expired';
    } else {
      return 'Active';
    }
  }

  get counts() {
    return {
      all: this.coupons.length,
      active: this.coupons.filter(c => c.status === 'Active').length,
      scheduled: this.coupons.filter(c => c.status === 'Scheduled').length,
      expired: this.coupons.filter(c => c.status === 'Expired' || c.status === 'Paused').length,
      totalRedemptions: this.coupons.reduce((acc, c) => acc + (c.usageCount || 0), 0),
      totalSavings: this.coupons.reduce((acc, c) => acc + (c.totalSavingsAwarded || 0), 0),
    };
  }

  get filteredCoupons(): CustomerCoupon[] {
    return this.coupons.filter(c => {
      // Branch filter
      if (this.selectedBranch !== 'all') {
        if (c.branchSelection === 'all') {
          // Applies everywhere
        } else if (!c.targetBranchIds.includes(this.selectedBranch)) {
          return false;
        }
      }
      // Status filter
      if (this.selectedStatus !== 'all' && c.status !== this.selectedStatus) {
        return false;
      }
      // Discount type
      if (this.selectedDiscountType !== 'all' && c.discountType !== this.selectedDiscountType) {
        return false;
      }
      // Customer Segment
      if (this.selectedSegment !== 'all' && c.customerSegment !== this.selectedSegment) {
        return false;
      }
      // Search term
      if (this.searchTerm.trim()) {
        const q = this.searchTerm.toLowerCase();
        const matchesCode = c.code.toLowerCase().includes(q);
        const matchesTitle = c.title.toLowerCase().includes(q);
        const matchesDesc = c.description.toLowerCase().includes(q);
        if (!matchesCode && !matchesTitle && !matchesDesc) {
          return false;
        }
      }
      return true;
    });
  }

  get paginatedCoupons(): CustomerCoupon[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredCoupons.slice(start, start + this.pageSize);
  }

  get currentEndIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredCoupons.length);
  }

  setStatusTab(status: string) {
    this.selectedStatus = status;
    this.currentPage = 1;
  }

  onSearchChange(): void {
    this.currentPage = 1;
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.currentPage = 1;
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
  }

  resetFilters() {
    this.selectedBranch = 'all';
    this.selectedStatus = 'all';
    this.selectedDiscountType = 'all';
    this.selectedSegment = 'all';
    this.searchTerm = '';
    this.currentPage = 1;
  }

  copyCode(code: string) {
    navigator.clipboard.writeText(code).then(() => {
      this.copiedCode = code;
      this.showNotification(`Coupon code "${code}" copied to clipboard!`);
      setTimeout(() => {
        this.copiedCode = null;
      }, 2500);
    });
  }

  generateRandomCode() {
    const prefixes = ['RAINBOW', 'SUPER', 'SAVE', 'DISCOUNT', 'DEAL', 'FRESH'];
    const p = prefixes[Math.floor(Math.random() * prefixes.length)];
    const n = Math.floor(100 + Math.random() * 900);
    this.formCoupon.code = `${p}${n}`;
  }

  openCreateModal(content: any) {
    this.isEditing = false;
    this.formCoupon = {
      code: 'RAINBOW15',
      title: 'RAINBOW15',
      description: '',
      discountType: 'percentage',
      discountValue: 15,
      maxDiscountCap: 600,
      minCartValue: 2500,
      customerSegment: 'All Customers',
      branchSelection: 'all',
      targetBranchIds: [],
      targetBranchNames: [],
      usageLimitTotal: 1000,
      usageCount: 0,
      usageLimitPerCustomer: 1,
      startDate: new Date().toISOString().substring(0, 10),
      endDate: new Date(Date.now() + 30 * 86400000).toISOString().substring(0, 10),
    };
    this.formCoupon.status = this.computeStatusFromDates(this.formCoupon.startDate, this.formCoupon.endDate);

    this.selectedBranchMap = {};
    for (const b of this.branches) {
      this.selectedBranchMap[b.id] = true;
    }

    this.activeModalRef = this.modalService.open(content, { size: 'lg', centered: true, backdrop: 'static' });
  }

  openEditModal(c: CustomerCoupon, content: any) {
    this.isEditing = true;
    this.formCoupon = { ...c };
    this.selectedBranchMap = {};
    for (const b of this.branches) {
      this.selectedBranchMap[b.id] = c.branchSelection === 'all' || c.targetBranchIds.includes(b.id);
    }
    this.activeModalRef = this.modalService.open(content, { size: 'lg', centered: true, backdrop: 'static' });
  }

  selectAllBranches(select: boolean) {
    for (const b of this.branches) {
      this.selectedBranchMap[b.id] = select;
    }
  }

  saveCoupon() {
    if (!this.formCoupon.code?.trim()) {
      alert('Please enter a coupon code.');
      return;
    }

    let targetedIds: string[] = [];
    let targetedNames: string[] = [];

    if (this.formCoupon.branchSelection === 'all') {
      targetedIds = this.branches.map(b => b.id);
      targetedNames = ['All 10 Superstores'];
    } else {
      targetedIds = this.branches.filter(b => this.selectedBranchMap[b.id]).map(b => b.id);
      if (targetedIds.length === 0) {
        alert('Please select at least one branch for this coupon.');
        return;
      }
      if (targetedIds.length === this.branches.length) {
        this.formCoupon.branchSelection = 'all';
        targetedNames = ['All 10 Superstores'];
      } else {
        targetedNames = this.branches.filter(b => targetedIds.includes(b.id)).map(b => b.name.replace(/Branch \d+ - /, ''));
      }
    }

    const computedStatus = this.computeStatusFromDates(this.formCoupon.startDate, this.formCoupon.endDate);
    const couponCode = this.formCoupon.code.toUpperCase().trim();

    if (this.isEditing && this.formCoupon.id) {
      const idx = this.coupons.findIndex(c => c.id === this.formCoupon.id);
      if (idx !== -1) {
        this.coupons[idx] = {
          ...this.coupons[idx],
          ...this.formCoupon,
          code: couponCode,
          title: this.formCoupon.title || couponCode,
          targetBranchIds: targetedIds,
          targetBranchNames: targetedNames,
          status: computedStatus,
        } as CustomerCoupon;
        this.showNotification(`Coupon "${couponCode}" updated successfully.`);
      }
    } else {
      const newCoupon: CustomerCoupon = {
        id: `CPN-00${this.coupons.length + 1}`,
        code: couponCode,
        title: this.formCoupon.title || couponCode,
        description: '',
        discountType: this.formCoupon.discountType as any,
        discountValue: Number(this.formCoupon.discountValue) || 10,
        maxDiscountCap: this.formCoupon.maxDiscountCap ? Number(this.formCoupon.maxDiscountCap) : undefined,
        minCartValue: Number(this.formCoupon.minCartValue) || 1500,
        customerSegment: (this.formCoupon.customerSegment as any) || 'All Customers',
        branchSelection: this.formCoupon.branchSelection as any,
        targetBranchIds: targetedIds,
        targetBranchNames: targetedNames,
        usageLimitTotal: Number(this.formCoupon.usageLimitTotal) || 1000,
        usageCount: 0,
        usageLimitPerCustomer: Number(this.formCoupon.usageLimitPerCustomer) || 1,
        startDate: this.formCoupon.startDate || new Date().toISOString().substring(0, 10),
        endDate: this.formCoupon.endDate || new Date(Date.now() + 30 * 86400000).toISOString().substring(0, 10),
        status: computedStatus,
        totalSavingsAwarded: 0,
        createdAt: new Date().toLocaleDateString(),
      };
      this.coupons.unshift(newCoupon);
      this.showNotification(`Coupon "${newCoupon.code}" created successfully for customers.`);
    }

    if (this.activeModalRef) {
      this.activeModalRef.close();
    }
  }

  toggleStatus(c: CustomerCoupon) {
    if (c.status === 'Active') {
      c.status = 'Paused';
      this.showNotification(`Coupon "${c.code}" paused.`);
    } else {
      c.status = 'Active';
      this.showNotification(`Coupon "${c.code}" activated.`);
    }
  }

  deleteCoupon(c: CustomerCoupon) {
    if (confirm(`Are you sure you want to delete coupon code "${c.code}"?`)) {
      this.coupons = this.coupons.filter(item => item.id !== c.id);
      this.showNotification(`Coupon "${c.code}" deleted.`);
    }
  }

  showNotification(msg: string) {
    this.actionFeedback = msg;
    setTimeout(() => {
      this.actionFeedback = null;
    }, 4500);
  }

  getUsagePercent(used: number, total: number): number {
    if (!total || total === 0) return 0;
    return Math.min(100, Math.round((used / total) * 100));
  }
}
