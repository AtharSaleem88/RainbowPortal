import { showSaveSuccess } from '@shared/utils/save-alert';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModal, NgbModalModule, NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import {
  LoyaltyProgramConfig,
  CustomerLoyaltyRecord,
  MOCK_LOYALTY_CONFIG,
  MOCK_CUSTOMER_LOYALTY_RECORDS,
} from '../data';
import { RAINBOW_BRANCH_OPTIONS, BranchOption } from '../../promotions/data';

@Component({
  selector: 'app-loyalty-points',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe, RouterModule, NgbModalModule, NgbPaginationModule, NgbTooltipModule],
  templateUrl: './loyalty-points.component.html',
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

    /* Prominent Range Slider */
    .range-slider-wrapper {
      padding: 6px 0;
    }
    .custom-prominent-range {
      -webkit-appearance: none;
      appearance: none;
      width: 100%;
      height: 8px;
      border-radius: 6px;
      background: #cbd5e1;
      outline: none;
      cursor: pointer;
      display: block;
      transition: background 0.2s ease;
      margin: 0;

      &:hover {
        background: #94a3b8;
      }

      &::-webkit-slider-runnable-track {
        height: 8px;
        border-radius: 6px;
        background: #cbd5e1;
      }

      &::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: #2e3192;
        border: 3px solid #ffffff;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.35);
        cursor: grab;
        margin-top: -7px;
        transition: transform 0.15s ease, box-shadow 0.15s ease;

        &:active {
          cursor: grabbing;
          transform: scale(1.15);
        }
      }

      &:focus::-webkit-slider-thumb {
        box-shadow: 0 0 0 4px rgba(46, 49, 146, 0.25), 0 1px 4px rgba(0, 0, 0, 0.35);
      }

      &::-moz-range-track {
        height: 8px;
        border-radius: 6px;
        background: #cbd5e1;
      }

      &::-moz-range-thumb {
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: #2e3192;
        border: 3px solid #ffffff;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.35);
        cursor: grab;
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
export class LoyaltyPointsComponent implements OnInit {
  title = 'Customer Loyalty Points Hub';
  config: LoyaltyProgramConfig = MOCK_LOYALTY_CONFIG;
  customers: CustomerLoyaltyRecord[] = MOCK_CUSTOMER_LOYALTY_RECORDS;
  branches: BranchOption[] = RAINBOW_BRANCH_OPTIONS;

  // Responsive row expand state (mobile child rows)
  expandedCustIds = new Set<string>();

  toggleCustExpand(id: string): void {
    if (this.expandedCustIds.has(id)) {
      this.expandedCustIds.delete(id);
    } else {
      this.expandedCustIds.add(id);
    }
  }

  isCustExpanded(id: string): boolean {
    return this.expandedCustIds.has(id);
  }

  // Filter State
  searchTerm: string = '';
  selectedTier: string = 'all';
  selectedBranch: string = 'all';

  // Pagination
  currentPage: number = 1;
  pageSize: number = 6;

  // Interactive Customer Redemption Simulator
  simCartTotal: number = 4500;
  simCustomerPoints: number = 850;
  simPointsToRedeem: number = 400;

  // Manual Points Adjustment Modal State
  selectedCustomer: CustomerLoyaltyRecord | null = null;
  adjustAction: 'Award' | 'Deduct' = 'Award';
  adjustPointsCount: number = 100;
  adjustReason: string = 'Special Store Visit Goodwill Reward';

  // Feedback Notification
  actionFeedback: string | null = null;

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {}

  get counts() {
    return {
      all: this.customers.length,
      gold: this.customers.filter(c => c.tier === 'Gold VIP Member').length,
      silver: this.customers.filter(c => c.tier === 'Silver Preferred').length,
      bronze: this.customers.filter(c => c.tier === 'Bronze Member').length,
      totalPointsInCirculation: this.customers.reduce((acc, c) => acc + (c.currentPoints || 0), 0),
      totalRedeemedPoints: this.customers.reduce((acc, c) => acc + (c.totalPointsRedeemed || 0), 0),
    };
  }

  setTierTab(tier: string) {
    this.selectedTier = tier;
    this.currentPage = 1;
  }

  resetFilters() {
    this.searchTerm = '';
    this.selectedTier = 'all';
    this.selectedBranch = 'all';
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
    return this.filteredCustomers.length === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }

  get currentEndIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredCustomers.length);
  }

  // Simulator Calculations
  get maxRedeemablePoints(): number {
    const maxByBill = Math.floor((this.simCartTotal * (this.config.maxOrderRedemptionPercentage / 100)) / this.config.redeemValueInPkr);
    return Math.min(this.simCustomerPoints, maxByBill);
  }

  get simDiscountAmount(): number {
    return Math.min(this.simPointsToRedeem, this.maxRedeemablePoints) * this.config.redeemValueInPkr;
  }

  get simFinalPayable(): number {
    return Math.max(0, this.simCartTotal - this.simDiscountAmount);
  }

  get simPointsEarnedOnOrder(): number {
    return Math.floor(this.simFinalPayable / this.config.earnPointsPerSpend);
  }

  get filteredCustomers(): CustomerLoyaltyRecord[] {
    return this.customers.filter(c => {
      if (this.selectedTier !== 'all' && c.tier !== this.selectedTier) return false;
      if (this.selectedBranch !== 'all' && !c.preferredBranch.includes(this.selectedBranch)) return false;
      if (this.searchTerm.trim()) {
        const q = this.searchTerm.toLowerCase();
        const matchesName = c.customerName.toLowerCase().includes(q);
        const matchesEmail = c.email ? c.email.toLowerCase().includes(q) : false;
        if (!matchesName && !matchesEmail) return false;
      }
      return true;
    });
  }

  get paginatedCustomers(): CustomerLoyaltyRecord[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredCustomers.slice(start, start + this.pageSize);
  }

  saveRules() {
    void showSaveSuccess('Loyalty Points Earning & Redemption rules saved successfully.');
  }

  toggleProgramStatus() {
    this.config.isEnabled = !this.config.isEnabled;
    this.showNotification(`Loyalty Program is now ${this.config.isEnabled ? 'Active' : 'Paused'}.`);
  }

  toggleBranchMultiplier(bm: any) {
    bm.isActive = !bm.isActive;
    this.showNotification(`${bm.branchName} multiplier updated to ${bm.isActive ? 'Active' : 'Inactive'}.`);
  }

  openAdjustPointsModal(cust: CustomerLoyaltyRecord, content: any) {
    this.selectedCustomer = cust;
    this.adjustAction = 'Award';
    this.adjustPointsCount = 100;
    this.adjustReason = 'Supermarket Promotion Bonus';
    this.modalService.open(content, { size: 'md', centered: true });
  }

  openHistoryModal(cust: CustomerLoyaltyRecord, content: any) {
    this.selectedCustomer = cust;
    this.modalService.open(content, { size: 'lg', centered: true });
  }

  applyPointsAdjustment(modal: any) {
    if (!this.selectedCustomer) return;
    const pts = Number(this.adjustPointsCount) || 0;
    if (pts <= 0) {
      alert('Please enter a valid points count.');
      return;
    }

    if (this.adjustAction === 'Award') {
      this.selectedCustomer.currentPoints += pts;
      this.selectedCustomer.totalPointsEarned += pts;
    } else {
      if (pts > this.selectedCustomer.currentPoints) {
        alert('Cannot deduct more points than customer balance.');
        return;
      }
      this.selectedCustomer.currentPoints -= pts;
      this.selectedCustomer.totalPointsRedeemed += pts;
    }

    this.selectedCustomer.pointsValueInPkr = this.selectedCustomer.currentPoints * this.config.redeemValueInPkr;

    this.selectedCustomer.history.unshift({
      id: `LP-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().slice(0, 10),
      type: this.adjustAction === 'Award' ? 'Admin Bonus' : 'Redeemed',
      points: this.adjustAction === 'Award' ? pts : -pts,
      amountPkr: pts * this.config.redeemValueInPkr,
      description: this.adjustReason || 'Manual Admin Points Adjustment',
      branch: 'Head Office',
    });

    this.showNotification(`${pts} Points ${this.adjustAction === 'Award' ? 'awarded to' : 'deducted from'} ${this.selectedCustomer.customerName}. New balance: ${this.selectedCustomer.currentPoints} pts (Rs. ${this.selectedCustomer.pointsValueInPkr}).`);
    modal.close();
  }

  showNotification(msg: string) {
    this.actionFeedback = msg;
    setTimeout(() => {
      this.actionFeedback = null;
    }, 4500);
  }
}

export { LoyaltyPointsComponent as LoyaltyPoints };
