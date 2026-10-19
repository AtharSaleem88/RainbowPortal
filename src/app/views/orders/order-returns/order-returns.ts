import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgbDropdownModule, NgbModal, NgbModalModule, NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { RAINBOW_RETURNS, RainbowOrderReturn } from '../data';
import { AuthenticationService } from '@/app/core/services/auth.service';

@Component({
  selector: 'app-order-returns',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DecimalPipe,
    RouterLink,
    NgbDropdownModule,
    NgbPaginationModule,
    NgbModalModule,
    NgbTooltipModule
  ],
  templateUrl: './order-returns.html',
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

      &.btn-approve:hover {
        background: #f0fdf4;
        color: #16a34a;
        border-color: #bbf7d0;
      }

      &.btn-reject:hover {
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
export class OrderReturns implements OnInit {
  title = 'Order Returns Management';
  returns: RainbowOrderReturn[] = RAINBOW_RETURNS;

  authService = inject(AuthenticationService);
  currentUser = this.authService.user;

  // Filter Dropdown States
  selectedBranch: string = 'all';
  selectedStatus: string = 'all';
  selectedReason: string = 'all';
  selectedRefundChannel: string = 'all';
  searchTerm: string = '';

  // Pagination
  pageSize: number = 8;
  currentPage: number = 1;

  // Active Selected Return for Review Modal
  selectedReturn: RainbowOrderReturn | null = null;
  moderatorNoteInput: string = '';
  actionFeedback: string | null = null;

  branches: { id: string; name: string }[] = [
    { id: 'all', name: 'All Branches' },
    { id: 'VAL-01', name: 'Rainbow Cash & Carry - Valencia' },
    { id: 'SKP-01', name: 'Rainbow Cash & Carry - Sheikhupura' },
    { id: 'CNR-01', name: 'Rainbow Cash & Carry - Canal Road' },
    { id: 'CLF-01', name: 'Rainbow Superstore - Clifton' },
    { id: 'GSH-01', name: 'Rainbow Superstore - Gulshan' },
    { id: 'DHA-06', name: 'Rainbow Superstore - DHA Phase 6' },
    { id: 'BHR-01', name: 'Rainbow Superstore - Bahria Town' },
  ];

  reasons: string[] = [
    'All Reasons',
    'Damaged or defective item',
    'Expired near shelf life',
    'Quality issue',
    'Wrong item delivered',
    'Missing seal / pack issue',
  ];

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {
    this.applyBranchScoping(this.authService.user);
    this.authService.currentUser$.subscribe((user: any) => {
      this.currentUser = user;
      this.applyBranchScoping(user);
    });
  }

  applyBranchScoping(user: any) {
    if (user?.role === 'Branch Manager' || user?.role === 'Moderator') {
      this.selectedBranch = user.branchCode || 'VAL-01';
    }
  }

  get isBranchLocked(): boolean {
    return this.currentUser?.role === 'Branch Manager' || this.currentUser?.role === 'Moderator';
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
      all: this.returns.length,
      pending: this.returns.filter(r => r.status === 'Pending Review').length,
      approved: this.returns.filter(r => r.status === 'Approved & Refunded').length,
      rejected: this.returns.filter(r => r.status === 'Rejected').length,
      totalRefunded: this.returns
        .filter(r => r.status === 'Approved & Refunded')
        .reduce((acc, curr) => acc + curr.refundAmount, 0),
    };
  }

  get filteredReturns(): RainbowOrderReturn[] {
    return this.returns.filter(r => {
      // Branch filter
      if (this.selectedBranch !== 'all' && r.branchCode !== this.selectedBranch && !r.branch.includes(this.selectedBranch)) {
        return false;
      }
      // Status filter
      if (this.selectedStatus !== 'all' && r.status !== this.selectedStatus) {
        return false;
      }
      // Reason filter
      if (this.selectedReason !== 'all' && this.selectedReason !== 'All Reasons' && r.reason !== this.selectedReason) {
        return false;
      }
      // Channel filter
      if (this.selectedRefundChannel !== 'all' && r.refundChannel !== this.selectedRefundChannel) {
        return false;
      }
      // Search term
      if (this.searchTerm.trim()) {
        const q = this.searchTerm.toLowerCase();
        const matchesId = r.id.toLowerCase().includes(q);
        const matchesOrder = r.orderId.toLowerCase().includes(q);
        const matchesCust = r.customer.name.toLowerCase().includes(q);
        const matchesPhone = r.customer.phone.toLowerCase().includes(q);
        const matchesItem = r.item.name.toLowerCase().includes(q);
        const matchesReason = r.reason.toLowerCase().includes(q);
        if (!matchesId && !matchesOrder && !matchesCust && !matchesPhone && !matchesItem && !matchesReason) {
          return false;
        }
      }
      return true;
    });
  }

  get paginatedReturns(): RainbowOrderReturn[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredReturns.slice(start, start + this.pageSize);
  }

  get currentStartIndex(): number {
    if (this.filteredReturns.length === 0) return 0;
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get currentEndIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredReturns.length);
  }

  onSearchChange() {
    this.currentPage = 1;
  }

  clearSearch() {
    this.searchTerm = '';
    this.currentPage = 1;
  }

  setStatusTab(status: string) {
    this.selectedStatus = status;
    this.currentPage = 1;
  }

  resetFilters() {
    if (!this.isBranchLocked) {
      this.selectedBranch = 'all';
    }
    this.selectedStatus = 'all';
    this.selectedReason = 'all';
    this.selectedRefundChannel = 'all';
    this.searchTerm = '';
    this.currentPage = 1;
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Pending Review':
        return 'bg-warning-subtle text-warning border border-warning-subtle';
      case 'Approved & Refunded':
        return 'bg-success-subtle text-success border border-success-subtle';
      case 'Rejected':
        return 'bg-danger-subtle text-danger border border-danger-subtle';
      default:
        return 'bg-secondary-subtle text-secondary';
    }
  }

  openReviewModal(ret: RainbowOrderReturn, content: any) {
    this.selectedReturn = ret;
    this.moderatorNoteInput = ret.moderatorNotes || '';
    this.modalService.open(content, { size: 'lg', centered: true, backdrop: 'static' });
  }

  approveReturn(ret: RainbowOrderReturn, modalRef?: any) {
    ret.status = 'Approved & Refunded';
    ret.moderatorNotes = this.moderatorNoteInput.trim() || 'Return approved. Refund issued to customer wallet.';
    ret.reviewedBy = this.currentUser?.name || 'Store Administrator';
    ret.reviewedAt = new Date().toLocaleString();
    this.showNotification(`Return #${ret.id} for Order #${ret.orderId} approved. Rs. ${ret.refundAmount} refunded via ${ret.refundChannel}.`);
    if (modalRef) {
      modalRef.close();
    }
  }

  rejectReturn(ret: RainbowOrderReturn, modalRef?: any) {
    ret.status = 'Rejected';
    ret.moderatorNotes = this.moderatorNoteInput.trim() || 'Return claim rejected after review.';
    ret.reviewedBy = this.currentUser?.name || 'Store Administrator';
    ret.reviewedAt = new Date().toLocaleString();
    this.showNotification(`Return #${ret.id} has been marked as Rejected.`);
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

  exportToCsv() {
    const headers = ['Return ID', 'Order ID', 'Return Date', 'Branch', 'Customer Name', 'Phone', 'Item', 'Qty', 'Unit Price', 'Refund Amount', 'Channel', 'Status', 'Reason'];
    const rows = this.filteredReturns.map(r => [
      r.id,
      r.orderId,
      r.returnDate,
      `"${r.branch}"`,
      `"${r.customer.name}"`,
      r.customer.phone,
      `"${r.item.name}"`,
      r.item.quantity,
      r.item.unitPrice,
      r.refundAmount,
      `"${r.refundChannel}"`,
      r.status,
      `"${r.reason}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rainbow-returns-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
