import { confirmAction } from '@/app/helper/confirmation';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule, NgbModal, NgbModalModule, NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { PushNotificationCampaign, MOCK_PUSH_NOTIFICATIONS } from '../data';
import { RainbowCustomer, RAINBOW_CUSTOMERS_LIST } from '../../customer/customer-list/data';
import { RAINBOW_BRANCH_OPTIONS, BranchOption } from '../../promotions/data';

@Component({
  selector: 'app-push-notifications',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe, RouterModule, NgbDropdownModule, NgbModalModule, NgbPaginationModule, NgbTooltipModule],
  templateUrl: './push-notifications.html',
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

    .campaign-table {
      table-layout: fixed;
      min-width: 1040px;

      th {
        padding: 14px 18px;
        white-space: nowrap;
        font-size: 10px;
      }

      th:nth-child(1) { width: 32%; }
      th:nth-child(2) { width: 21%; }
      th:nth-child(3) { width: 17%; }
      th:nth-child(4) { width: 10%; }
      th:nth-child(5) { width: 10%; }
      th:nth-child(6) { width: 10%; }

      td {
        padding: 18px;
        line-height: 1.5;
      }

      .text-dark { color: #334155 !important; }
      .campaign-title { color: #0f172a !important; }

      .campaign-title,
      .campaign-message {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        overflow-wrap: anywhere;
      }

      .badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        min-height: 25px;
        max-width: 100%;
        white-space: normal;
        text-align: left;
        line-height: 1.3;
        font-weight: 600;

        iconify-icon { flex-shrink: 0; }
      }

      td:nth-child(3) > div,
      td:nth-child(4) > div {
        white-space: nowrap;
      }

      .cat-action-btn {
        flex: 0 0 28px;
        width: 28px;
        height: 28px;
      }
    }

    :host-context(html[data-bs-theme="dark"]) .campaign-table {
      .text-dark { color: #dde4f0 !important; }
      .campaign-title { color: #f0f4ff !important; }
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

    /* Form Controls & Inputs */
    .form-control-sleek {
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      font-size: 13px;
      color: #0f172a;
      padding: 8px 12px;
      transition: all 0.15s ease;

      &:focus {
        border-color: #2e3192;
        box-shadow: 0 0 0 3px rgba(46, 49, 146, 0.1);
      }
    }

    /* Audience & Timing Selectable Cards */
    .audience-option-card, .timing-option-card {
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 14px 16px;
      background: #ffffff;
      cursor: pointer;
      transition: all 0.2s ease;
      height: 100%;

      &:hover {
        border-color: #cbd5e1;
        background: #f8fafc;
      }

      &.selected {
        border-color: #2e3192;
        background: #f8faff;
        border-width: 1.5px;
      }
    }

    .timing-icon-box {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: all 0.15s ease;
    }

    /* Emoji Chip */
    .emoji-toolbar {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 6px;
    }

    .emoji-chip {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 32px;
      width: 32px;
      height: 32px;
      padding: 0;
      font-size: 14px;
      line-height: 1;
      border-radius: 6px;
      border: 1px solid #e2e8f0;
      background: #ffffff;
      cursor: pointer;
      transition: all 0.15s ease;
      &:hover {
        background: #f1f5f9;
        border-color: #cbd5e1;
        transform: translateY(-1px);
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
export class PushNotifications implements OnInit {
  title = 'Push Notifications Hub';
  notifications: PushNotificationCampaign[] = MOCK_PUSH_NOTIFICATIONS;
  branches: BranchOption[] = RAINBOW_BRANCH_OPTIONS;
  customers: RainbowCustomer[] = RAINBOW_CUSTOMERS_LIST;

  // Filter state
  filterAudience: string = 'all';
  filterBranch: string = 'all';
  filterStatus: string = 'all';
  searchTerm: string = '';

  // Pagination
  currentPage: number = 1;
  pageSize: number = 6;

  // Notification Composer Form State
  formTitle: string = '⚡ Weekend Fresh Produce Bash: Flat 20% Off!';
  formMessage: string = 'Farm-fresh fruits & organic vegetables restocked at Rainbow Valencia. Order now before stock runs out!';
  formTargetType: 'all' | 'branch' | 'segment' | 'individual' = 'branch';
  formTargetBranch: string = 'Rainbow Cash & Carry - Valencia, Lahore';
  formTargetSegment: string = 'Repeat Buyers';
  formTargetCustomerId: string = 'CUST-1001';
  formCustomerSearch: string = '';
  formTiming: 'immediate' | 'scheduled' = 'immediate';
  formScheduleDate: string = '2026-10-16';
  formScheduleTime: string = '10:00';

  // Feedback Notification
  actionFeedback: string | null = null;
  selectedNotification: PushNotificationCampaign | null = null;

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {}

  get counts() {
    return {
      all: this.notifications.length,
      sent: this.notifications.filter(n => n.status === 'Sent').length,
      scheduled: this.notifications.filter(n => n.status === 'Scheduled').length,
      draft: this.notifications.filter(n => n.status === 'Draft').length,
      totalSentRecipients: this.notifications.filter(n => n.status === 'Sent').reduce((acc, n) => acc + (n.recipientsCount || 0), 0),
    };
  }

  setStatusTab(status: string) {
    this.filterStatus = status;
    this.currentPage = 1;
  }

  resetFilters() {
    this.filterAudience = 'all';
    this.filterBranch = 'all';
    this.filterStatus = 'all';
    this.searchTerm = '';
    this.currentPage = 1;
  }

  onSearchChange() {
    this.currentPage = 1;
  }

  clearSearch() {
    this.searchTerm = '';
    this.currentPage = 1;
  }

  get currentStartIndex(): number {
    return this.filteredNotifications.length === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }

  get currentEndIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredNotifications.length);
  }

  // Computed recipients preview based on target type
  get estimatedRecipientsCount(): number {
    if (this.formTargetType === 'all') return 30278;
    if (this.formTargetType === 'individual') return 1;
    if (this.formTargetType === 'segment') {
      if (this.formTargetSegment === 'Repeat Buyers') return 10804;
      if (this.formTargetSegment === 'VIP Customers') return 18;
      if (this.formTargetSegment === 'Cart Abandoners') return 349;
      if (this.formTargetSegment === 'Dormant Customers') return 15160;
      if (this.formTargetSegment === 'New Customers') return 1683;
      return 5000;
    }
    if (this.formTargetType === 'branch') {
      if (this.formTargetBranch.includes('Clifton')) return 8250;
      if (this.formTargetBranch.includes('Valencia')) return 4850;
      if (this.formTargetBranch.includes('Wapda Town')) return 6120;
      if (this.formTargetBranch.includes('Gulshan')) return 5400;
      if (this.formTargetBranch.includes('DHA')) return 3980;
      if (this.formTargetBranch.includes('Canal')) return 3100;
      return 4500;
    }
    return 30278;
  }

  get filteredCustomersList(): RainbowCustomer[] {
    if (!this.formCustomerSearch.trim()) return this.customers;
    const q = this.formCustomerSearch.toLowerCase();
    return this.customers.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      (c.customerCode && c.customerCode.toLowerCase().includes(q)) ||
      c.email.toLowerCase().includes(q)
    );
  }

  get selectedCustomerDetail(): RainbowCustomer | undefined {
    return this.customers.find(c => c.id === this.formTargetCustomerId);
  }

  get filteredNotifications(): PushNotificationCampaign[] {
    return this.notifications.filter(n => {
      // Audience filter
      if (this.filterAudience !== 'all' && n.targetType !== this.filterAudience) {
        return false;
      }
      // Branch filter
      if (this.filterBranch !== 'all') {
        if (n.targetType === 'branch' && !n.targetBranch?.includes(this.filterBranch)) {
          return false;
        }
        if (n.targetType !== 'branch' && n.targetType !== 'all') {
          return false;
        }
      }
      // Status filter
      if (this.filterStatus !== 'all' && n.status !== this.filterStatus) {
        return false;
      }
      // Search term
      if (this.searchTerm.trim()) {
        const q = this.searchTerm.toLowerCase();
        const matchesTitle = n.title.toLowerCase().includes(q);
        const matchesMsg = n.message.toLowerCase().includes(q);
        const matchesTarget = n.targetBranch?.toLowerCase().includes(q) || n.targetCustomerName?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesMsg && !matchesTarget) {
          return false;
        }
      }
      return true;
    });
  }

  get paginatedNotifications(): PushNotificationCampaign[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredNotifications.slice(start, start + this.pageSize);
  }

  addEmoji(emoji: string) {
    this.formTitle += (this.formTitle ? ' ' : '') + emoji;
  }

  sendPushNotification() {
    if (!this.formTitle.trim()) {
      alert('Please enter a notification title.');
      return;
    }
    if (!this.formMessage.trim()) {
      alert('Please enter a notification message.');
      return;
    }

    const selectedCust = this.selectedCustomerDetail;
    const isScheduled = this.formTiming === 'scheduled';
    const now = new Date();
    const formattedDate = now.toLocaleDateString() + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newNotification: PushNotificationCampaign = {
      id: `NOTIF-${Date.now().toString().slice(-4)}`,
      title: this.formTitle,
      message: this.formMessage,
      targetType: this.formTargetType,
      targetBranch: this.formTargetType === 'branch' ? this.formTargetBranch : (this.formTargetType === 'all' ? 'All Branches' : undefined),
      targetSegment: this.formTargetType === 'segment' ? this.formTargetSegment : undefined,
      targetCustomerId: this.formTargetType === 'individual' ? this.formTargetCustomerId : undefined,
      targetCustomerName: this.formTargetType === 'individual' ? (selectedCust?.name || 'Selected Customer') : undefined,
      targetCustomerPhone: this.formTargetType === 'individual' ? (selectedCust?.phone || '') : undefined,
      status: isScheduled ? 'Scheduled' : 'Sent',
      scheduledAt: isScheduled ? `${this.formScheduleDate} ${this.formScheduleTime}` : undefined,
      sentAt: !isScheduled ? formattedDate : undefined,
      recipientsCount: this.estimatedRecipientsCount,
      deliveredCount: !isScheduled ? Math.round(this.estimatedRecipientsCount * 0.985) : 0,
      openRate: !isScheduled ? 19.5 : 0,
      clickRate: !isScheduled ? 9.8 : 0,
      createdAt: formattedDate,
    };

    this.notifications.unshift(newNotification);

    if (isScheduled) {
      this.showNotification(`Notification scheduled successfully for ${newNotification.scheduledAt} to ${newNotification.recipientsCount} recipient(s).`);
    } else {
      this.showNotification(`Notification broadcasted live to ${newNotification.recipientsCount} customer(s).`);
    }

    this.currentPage = 1;
  }

  async cancelScheduledNotification(notif: PushNotificationCampaign): Promise<void> {
    if (await confirmAction(`Cancel scheduled notification "${notif.title}"?`, 'Cancel scheduled notification?', 'Yes, cancel dispatch')) {
      notif.status = 'Draft';
      this.showNotification(`Notification #${notif.id} moved to Drafts.`);
    }
  }

  openDetailsModal(notif: PushNotificationCampaign, modalContent: any) {
    this.selectedNotification = notif;
    this.modalService.open(modalContent, { size: 'lg', centered: true });
  }

  showNotification(msg: string) {
    this.actionFeedback = msg;
    setTimeout(() => {
      this.actionFeedback = null;
    }, 4500);
  }
}
