import { showSaveSuccess } from '@shared/utils/save-alert';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModal, NgbModalModule, NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import {
  WalletSystemConfig,
  CustomerWalletAccount,
  MOCK_WALLET_CONFIG,
  MOCK_CUSTOMER_WALLETS,
} from '../data';
import { RAINBOW_BRANCH_OPTIONS, BranchOption } from '../../promotions/data';

@Component({
  selector: 'app-customer-wallets',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe, RouterModule, NgbModalModule, NgbPaginationModule, NgbTooltipModule],
  templateUrl: './wallets.component.html',
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
export class CustomerWalletsComponent implements OnInit {
  title = 'Customer Wallets Hub';
  config: WalletSystemConfig = MOCK_WALLET_CONFIG;
  wallets: CustomerWalletAccount[] = MOCK_CUSTOMER_WALLETS;
  branches: BranchOption[] = RAINBOW_BRANCH_OPTIONS;

  // Responsive row expand state (mobile child rows)
  expandedWalletIds = new Set<string>();

  toggleWalletExpand(id: string): void {
    if (this.expandedWalletIds.has(id)) {
      this.expandedWalletIds.delete(id);
    } else {
      this.expandedWalletIds.add(id);
    }
  }

  isWalletExpanded(id: string): boolean {
    return this.expandedWalletIds.has(id);
  }

  // Filter state
  searchTerm: string = '';
  selectedBranch: string = 'all';
  selectedStatus: string = 'all';
  selectedBalanceRange: string = 'all';

  // Pagination
  currentPage: number = 1;
  pageSize: number = 6;

  // Modal State
  selectedWallet: CustomerWalletAccount | null = null;
  adjustType: 'Credit' | 'Debit' = 'Credit';
  adjustAmount: number = 500;
  adjustReason: string = 'Customer Goodwill Refund';
  adjustChannel: 'Customer Care' | 'POS Counter' | 'App Online' = 'Customer Care';
  adjustReference: string = '';

  // Bulk Bonus State
  bulkTarget: string = 'VIP Customers';
  bulkAmount: number = 300;
  bulkCampaignName: string = 'Weekend Super Saver Special';

  // Notification Toast
  actionFeedback: string | null = null;

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {}

  get counts() {
    return {
      all: this.wallets.length,
      active: this.wallets.filter(w => w.walletStatus === 'Active').length,
      frozen: this.wallets.filter(w => w.walletStatus === 'Frozen').length,
      totalFloat: this.wallets.reduce((sum, w) => sum + w.currentBalance, 0),
      totalTopups: this.wallets.reduce((sum, w) => sum + w.lifetimeTopups, 0),
      totalSpend: this.wallets.reduce((sum, w) => sum + w.lifetimeSpend, 0),
      totalCashback: this.wallets.reduce((sum, w) => sum + w.totalCashbackReceived, 0),
    };
  }

  setStatusTab(status: string) {
    this.selectedStatus = status;
    this.currentPage = 1;
  }

  resetFilters() {
    this.searchTerm = '';
    this.selectedBranch = 'all';
    this.selectedStatus = 'all';
    this.selectedBalanceRange = 'all';
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
    return this.filteredWallets.length === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }

  get currentEndIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredWallets.length);
  }

  get totalCirculationFloat(): number {
    return this.wallets.reduce((sum, w) => sum + w.currentBalance, 0);
  }

  get filteredWallets(): CustomerWalletAccount[] {
    return this.wallets.filter(w => {
      // Branch filter
      if (this.selectedBranch !== 'all' && !w.preferredBranch.includes(this.selectedBranch)) {
        return false;
      }
      // Status filter
      if (this.selectedStatus !== 'all' && w.walletStatus !== this.selectedStatus) {
        return false;
      }
      // Balance range
      if (this.selectedBalanceRange === 'positive' && w.currentBalance <= 0) return false;
      if (this.selectedBalanceRange === 'zero' && w.currentBalance !== 0) return false;
      if (this.selectedBalanceRange === 'high' && w.currentBalance < 3000) return false;

      // Search term
      if (this.searchTerm.trim()) {
        const q = this.searchTerm.toLowerCase();
        const matchesName = w.customerName.toLowerCase().includes(q);
        const matchesEmail = w.email.toLowerCase().includes(q);
        if (!matchesName && !matchesEmail) {
          return false;
        }
      }
      return true;
    });
  }

  get paginatedWallets(): CustomerWalletAccount[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredWallets.slice(start, start + this.pageSize);
  }

  saveConfig() {
    void showSaveSuccess('Rainbow Wallet policies and balance limits saved successfully.');
  }

  toggleWalletFreeze(wallet: CustomerWalletAccount) {
    wallet.walletStatus = wallet.walletStatus === 'Active' ? 'Frozen' : 'Active';
    this.showNotification(`Wallet for ${wallet.customerName} has been ${wallet.walletStatus === 'Frozen' ? 'Frozen (Disabled from checkout)' : 'Unfrozen (Restored to Active)'}.`);
  }

  openAdjustModal(wallet: CustomerWalletAccount, content: any) {
    this.selectedWallet = wallet;
    this.adjustType = 'Credit';
    this.adjustAmount = 500;
    this.adjustReason = 'Customer Care Goodwill Refund';
    this.adjustChannel = 'Customer Care';
    this.adjustReference = `REF-${Date.now().toString().slice(-4)}`;
    this.modalService.open(content, { size: 'md', centered: true });
  }

  openStatementModal(wallet: CustomerWalletAccount, content: any) {
    this.selectedWallet = wallet;
    this.modalService.open(content, { size: 'lg', centered: true });
  }

  openBulkModal(content: any) {
    this.bulkTarget = 'VIP Customers';
    this.bulkAmount = 300;
    this.bulkCampaignName = 'Special Weekend Bonus Cashback';
    this.modalService.open(content, { size: 'md', centered: true });
  }

  applyBalanceAdjustment(modal: any) {
    if (!this.selectedWallet) return;
    const amt = Number(this.adjustAmount) || 0;
    if (amt <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    if (this.adjustType === 'Credit') {
      if (this.selectedWallet.currentBalance + amt > this.config.maxWalletBalanceLimit) {
        alert(`Cannot exceed maximum wallet balance limit of Rs. ${this.config.maxWalletBalanceLimit}.`);
        return;
      }
      this.selectedWallet.currentBalance += amt;
      this.selectedWallet.lifetimeTopups += amt;
    } else {
      if (amt > this.selectedWallet.currentBalance) {
        alert('Cannot debit more than the current wallet balance.');
        return;
      }
      this.selectedWallet.currentBalance -= amt;
      this.selectedWallet.lifetimeSpend += amt;
    }

    const now = new Date();
    this.selectedWallet.lastTransactionDate = now.toISOString().slice(0, 10);
    this.selectedWallet.transactions.unshift({
      id: `WT-${Date.now().toString().slice(-4)}`,
      date: now.toISOString().slice(0, 10),
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'Admin Adjustment',
      isCredit: this.adjustType === 'Credit',
      amount: amt,
      balanceAfter: this.selectedWallet.currentBalance,
      reference: this.adjustReference || this.adjustReason,
      channel: this.adjustChannel,
      branch: this.selectedWallet.preferredBranch.split('-')[1] || this.selectedWallet.preferredBranch,
    });

    this.showNotification(`Rainbow Wallet for ${this.selectedWallet.customerName} ${this.adjustType === 'Credit' ? 'credited' : 'debited'} with Rs. ${amt}. New Balance: Rs. ${this.selectedWallet.currentBalance}.`);
    modal.close();
  }

  applyBulkCashback(modal: any) {
    const amt = Number(this.bulkAmount) || 0;
    if (amt <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    let affectedCount = 0;
    const now = new Date();

    this.wallets.forEach(w => {
      let eligible = false;
      if (this.bulkTarget === 'VIP Customers' && w.isVip) eligible = true;
      if (this.bulkTarget === 'All Customers') eligible = true;
      if (this.bulkTarget.includes('Valencia') && w.preferredBranch.includes('Valencia')) eligible = true;
      if (this.bulkTarget.includes('Clifton') && w.preferredBranch.includes('Clifton')) eligible = true;

      if (eligible && w.walletStatus === 'Active') {
        w.currentBalance += amt;
        w.totalCashbackReceived += amt;
        w.lastTransactionDate = now.toISOString().slice(0, 10);
        w.transactions.unshift({
          id: `WT-B${Date.now().toString().slice(-3)}${affectedCount}`,
          date: now.toISOString().slice(0, 10),
          time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'Cashback Bonus',
          isCredit: true,
          amount: amt,
          balanceAfter: w.currentBalance,
          reference: this.bulkCampaignName,
          channel: 'Automated System',
          branch: w.preferredBranch,
        });
        affectedCount++;
      }
    });

    this.showNotification(`Successfully distributed Rs. ${amt} promotional cashback to ${affectedCount} customer wallet(s).`);
    modal.close();
  }

  showNotification(msg: string) {
    this.actionFeedback = msg;
    setTimeout(() => {
      this.actionFeedback = null;
    }, 4500);
  }
}

export { CustomerWalletsComponent as CustomerWallets, CustomerWalletsComponent as WalletsComponent };
