import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgbDropdownModule, NgbModal, NgbModalModule, NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { RAINBOW_FEEDBACK, RainbowOrderFeedback } from '../data';
import { AuthenticationService } from '@/app/core/services/auth.service';

@Component({
  selector: 'app-order-feedback',
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
  templateUrl: './order-feedback.html',
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
    .feedback-table {
      table-layout: fixed;
      min-width: 1120px;

      th { padding: 14px 16px; font-size: 10px; }
      th:nth-child(1) { width: 14%; }
      th:nth-child(2) { width: 21%; }
      th:nth-child(3) { width: 14%; }
      th:nth-child(4) { width: 27%; }
      th:nth-child(5), th:nth-child(6) { width: 12%; }
      td { padding: 16px; line-height: 1.5; }
      .text-dark { color: #334155 !important; }
      .feedback-date { white-space: nowrap; }
      .feedback-rating {
        white-space: nowrap;
        iconify-icon { flex-shrink: 0; }
      }
      .badge {
        padding: 4px 7px;
        line-height: 1.4;
        white-space: nowrap;
      }
      .feedback-comment {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
        overflow-wrap: anywhere;
      }
      .cat-action-btn {
        flex: 0 0 28px;
        width: 28px;
        height: 28px;
      }
    }

    :host-context(html[data-bs-theme="dark"]) .feedback-table {
      .text-dark { color: #dde4f0 !important; }
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
export class OrderFeedback implements OnInit {
  title = 'Customer Feedback & Reviews Console';
  feedbacks: RainbowOrderFeedback[] = RAINBOW_FEEDBACK;

  authService = inject(AuthenticationService);
  currentUser = this.authService.user;

  // Filters
  selectedBranch: string = 'all';
  selectedStatus: string = 'all';
  selectedRating: string = 'all';
  searchTerm: string = '';

  // Pagination
  pageSize: number = 8;
  currentPage: number = 1;

  // Active Feedback for Modal
  selectedFeedback: RainbowOrderFeedback | null = null;
  moderatorNoteInput: string = '';
  storeReplyInput: string = '';
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
    const total = this.feedbacks.length;
    const avgRating = total > 0 
      ? (this.feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / total).toFixed(1)
      : '5.0';
    return {
      all: total,
      pending: this.feedbacks.filter(f => f.status === 'Pending Moderation').length,
      approved: this.feedbacks.filter(f => f.status === 'Approved').length,
      rejected: this.feedbacks.filter(f => f.status === 'Rejected').length,
      averageRating: avgRating,
    };
  }

  get filteredFeedbacks(): RainbowOrderFeedback[] {
    return this.feedbacks.filter(f => {
      // Branch filter
      if (this.selectedBranch !== 'all' && f.branchCode !== this.selectedBranch && !f.branch.includes(this.selectedBranch)) {
        return false;
      }
      // Status filter
      if (this.selectedStatus !== 'all' && f.status !== this.selectedStatus) {
        return false;
      }
      // Rating filter
      if (this.selectedRating !== 'all' && f.rating !== parseInt(this.selectedRating, 10)) {
        return false;
      }
      // Search term
      if (this.searchTerm.trim()) {
        const q = this.searchTerm.toLowerCase();
        const matchesOrder = f.orderId.toLowerCase().includes(q);
        const matchesName = f.customer.name.toLowerCase().includes(q);
        const matchesPhone = f.customer.phone.toLowerCase().includes(q);
        const matchesComment = f.comment.toLowerCase().includes(q);
        const matchesProduct = f.productMentioned ? f.productMentioned.toLowerCase().includes(q) : false;
        if (!matchesOrder && !matchesName && !matchesPhone && !matchesComment && !matchesProduct) {
          return false;
        }
      }
      return true;
    });
  }

  get paginatedFeedbacks(): RainbowOrderFeedback[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredFeedbacks.slice(start, start + this.pageSize);
  }

  get currentStartIndex(): number {
    if (this.filteredFeedbacks.length === 0) return 0;
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get currentEndIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredFeedbacks.length);
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
    this.selectedRating = 'all';
    this.searchTerm = '';
    this.currentPage = 1;
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Approved':
        return 'bg-success-subtle text-success border border-success-subtle';
      case 'Pending Moderation':
        return 'bg-warning-subtle text-warning border border-warning-subtle';
      case 'Rejected':
        return 'bg-danger-subtle text-danger border border-danger-subtle';
      default:
        return 'bg-secondary-subtle text-secondary';
    }
  }

  openDetailModal(item: RainbowOrderFeedback, content: any) {
    this.selectedFeedback = item;
    this.moderatorNoteInput = item.moderatorNotes || '';
    this.storeReplyInput = item.adminReply || '';
    this.modalService.open(content, { size: 'lg', centered: true, backdrop: 'static' });
  }

  approveFeedback(item: RainbowOrderFeedback, modalRef?: any) {
    item.status = 'Approved';
    item.displayOnStorefront = true;
    item.moderatorNotes = this.moderatorNoteInput.trim() || 'Approved for public display on customer app.';
    item.adminReply = this.storeReplyInput.trim() || item.adminReply;
    item.reviewedBy = this.currentUser?.name || 'Store Administrator';
    item.reviewedAt = new Date().toLocaleString();
    this.showNotification(`Feedback from ${item.customer.name} (Order #${item.orderId}) approved and published to storefront.`);
    if (modalRef) {
      modalRef.close();
    }
  }

  rejectFeedback(item: RainbowOrderFeedback, modalRef?: any) {
    item.status = 'Rejected';
    item.displayOnStorefront = false;
    item.moderatorNotes = this.moderatorNoteInput.trim() || 'Rejected from storefront display.';
    item.reviewedBy = this.currentUser?.name || 'Store Administrator';
    item.reviewedAt = new Date().toLocaleString();
    this.showNotification(`Feedback #${item.id} rejected and hidden from storefront.`);
    if (modalRef) {
      modalRef.close();
    }
  }

  toggleLiveStatus(item: RainbowOrderFeedback) {
    if (item.displayOnStorefront) {
      item.displayOnStorefront = false;
      item.status = 'Rejected';
      this.showNotification(`Review hidden from storefront.`);
    } else {
      item.displayOnStorefront = true;
      item.status = 'Approved';
      this.showNotification(`Review published to storefront.`);
    }
  }

  showNotification(msg: string) {
    this.actionFeedback = msg;
    setTimeout(() => {
      this.actionFeedback = null;
    }, 4500);
  }

  getStarArray(rating: number): number[] {
    return Array.from({ length: 5 }, (_, i) => i < rating ? 1 : 0);
  }

  exportToCsv() {
    const headers = ['Feedback ID', 'Order ID', 'Date', 'Branch', 'Customer', 'Phone', 'Rating', 'Topic', 'Product Mentioned', 'Comment', 'Status', 'Live on App'];
    const rows = this.filteredFeedbacks.map(f => [
      f.id,
      f.orderId,
      f.date,
      `"${f.branch}"`,
      `"${f.customer.name}"`,
      f.customer.phone,
      f.rating,
      `"${f.feedbackType}"`,
      `"${f.productMentioned || ''}"`,
      `"${f.comment.replace(/"/g, '""')}"`,
      f.status,
      f.displayOnStorefront ? 'Yes' : 'No'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rainbow-feedback-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
