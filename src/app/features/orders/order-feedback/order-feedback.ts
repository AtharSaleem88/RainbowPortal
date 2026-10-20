import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgbDropdownModule, NgbModal, NgbModalModule, NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { RAINBOW_FEEDBACK, RainbowOrderFeedback } from '../data';
import { AuthenticationService } from '@/app/core/services/auth.service';
import { FeedbackMetricsComponent } from './components/feedback-metrics/feedback-metrics.component';

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
    NgbTooltipModule,
    FeedbackMetricsComponent
  ],
  templateUrl: './order-feedback.html',
  styleUrl: './order-feedback.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
      ? Number((this.feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / total).toFixed(1))
      : 5.0;
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
