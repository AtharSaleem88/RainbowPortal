import { showSaveSuccess, showSaveValidation } from '@shared/utils/save-alert';
import { confirmAction } from '@shared/utils/confirmation';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbModal, NgbModalModule, NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomerCoupon, RAINBOW_COUPONS } from './data';
import { RAINBOW_BRANCH_OPTIONS, BranchOption } from '../../promotions/data';
import { CouponMetricsComponent } from './components/coupon-metrics/coupon-metrics.component';

@Component({
  selector: 'app-coupons-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DecimalPipe,
    NgbDropdownModule,
    NgbPaginationModule,
    NgbModalModule,
    NgbTooltipModule,
    CouponMetricsComponent
  ],
  templateUrl: './coupons-list.component.html',
  styleUrl: './coupons-list.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CouponsListComponent implements OnInit {
  title = 'Customer Coupons & Vouchers';
  coupons: CustomerCoupon[] = RAINBOW_COUPONS;
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
      paused: this.coupons.filter(c => c.status === 'Paused').length,
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
      void showSaveValidation('Please enter a coupon code.');
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
        void showSaveValidation('Please select at least one branch for this coupon.');
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
        void showSaveSuccess(`Coupon "${couponCode}" updated successfully.`);
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
      void showSaveSuccess(`Coupon "${newCoupon.code}" created successfully for customers.`);
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

  async deleteCoupon(c: CustomerCoupon): Promise<void> {
    if (await confirmAction(`Are you sure you want to delete coupon code "${c.code}"?`)) {
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

export { CouponsListComponent as CouponsList };
