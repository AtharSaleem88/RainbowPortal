import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule, NgbModal, NgbModalModule, NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { RAINBOW_ORDERS, RainbowOrder, RainbowOrderItem } from '../data';
import { RAINBOW_STAFF_MEMBERS, BranchStaff } from '../../roles/role-list/data';
import { AuthenticationService } from '@core/services/auth.service';

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe, RouterModule, NgbDropdownModule, NgbPaginationModule, NgbModalModule, NgbTooltipModule],
  templateUrl: './orders-list.component.html',
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

    .order-details-body {
      line-height: 1.5;

      .badge {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 4px 7px;
        line-height: 1.3;
      }

      .btn { white-space: nowrap; }
    }

    .order-items-table {
      min-width: 640px;

      td { padding-top: 14px; padding-bottom: 14px; }
      td:not(:first-child) { white-space: nowrap; }
    }

    .order-totals {
      width: 300px;
      max-width: 100%;
      > div { gap: 20px; }
    }

    .order-details-footer {
      justify-content: space-between !important;
      .btn { white-space: nowrap; }
    }

    @media (max-width: 991.98px) {
      .order-rider-row { grid-template-columns: minmax(0, 1fr) !important; }
    }

    .rider-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-height: 380px;
      overflow-y: auto;
    }

    .rider-card { flex-shrink: 0; }

    .rider-row {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: center;
      gap: 16px;
    }

    .rider-info {
      min-width: 0;
      > div:last-child { min-width: 0; }
      h6 { line-height: 1.5; }
    }

    .rider-dispatch { white-space: nowrap; }

    .rider-search {
      flex: 1 1 240px;
      min-width: 220px;
      max-width: 300px;
    }

    @media (max-width: 575.98px) {
      .rider-row { grid-template-columns: minmax(0, 1fr); }
      .rider-dispatch { width: 100%; }
      .rider-search { max-width: none; min-width: 0; }
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
export class OrdersListComponent implements OnInit {
  title = 'Customer Orders & Dispatch Console';
  orders: RainbowOrder[] = RAINBOW_ORDERS;

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

  authService = inject(AuthenticationService);
  currentUser = this.authService.user;

  // Filter Dropdown States
  selectedBranch: string = 'all';
  selectedStatus: string = 'all';
  selectedPaymentType: string = 'all';
  selectedDeviceType: string = 'all';
  selectedDatePreset: string = 'today';
  searchTerm: string = '';

  // Pagination
  pageSize: number = 10;
  currentPage: number = 1;

  // Active Selected Order for View Modal
  selectedOrder: RainbowOrder | null = null;
  copyFeedback: boolean = false;

  // Rider Assignment State
  targetOrderForAssignment: RainbowOrder | null = null;
  riderSearchTerm: string = '';
  riderFilterTab: 'available' | 'all' = 'available';
  assignmentToast: string | null = null;
  activeAssignModalRef: any = null;

  branches: { id: string; name: string }[] = [
    { id: 'all', name: 'Consolidated (All Branches)' },
    { id: 'VAL-01', name: 'Rainbow Cash & Carry - Valencia' },
    { id: 'SKP-01', name: 'Rainbow Cash & Carry - Sheikhupura' },
    { id: 'CNR-01', name: 'Rainbow Cash & Carry - Canal Road' },
    { id: 'CLF-01', name: 'Rainbow Superstore - Clifton' },
    { id: 'GSH-01', name: 'Rainbow Superstore - Gulshan' },
    { id: 'NNZ-01', name: 'Rainbow Superstore - North Nazimabad' },
    { id: 'DHA-06', name: 'Rainbow Superstore - DHA Phase 6' },
    { id: 'BHR-01', name: 'Rainbow Superstore - Bahria Town' },
    { id: 'FBA-01', name: 'Rainbow Superstore - FB Area' },
    { id: 'HYD-01', name: 'Rainbow Superstore - Hyderi' },
  ];

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {
    this.applyRoleBranchScoping(this.authService.user);

    this.authService.currentUser$.subscribe((user: any) => {
      this.currentUser = user;
      this.applyRoleBranchScoping(user);
    });
  }

  applyRoleBranchScoping(user: any) {
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
    return found ? found.name : 'Consolidated (All Branches)';
  }

  get statusCounts() {
    const baseOrders = this.isBranchLocked
      ? this.orders.filter(o => o.branchCode === this.selectedBranch || o.branch.includes(this.selectedBranch))
      : this.orders;

    return {
      all: baseOrders.length,
      pending: baseOrders.filter(o => o.status === 'Pending').length,
      accepted: baseOrders.filter(o => o.status === 'Accepted').length,
      dispatch: baseOrders.filter(o => o.status === 'Dispatch').length,
      delivered: baseOrders.filter(o => o.status === 'Delivered').length,
      rejected: baseOrders.filter(o => o.status === 'Rejected').length,
    };
  }

  get currentStartIndex(): number {
    return this.filteredOrders.length === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }

  get currentEndIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredOrders.length);
  }

  onPageSizeChange(newSize: any) {
    this.pageSize = Number(newSize);
    this.currentPage = 1;
  }

  onSearchChange() {
    this.currentPage = 1;
  }

  clearSearch() {
    this.searchTerm = '';
    this.currentPage = 1;
  }

  get filteredOrders(): RainbowOrder[] {
    return this.orders.filter(o => {
      // Branch filter
      if (this.selectedBranch !== 'all' && o.branchCode !== this.selectedBranch && !o.branch.includes(this.selectedBranch)) {
        return false;
      }
      // Status filter
      if (this.selectedStatus !== 'all' && o.status !== this.selectedStatus) {
        return false;
      }
      // Payment Type filter
      if (this.selectedPaymentType !== 'all' && o.paymentType !== this.selectedPaymentType) {
        return false;
      }
      // Device Type filter
      if (this.selectedDeviceType !== 'all' && !o.deviceType.toLowerCase().includes(this.selectedDeviceType.toLowerCase())) {
        return false;
      }
      // Search term
      if (this.searchTerm.trim()) {
        const query = this.searchTerm.toLowerCase();
        const matchesId = o.id.toLowerCase().includes(query);
        const matchesCode = o.uniqueCode.toLowerCase().includes(query);
        const matchesName = o.customer.name.toLowerCase().includes(query);
        const matchesPhone = o.customer.phone.toLowerCase().includes(query);
        const matchesAddress = o.customer.deliveryAddress.toLowerCase().includes(query);
        const matchesBranch = o.branch.toLowerCase().includes(query);
        const matchesRider = o.assignedRider?.name.toLowerCase().includes(query) || o.assignedRider?.vehicleRegNo.toLowerCase().includes(query);
        if (!matchesId && !matchesCode && !matchesName && !matchesPhone && !matchesAddress && !matchesBranch && !matchesRider) {
          return false;
        }
      }
      return true;
    });
  }

  get paginatedOrders(): RainbowOrder[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredOrders.slice(start, start + this.pageSize);
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
    this.selectedPaymentType = 'all';
    this.selectedDeviceType = 'all';
    this.selectedDatePreset = 'today';
    this.searchTerm = '';
    this.currentPage = 1;
  }

  openOrderModal(order: RainbowOrder, content: any) {
    this.selectedOrder = order;
    this.copyFeedback = false;
    this.modalService.open(content, { size: 'xl', centered: true, scrollable: true });
  }

  updateStatus(order: RainbowOrder, newStatus: any) {
    order.status = newStatus;
  }

  togglePaymentType(order: RainbowOrder) {
    order.paymentType = order.paymentType === 'COD' ? 'CAOD' : 'COD';
    order.paymentChannel = order.paymentType === 'COD' ? 'Cash on Delivery' : 'Card on Delivery';
  }

  copyOrderData(order: RainbowOrder) {
    const itemsSummary = order.items.map((it, idx) => `${idx + 1}. ${it.name} x${it.orderedQty} (Rs. ${it.totalPrice})`).join('\n');
    const riderText = order.assignedRider 
      ? `\nAssigned Rider: ${order.assignedRider.name} (${order.assignedRider.vehicleRegNo}) - ${order.assignedRider.phone}`
      : '\nAssigned Rider: Not Assigned';

    const textToCopy = `=== RAINBOW CASH & CARRY ORDER ===\nOrder ID: #${order.id} (${order.uniqueCode})\nCustomer: ${order.customer.name}\nPhone: ${order.customer.phone}\nAddress: ${order.customer.deliveryAddress}\nBranch: ${order.branch}\nStatus: ${order.status}${riderText}\nPayment: ${order.paymentType} (${order.paymentChannel})\n\nITEMS:\n${itemsSummary}\n\nTotal Amount: Rs. ${order.totalAmount}`;

    navigator.clipboard.writeText(textToCopy).then(() => {
      this.copyFeedback = true;
      setTimeout(() => this.copyFeedback = false, 2500);
    });
  }

  exportToExcel() {
    const rows = [
      ['Order ID', 'Daily #', 'Unique Code', 'Date Time', 'Customer', 'Phone', 'Address', 'Branch', 'Assigned Rider', 'Payment Type', 'Device', 'Status', 'Amount']
    ];
    this.filteredOrders.forEach(o => {
      rows.push([
        o.id,
        o.dailyOrderNo.toString(),
        o.uniqueCode,
        `${o.date} ${o.time}`,
        o.customer.name,
        o.customer.phone,
        `"${o.customer.deliveryAddress.replace(/"/g, '""')}"`,
        `"${o.branch.replace(/"/g, '""')}"`,
        o.assignedRider ? `"${o.assignedRider.name} (${o.assignedRider.vehicleRegNo})"` : 'Unassigned',
        o.paymentType,
        o.deviceType,
        o.status,
        o.totalAmount.toString()
      ]);
    });
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rainbow_Orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Pending': return 'bg-warning-subtle text-warning-emphasis';
      case 'Accepted': return 'bg-primary-subtle text-primary';
      case 'Dispatch': return 'bg-info-subtle text-info';
      case 'Delivered': return 'bg-success-subtle text-success';
      case 'Rejected': return 'bg-danger-subtle text-danger';
      default: return 'bg-secondary-subtle text-secondary';
    }
  }

  // =========================================================================
  // RIDER ASSIGNMENT FEATURES
  // =========================================================================

  openAssignRiderModal(order: RainbowOrder, modalContent: any) {
    this.targetOrderForAssignment = order;
    this.riderSearchTerm = '';
    this.riderFilterTab = 'available';
    this.activeAssignModalRef = this.modalService.open(modalContent, {
      size: 'lg',
      centered: true,
      backdrop: 'static',
    });
  }

  getBranchRiders(order: RainbowOrder | null): BranchStaff[] {
    if (!order) return [];
    const bCode = order.branchCode || 'VAL-01';
    return RAINBOW_STAFF_MEMBERS.filter(s =>
      s.role === 'Rider' && (s.branchCode === bCode || s.branchId === bCode || order.branch.includes(s.branchName))
    );
  }

  getFilteredBranchRiders(order: RainbowOrder | null): BranchStaff[] {
    const allRiders = this.getBranchRiders(order);
    return allRiders.filter(r => {
      // Online/Available filter
      if (this.riderFilterTab === 'available' && r.status !== 'Active') {
        return false;
      }
      // Search filter
      if (this.riderSearchTerm.trim()) {
        const q = this.riderSearchTerm.toLowerCase();
        const matchesName = r.name.toLowerCase().includes(q);
        const matchesId = r.id.toLowerCase().includes(q);
        const matchesPhone = r.phone.toLowerCase().includes(q);
        const matchesReg = r.riderDetails?.vehicleRegNo.toLowerCase().includes(q) || false;
        if (!matchesName && !matchesId && !matchesPhone && !matchesReg) {
          return false;
        }
      }
      return true;
    });
  }

  getRiderCounts(order: RainbowOrder | null) {
    const all = this.getBranchRiders(order);
    return {
      all: all.length,
      available: all.filter(r => r.status === 'Active').length,
      onDelivery: all.filter(r => r.status === 'On Delivery').length,
      offDuty: all.filter(r => r.status === 'Off Duty').length,
    };
  }

  assignRider(order: RainbowOrder, rider: BranchStaff, modal?: any) {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const nowDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });

    order.assignedRider = {
      id: rider.id,
      name: rider.name,
      phone: rider.phone,
      avatar: rider.avatar,
      vehicleType: rider.riderDetails?.vehicleType || 'Motorbike',
      vehicleRegNo: rider.riderDetails?.vehicleRegNo || 'REG-PENDING',
      rating: rider.riderDetails?.rating || 4.9,
      assignedAt: `${nowDate} ${nowTime}`,
      deliveryStatus: 'Assigned',
    };

    order.status = 'Dispatch';
    order.deliveryBy = 'Rainbow Fleet';

    rider.status = 'On Delivery';
    if (rider.riderDetails) {
      rider.riderDetails.currentOrderId = order.id;
    }

    if (modal) {
      modal.close();
    } else if (this.activeAssignModalRef) {
      this.activeAssignModalRef.close();
    }

    this.assignmentToast = `Rider ${rider.name} successfully assigned to Order #${order.id}. Order marked as Dispatch!`;
    setTimeout(() => {
      this.assignmentToast = null;
    }, 4500);
  }

  unassignRider(order: RainbowOrder) {
    if (order.assignedRider) {
      const riderStaff = RAINBOW_STAFF_MEMBERS.find(s => s.id === order.assignedRider?.id);
      if (riderStaff) {
        riderStaff.status = 'Active';
        if (riderStaff.riderDetails) {
          riderStaff.riderDetails.currentOrderId = undefined;
        }
      }
      order.assignedRider = undefined;
      order.status = 'Accepted';
      this.assignmentToast = `Rider unassigned from Order #${order.id}. Status restored to Accepted.`;
      setTimeout(() => {
        this.assignmentToast = null;
      }, 4000);
    }
  }

  getWhatsAppRiderDispatchUrl(order: RainbowOrder): string {
    if (!order.assignedRider) return '';
    const phone = order.assignedRider.phone.replace(/[^0-9]/g, '');
    const cleanPhone = phone.startsWith('0') ? '92' + phone.substring(1) : phone;
    const msg = `Salam ${order.assignedRider.name},\nNew Order #${order.id} (${order.uniqueCode}) assigned for dispatch from ${order.branch}.\nCustomer: ${order.customer.name} (${order.customer.phone})\nAddress: ${order.customer.deliveryAddress}\nPayment: ${order.paymentType} - Total: Rs ${order.totalAmount}\nPlease deliver ASAP. Safe driving!`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
  }
}

export { OrdersListComponent as OrdersList };
