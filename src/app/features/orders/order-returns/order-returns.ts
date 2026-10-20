import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgbDropdownModule, NgbModal, NgbModalModule, NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { RAINBOW_RETURNS, RainbowOrderReturn } from '../data';
import { AuthenticationService } from '@/app/core/services/auth.service';
import { ReturnMetricsComponent } from './components/return-metrics/return-metrics.component';

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
    NgbTooltipModule,
    ReturnMetricsComponent
  ],
  templateUrl: './order-returns.html',
  styleUrl: './order-returns.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class OrderReturns implements OnInit {
  title = 'Returns & Refund Claims Console';
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
