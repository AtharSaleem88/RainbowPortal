import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbModal, NgbModalModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { RainbowCustomer, RAINBOW_CUSTOMERS_LIST } from './data';
import { RAINBOW_BRANCH_OPTIONS, BranchOption } from '../../promotions/data';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe, NgbDropdownModule, NgbPaginationModule, NgbModalModule],
  templateUrl: './customer-list.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CustomerListComponent implements OnInit {
  title = 'Customer Directory & Wallet Management';
  customers: RainbowCustomer[] = RAINBOW_CUSTOMERS_LIST;
  branches: BranchOption[] = RAINBOW_BRANCH_OPTIONS;

  // Overview Stats (from Screenshot 1)
  stats = {
    totalCustomers: 30278,
    repeatRate: 35.68,
    averageOrderValue: 5279.90,
    retentionRate: 12.68,
  };

  // Smart Segment counts (from Screenshot 1)
  segmentCounts = {
    newCustomers: 1683,
    vipCustomers: 0,
    repeatBuyers: 10804,
    zeroOrders: 10123,
    dormantCustomers: 15160,
    frequentBuyers: 5103,
    cartAbandoners: 349,
    oneTimeBuyers: 9351,
  };

  // Filters
  selectedSegment: string = 'all';
  selectedBranch: string = 'all';
  selectedCity: string = 'all';
  searchTerm: string = '';

  // Pagination
  pageSize: number = 8;
  currentPage: number = 1;

  onPageSizeChange(newSize: any) {
    this.pageSize = Number(newSize);
    this.currentPage = 1;
  }

  // Expanded row state
  expandedRowMap: { [customerId: string]: boolean } = {};

  // Active Customer for Profile / Wallet Modal
  selectedCustomer: RainbowCustomer | null = null;
  walletAdjustAmount: number = 500;
  walletAdjustType: 'Credit' | 'Debit' = 'Credit';
  walletAdjustReason: string = 'Promotional Reward';
  actionFeedback: string | null = null;

  constructor(private modalService: NgbModal) {
    this.updateVipCount();
  }

  ngOnInit(): void {}

  updateVipCount() {
    this.segmentCounts.vipCustomers = this.customers.filter(c => c.isVip).length;
  }

  get filteredCustomers(): RainbowCustomer[] {
    return this.customers.filter(c => {
      // Smart Segment filter
      if (this.selectedSegment !== 'all') {
        if (this.selectedSegment === 'VIP Customers' && !c.isVip) return false;
        if (this.selectedSegment === 'Repeat Buyers' && c.totalOrders <= 1) return false;
        if (this.selectedSegment === 'Frequent Buyers' && c.totalOrders < 5) return false;
        if (this.selectedSegment === 'Zero Orders' && c.totalOrders !== 0) return false;
        if (this.selectedSegment === 'One-time Buyers' && c.totalOrders !== 1) return false;
        if (this.selectedSegment === 'New Customers' && c.segment !== 'New Customers') return false;
      }

      // Branch filter
      if (this.selectedBranch !== 'all' && !c.preferredBranch.includes(this.selectedBranch)) {
        return false;
      }

      // City filter
      if (this.selectedCity !== 'all' && c.city !== this.selectedCity) {
        return false;
      }

      // Search term
      if (this.searchTerm.trim()) {
        const q = this.searchTerm.toLowerCase();
        const matchesName = c.name.toLowerCase().includes(q);
        const matchesPhone = c.phone.toLowerCase().includes(q);
        const matchesEmail = c.email.toLowerCase().includes(q);
        const matchesCode = c.customerCode ? c.customerCode.toLowerCase().includes(q) : false;
        const matchesBranch = c.preferredBranch.toLowerCase().includes(q);
        if (!matchesName && !matchesPhone && !matchesEmail && !matchesCode && !matchesBranch) {
          return false;
        }
      }
      return true;
    });
  }

  get paginatedCustomers(): RainbowCustomer[] {
    const total = this.filteredCustomers.length;
    const maxPage = Math.max(1, Math.ceil(total / this.pageSize));
    if (this.currentPage > maxPage) {
      this.currentPage = 1;
    }
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredCustomers.slice(start, start + this.pageSize);
  }

  exportCustomersCSV() {
    const headers = ['Customer Code', 'Name', 'Phone', 'Email', 'City', 'Preferred Branch', 'Orders', 'Total Spent (PKR)', 'Wallet Balance (PKR)', 'Loyalty Points', 'Segment', 'Is VIP', 'Is Blacklisted'];
    const rows = this.filteredCustomers.map(c => [
      c.customerCode || 'N/A',
      `"${c.name}"`,
      c.phone,
      c.email,
      c.city,
      `"${c.preferredBranch}"`,
      c.totalOrders,
      c.totalSpent,
      c.walletBalance,
      c.loyaltyPoints,
      c.segment,
      c.isVip ? 'Yes' : 'No',
      c.isBlacklisted ? 'Yes' : 'No',
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rainbow_customers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.showNotification('Customer Directory CSV exported successfully!');
  }

  setSegmentFilter(segment: string) {
    if (this.selectedSegment === segment) {
      this.selectedSegment = 'all'; // toggle off
    } else {
      this.selectedSegment = segment;
    }
    this.currentPage = 1;
  }

  resetFilters() {
    this.selectedSegment = 'all';
    this.selectedBranch = 'all';
    this.selectedCity = 'all';
    this.searchTerm = '';
    this.currentPage = 1;
  }

  toggleRowExpansion(customerId: string) {
    this.expandedRowMap[customerId] = !this.expandedRowMap[customerId];
  }

  toggleVip(c: RainbowCustomer, event?: Event) {
    if (event) event.stopPropagation();
    c.isVip = !c.isVip;
    this.updateVipCount();
    this.showNotification(`${c.name} has been ${c.isVip ? 'marked as VIP' : 'removed from VIP'}.`);
  }

  toggleBlacklist(c: RainbowCustomer) {
    this.showNotification(`${c.name} has been ${c.isBlacklisted ? 'Blacklisted from ordering' : 'restored to Active'}.`);
  }

  openWhatsApp(phone: string, customerName: string) {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(`Hello ${customerName}, Greetings from Rainbow Cash & Carry! How may we assist you today?`);
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  }

  openProfileModal(c: RainbowCustomer, content: any) {
    this.selectedCustomer = c;
    this.modalService.open(content, { size: 'lg', centered: true });
  }

  openWalletModal(c: RainbowCustomer, content: any, event?: Event) {
    if (event) event.stopPropagation();
    this.selectedCustomer = c;
    this.walletAdjustAmount = 500;
    this.walletAdjustType = 'Credit';
    this.walletAdjustReason = 'Customer Care Goodwill Refund';
    this.modalService.open(content, { size: 'md', centered: true });
  }

  applyWalletAdjustment(modalRef: any) {
    if (!this.selectedCustomer) return;
    const amount = Number(this.walletAdjustAmount) || 0;
    if (amount <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    if (this.walletAdjustType === 'Credit') {
      this.selectedCustomer.walletBalance += amount;
    } else {
      if (amount > this.selectedCustomer.walletBalance) {
        alert('Cannot debit more than current wallet balance.');
        return;
      }
      this.selectedCustomer.walletBalance -= amount;
    }

    if (!this.selectedCustomer.walletHistory) {
      this.selectedCustomer.walletHistory = [];
    }

    this.selectedCustomer.walletHistory.unshift({
      id: `WT-${Date.now().toString().slice(-4)}`,
      date: new Date().toLocaleDateString(),
      type: this.walletAdjustType,
      amount: amount,
      reason: this.walletAdjustReason || 'Manual adjustment by admin',
      balanceAfter: this.selectedCustomer.walletBalance,
    });

    this.showNotification(`Wallet of ${this.selectedCustomer.name} ${this.walletAdjustType === 'Credit' ? 'credited' : 'debited'} with Rs. ${amount}. New balance: Rs. ${this.selectedCustomer.walletBalance}`);
    modalRef.close();
  }

  showNotification(msg: string) {
    this.actionFeedback = msg;
    setTimeout(() => {
      this.actionFeedback = null;
    }, 4500);
  }
}

export { CustomerListComponent as CustomerList };
