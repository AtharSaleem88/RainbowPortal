import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule, NgbModal, NgbModalModule, NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { RAINBOW_ORDERS, RainbowOrder, RainbowOrderItem, SpecificReplacementChoice } from '../data';
import { RAINBOW_STAFF_MEMBERS, BranchStaff } from '../../roles/role-list/data';
import { ProductList, ProductType } from '../../products/data';
import Swal from 'sweetalert2';
import { AuthenticationService } from '@core/services/auth.service';
import { OrdersWorkflowService } from '@core/services/orders-workflow.service';
import { WorkflowConfigService } from '@core/services/workflow-config.service';
import { TimeLogService, DerivedProductivityMetrics } from '@core/services/time-log.service';
import { AuditService } from '@core/services/audit.service';
import {
  OrderLifecycleStatus,
  PriorityTier,
  OrderException,
  TimeLogRecord
} from '@core/models/workflow.model';

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

    /* Status Badge & Hover Color Protection */
    .status-badge {
      font-weight: 600;
      transition: all 0.15s ease-in-out;
      cursor: default;
      display: inline-block;
      user-select: none;

      /* Never hide or wash out status badge text on hover */
      &:hover {
        opacity: 0.96;
      }

      &.bg-warning-subtle,
      &.bg-warning-subtle:hover {
        background-color: #fef9c3 !important;
        color: #854d0e !important;
        border-color: #fde047 !important;
      }

      &.bg-primary-subtle,
      &.bg-primary-subtle:hover {
        background-color: #e0e7ff !important;
        color: #2e3192 !important;
        border-color: #c7d2fe !important;
      }

      &.bg-info-subtle,
      &.bg-info-subtle:hover {
        background-color: #e0f2fe !important;
        color: #0369a1 !important;
        border-color: #bae6fd !important;
      }

      &.bg-indigo-subtle,
      &.bg-indigo-subtle:hover {
        background-color: #ede9fe !important;
        color: #5b21b6 !important;
        border-color: #ddd6fe !important;
      }

      &.bg-teal-subtle,
      &.bg-teal-subtle:hover {
        background-color: #ccfbf1 !important;
        color: #0f766e !important;
        border-color: #99f6e4 !important;
      }

      &.bg-info,
      &.bg-info:hover {
        background-color: #0284c7 !important;
        color: #ffffff !important;
      }

      &.bg-success,
      &.bg-success:hover {
        background-color: #16a34a !important;
        color: #ffffff !important;
      }

      &.bg-danger,
      &.bg-danger:hover {
        background-color: #dc2626 !important;
        color: #ffffff !important;
      }

      &.bg-secondary-subtle,
      &.bg-secondary-subtle:hover {
        background-color: #f1f5f9 !important;
        color: #475569 !important;
        border-color: #e2e8f0 !important;
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
        gap: 6px;
        padding: 4px 7px;
        line-height: 1.3;
      }

      .btn {
        white-space: nowrap;
        display: inline-flex !important;
        align-items: center !important;
        gap: 8px !important;

        iconify-icon {
          flex-shrink: 0 !important;
        }
      }
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
      .btn {
        white-space: nowrap;
        display: inline-flex !important;
        align-items: center !important;
        gap: 8px !important;

        iconify-icon {
          flex-shrink: 0 !important;
        }
      }
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

    /* Responsive Child Rows (Mobile / Small Screens) */
    .cat-row {
      transition: background-color 0.15s ease;
      cursor: default;
      &:hover {
        background-color: #f8fafc;
      }
    }

    .dtr-control-col {
      width: 36px;
      min-width: 36px;
      padding: 8px 6px !important;
      text-align: center;
      vertical-align: middle;
    }

    .dtr-control-btn {
      background: transparent;
      border: none;
      padding: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      line-height: 1;
      border-radius: 50%;
      transition: transform 0.15s ease;

      iconify-icon {
        font-size: 19px;
        display: block;
      }

      &:hover {
        transform: scale(1.12);
      }

      &:focus {
        outline: none;
      }
    }

    .dtr-child-row {
      background: #ffffff;

      td {
        padding: 0 !important;
        border: none !important;
      }
    }

    .dtr-child-box {
      background: #ffffff;
      border-bottom: 2px solid #e2e8f0;
      box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.02);
    }

    .dtr-child-table {
      width: 100%;
      border-collapse: collapse;

      tr {
        border-bottom: 1px solid #f1f5f9;
        &:last-child {
          border-bottom: none;
        }
      }

      .dtr-child-title {
        width: 30%;
        min-width: 90px;
        padding: 8px 10px !important;
        font-size: 11.5px !important;
        font-weight: 600;
        color: #475569;
        background: #f8fafc;
        border-right: 1px solid #f1f5f9;
        vertical-align: middle;
        white-space: normal !important;
        text-transform: none !important;
        letter-spacing: normal !important;
        line-height: 1.3 !important;
      }

      .dtr-child-data {
        padding: 8px 10px !important;
        font-size: 12px !important;
        color: #1e293b;
        vertical-align: middle;
        background: #ffffff;
        word-break: break-word;
        line-height: 1.4 !important;
      }
    }

    .toolbar-search-group {
      margin-left: auto;
    }

    @media (max-width: 767.98px) {
      .toolbar-search-group {
        width: 100%;
        margin-left: 0 !important;
        display: flex;
        align-items: center;

        .search-box-wrapper {
          flex: 1 1 auto;
          min-width: 0;
          max-width: none;
        }

        .page-select-input {
          width: 85px;
          min-width: 85px;
          padding-left: 6px;
          padding-right: 20px;
          font-size: 11.5px;
        }
      }

      .filter-segmented-control {
        width: 100%;
        display: flex;

        .segment-btn {
          flex: 1;
          justify-content: center;
          padding: 5px 6px;
          font-size: 11.5px;
          gap: 4px;

          .count-pill {
            font-size: 10px;
            padding: 1px 5px;
          }
        }
      }

      .filter-bar-strip {
        padding: 8px 10px;

        .filter-control-wrap {
          width: 100%;
          .filter-dropdown {
            width: 100%;
            min-width: 0 !important;
          }
        }
      }

      .table-clean th {
        font-size: 11px;
        padding: 9px 10px;
      }
      .table-clean td {
        padding: 9px 10px;
        font-size: 12.5px;
      }

      tbody tr.cat-row:nth-of-type(odd) {
        background-color: #fafbfc;
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
  workflowService = inject(OrdersWorkflowService);
  configService = inject(WorkflowConfigService);
  timeLogService = inject(TimeLogService);
  auditService = inject(AuditService);

  // Filter Dropdown States
  selectedBranch: string = 'all';
  selectedStatus: string = 'all';
  selectedPriority: string = 'all'; // 'all' | 'P1' | 'P2' | 'P3' | 'P4' | 'exceptions'
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

  // Priority Override State
  targetOrderForPriority: RainbowOrder | null = null;
  selectedOverrideUrgency: 'Urgent' | 'Standard' | 'Scheduled' = 'Urgent';
  overrideCustomNote: string = '';
  overrideReason: string = '';
  overrideError: string | null = null;
  activePriorityModalRef: any = null;

  // Flagged Exception Review State
  targetOrderForException: RainbowOrder | null = null;
  selectedResolutionAction: string = 'reroute_store';
  exceptionResolutionNote: string = '';
  selectedRerouteBranchCode: string = 'SKP-01';
  activeExceptionModalRef: any = null;

  // Refund & Cancellation Dialog State
  targetOrderForRefund: RainbowOrder | null = null;
  refundAmount: number = 0;
  refundReason: string = '';
  refundActionType: 'Refund' | 'Cancel' = 'Refund';
  refundError: string | null = null;
  activeRefundModalRef: any = null;

  // Dedicated Cancellation with Mandatory Reason
  targetOrderForCancel: RainbowOrder | null = null;
  cancelReasonCategory: string = 'Item out of stock / Customer rejected substitution';
  cancelReasonNotes: string = '';
  cancelNotifyCustomer: boolean = true;
  cancelError: string | null = null;
  activeCancelModalRef: any = null;

  cancellationCategories: string[] = [
    'Item out of stock / Customer rejected substitution',
    'Customer requested cancellation via phone/app',
    'Customer unreachable (Call attempt failed)',
    'Delivery address outside store service radius',
    'Payment authorization / Fraud security hold',
    'Store branch capacity overload (All pickers busy)',
    'Operational delay / No delivery rider available',
    'Other operational reason'
  ];

  // Moderator Order Items & Substitutions Edit State
  selectedOrderForEdit: RainbowOrder | null = null;
  editableItems: RainbowOrderItem[] = [];
  editOrderNotes: string = '';
  activeEditModalRef: any = null;
  customSubName: { [key: number]: string } = {};
  customSubPrice: { [key: number]: number } = {};

  // Suggested substitutes dictionary for retail items
  suggestedSubstitutes: { [key: string]: SpecificReplacementChoice[] } = {
    'oil': [
      { name: 'Sufi Banaspati & Cooking Oil (5 Litre Tin)', price: 2750, sku: 'SUF-OIL-5L', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=120&auto=format&fit=crop&q=80' },
      { name: 'Mezan Canola Cooking Oil (5 Litre Tin)', price: 2820, sku: 'MZN-OIL-5L', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&auto=format&fit=crop&q=80' },
      { name: 'Habib Cooking Oil (5 Litre Tin)', price: 2890, sku: 'HBB-OIL-5L', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=120&auto=format&fit=crop&q=80' }
    ],
    'chicken': [
      { name: 'Dawn Chicken Shashlik Skewers (500g)', price: 1020, sku: 'DWN-SHASH-500', image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=120&auto=format&fit=crop&q=80' },
      { name: 'Menu Chicken Shashlik Skewers (515g)', price: 1050, sku: 'MNU-SHASH-515', image: 'https://images.unsplash.com/photo-1527477321005-4d45d724b8c4?w=120&auto=format&fit=crop&q=80' },
      { name: 'Mon Salwa Seekh Kabab (500g)', price: 980, sku: 'MS-SKB-500', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=120&auto=format&fit=crop&q=80' }
    ],
    'milk': [
      { name: 'Nestle MilkPak Full Cream (1 Litre x 6)', price: 1720, sku: 'NES-MLK-1LX6', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=120&auto=format&fit=crop&q=80' },
      { name: 'Tarang Tea Whitening Liquid (1 Litre x 6)', price: 1590, sku: 'TRG-TEA-1LX6', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=120&auto=format&fit=crop&q=80' },
      { name: 'Nurpur Pure Milk (1 Litre x 6)', price: 1680, sku: 'NRP-MLK-1LX6', image: 'https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?w=120&auto=format&fit=crop&q=80' }
    ]
  };

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

    this.workflowService.orders$.subscribe((updatedOrders) => {
      this.orders = updatedOrders;
      if (this.selectedOrder) {
        const refreshed = updatedOrders.find(o => o.id === this.selectedOrder!.id);
        if (refreshed) {
          this.selectedOrder = refreshed;
        }
      }
    });
  }

  applyRoleBranchScoping(user: any) {
    if (user?.role === 'Branch Manager') {
      this.selectedBranch = user.branchCode || 'VAL-01';
    } else {
      // Admin and Moderator have cross-branch operational access
      if (!this.selectedBranch || this.isBranchLocked) {
        this.selectedBranch = 'all';
      }
    }
  }

  get isBranchLocked(): boolean {
    return this.currentUser?.role === 'Branch Manager';
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
      : (this.selectedBranch === 'all' ? this.orders : this.orders.filter(o => o.branchCode === this.selectedBranch || o.branch.includes(this.selectedBranch)));

    return {
      all: baseOrders.length,
      pending: baseOrders.filter(o => o.status === 'Pending' || o.status === 'Placed' || o.status === 'Confirmed').length,
      accepted: baseOrders.filter(o => o.status === 'Accepted' || o.status === 'Picking' || o.status === 'Packed').length,
      dispatch: baseOrders.filter(o => o.status === 'Dispatch' || o.status === 'Rider assigned' || o.status === 'Out for delivery').length,
      delivered: baseOrders.filter(o => o.status === 'Delivered').length,
      rejected: baseOrders.filter(o => o.status === 'Rejected' || o.status === 'Cancelled' || o.status === 'Refunded').length,
      // Urgency & Issue Counts
      urgent: baseOrders.filter(o => o.urgency === 'Urgent' || o.priorityTier === 'P1' || o.priorityTier === 'P2').length,
      standard: baseOrders.filter(o => o.urgency === 'Standard' || (!o.urgency && o.priorityTier === 'P3')).length,
      scheduled: baseOrders.filter(o => o.urgency === 'Scheduled' || o.priorityTier === 'P4').length,
      exceptions: baseOrders.filter(o => o.hasException).length,
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
      if (this.selectedStatus !== 'all') {
        if (this.selectedStatus === 'Pending' && !(o.status === 'Pending' || o.status === 'Placed' || o.status === 'Confirmed')) return false;
        else if (this.selectedStatus === 'Accepted' && !(o.status === 'Accepted' || o.status === 'Picking' || o.status === 'Packed')) return false;
        else if (this.selectedStatus === 'Dispatch' && !(o.status === 'Dispatch' || o.status === 'Rider assigned' || o.status === 'Out for delivery')) return false;
        else if (this.selectedStatus === 'Delivered' && o.status !== 'Delivered') return false;
        else if (this.selectedStatus === 'Rejected' && !(o.status === 'Rejected' || o.status === 'Cancelled' || o.status === 'Refunded')) return false;
        else if (this.selectedStatus !== 'Pending' && this.selectedStatus !== 'Accepted' && this.selectedStatus !== 'Dispatch' && this.selectedStatus !== 'Delivered' && this.selectedStatus !== 'Rejected' && o.status !== this.selectedStatus) return false;
      }
      // Priority filter
      if (this.selectedPriority !== 'all') {
        if (this.selectedPriority === 'exceptions') {
          if (!o.hasException) return false;
        } else if (this.selectedPriority === 'urgent') {
          if (o.urgency !== 'Urgent' && o.priorityTier !== 'P1' && o.priorityTier !== 'P2') return false;
        } else if (this.selectedPriority === 'standard') {
          if (o.urgency !== 'Standard' && o.priorityTier !== 'P3' && o.urgency) return false;
        } else if (this.selectedPriority === 'scheduled') {
          if (o.urgency !== 'Scheduled' && o.priorityTier !== 'P4') return false;
        }
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
        const matchesTier = (o.priorityTier || '').toLowerCase().includes(query);
        if (!matchesId && !matchesCode && !matchesName && !matchesPhone && !matchesAddress && !matchesBranch && !matchesRider && !matchesTier) {
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

  setPriorityTab(priority: string) {
    this.selectedPriority = priority;
    this.currentPage = 1;
  }

  resetFilters() {
    if (!this.isBranchLocked) {
      this.selectedBranch = 'all';
    }
    this.selectedStatus = 'all';
    this.selectedPriority = 'all';
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
    this.workflowService.updateOrderStatus(order.id, newStatus, this.currentUser);
  }

  togglePaymentType(order: RainbowOrder) {
    order.paymentType = order.paymentType === 'COD' ? 'CAOD' : 'COD';
    order.paymentChannel = order.paymentType === 'COD' ? 'Cash on Delivery' : 'Card on Delivery';
  }

  // =========================================================================
  // PRIORITY OVERRIDE METHODS
  // =========================================================================
  openPriorityModal(order: RainbowOrder, content: any) {
    this.targetOrderForPriority = order;
    this.selectedOverrideUrgency = order.urgency || (order.priorityTier === 'P1' || order.priorityTier === 'P2' ? 'Urgent' : (order.priorityTier === 'P4' ? 'Scheduled' : 'Standard'));
    this.overrideReason = 'Customer requested expedited / priority dispatch';
    this.overrideCustomNote = '';
    this.overrideError = null;
    this.activePriorityModalRef = this.modalService.open(content, { centered: true, size: 'md' });
  }

  confirmPriorityOverride() {
    if (!this.overrideReason || this.overrideReason.trim().length < 5) {
      this.overrideError = 'Please provide a mandatory operational reason (at least 5 characters).';
      return;
    }
    if (this.targetOrderForPriority) {
      const reasonFinal = `${this.overrideReason}${this.overrideCustomNote ? ': ' + this.overrideCustomNote : ''}`;
      this.workflowService.overridePriority(
        this.targetOrderForPriority.id,
        this.selectedOverrideUrgency,
        reasonFinal.trim(),
        this.currentUser
      );
      this.assignmentToast = `Order #${this.targetOrderForPriority.id} urgency updated to ${this.selectedOverrideUrgency}!`;
      setTimeout(() => this.assignmentToast = null, 4000);
      if (this.activePriorityModalRef) {
        this.activePriorityModalRef.close();
      }
    }
  }

  isOrderPriority(order: RainbowOrder | null | undefined): boolean {
    if (!order) return false;
    return order.urgency === 'Urgent' || order.priorityTier === 'P1' || order.priorityTier === 'P2';
  }

  togglePriority(order: RainbowOrder | null | undefined): void {
    if (!order) return;
    const isCurrentlyPriority = this.isOrderPriority(order);
    const newUrgency: 'Urgent' | 'Standard' = isCurrentlyPriority ? 'Standard' : 'Urgent';
    const reason = isCurrentlyPriority
      ? 'Order queue priority reverted to Standard'
      : 'Moderator expedited order: Fast-track Priority set for Dispatcher and Rider queues';

    this.workflowService.overridePriority(order.id, newUrgency, reason, this.currentUser);
    order.urgency = newUrgency;
    order.priorityTier = isCurrentlyPriority ? 'P3' : 'P1';

    this.assignmentToast = isCurrentlyPriority
      ? `Order #${order.id} set to Standard Queue.`
      : `Order #${order.id} set to Priority (Fast-track for Dispatcher & Rider)!`;
    setTimeout(() => this.assignmentToast = null, 3500);
  }

  // =========================================================================
  // FLAGGED EXCEPTION RESOLUTION METHODS
  // =========================================================================
  openExceptionModal(order: RainbowOrder, content: any) {
    this.targetOrderForException = order;
    this.selectedResolutionAction = 'reroute_store';
    this.exceptionResolutionNote = '';
    this.selectedRerouteBranchCode = 'SKP-01';
    this.activeExceptionModalRef = this.modalService.open(content, { centered: true, size: 'lg' });
  }

  confirmResolveException() {
    if (!this.targetOrderForException) return;

    if (this.selectedResolutionAction === 'reroute_store') {
      const targetBranch = this.branches.find(b => b.id === this.selectedRerouteBranchCode) || this.branches[1];
      this.workflowService.reassignBranch(
        this.targetOrderForException.id,
        targetBranch.id,
        targetBranch.name,
        this.exceptionResolutionNote || 'Rerouted due to store unacceptance timeout or load capacity',
        this.currentUser
      );
    }

    this.workflowService.resolveException(
      this.targetOrderForException.id,
      this.selectedResolutionAction,
      this.exceptionResolutionNote || 'Resolved by Moderator Console',
      this.currentUser
    );

    this.assignmentToast = `Exception on Order #${this.targetOrderForException.id} marked Resolved!`;
    setTimeout(() => this.assignmentToast = null, 4000);

    if (this.activeExceptionModalRef) {
      this.activeExceptionModalRef.close();
    }
  }

  // =========================================================================
  // DEDICATED ORDER CANCELLATION MODAL METHODS
  // =========================================================================
  openCancelOrderModal(order: RainbowOrder, content: any) {
    this.targetOrderForCancel = order;
    this.cancelReasonNotes = '';
    this.cancelError = null;
    this.cancelNotifyCustomer = true;
    if (order.hasOutOfStockItems || (order.hasException && order.exception?.type === 'item_out_of_stock')) {
      this.cancelReasonCategory = 'Item out of stock / Customer rejected substitution';
    } else {
      this.cancelReasonCategory = 'Customer requested cancellation via phone/app';
    }
    this.activeCancelModalRef = this.modalService.open(content, { centered: true, size: 'md' });
  }

  confirmOrderCancellation() {
    if (!this.targetOrderForCancel) return;
    if (!this.cancelReasonCategory) {
      this.cancelError = 'Please select a cancellation category.';
      return;
    }

    const res = this.workflowService.cancelOrderWithReason(
      this.targetOrderForCancel.id,
      this.cancelReasonCategory,
      this.cancelReasonNotes,
      this.cancelNotifyCustomer,
      this.currentUser
    );

    if (!res.success) {
      this.cancelError = res.message;
      return;
    }

    this.assignmentToast = res.message;
    setTimeout(() => this.assignmentToast = null, 4000);
    if (this.activeCancelModalRef) {
      this.activeCancelModalRef.close();
    }
  }

  // =========================================================================
  // MODERATOR EDIT ORDER ITEMS & SUBSTITUTION METHODS
  // =========================================================================
  openEditOrderModal(order: RainbowOrder, content: any) {
    this.selectedOrderForEdit = order;
    this.editOrderNotes = order.substitutionNotes || '';
    // Deep clone items so closing without saving discards changes
    this.editableItems = (order.items || []).map(item => ({
      ...item,
      substitutionOption: item.substitutionOption,
      specificReplacements: item.specificReplacements ? [...item.specificReplacements] : undefined,
      originalItemName: item.originalItemName || item.name,
      originalItemPrice: item.originalItemPrice || item.finalPrice
    }));
    this.customSubName = {};
    this.customSubPrice = {};
    this.activeEditModalRef = this.modalService.open(content, { centered: true, size: 'lg', scrollable: true });
  }

  applySpecificReplacement(item: RainbowOrderItem, choice: SpecificReplacementChoice) {
    this.applyItemSubstitution(item, choice.name, choice.price, choice.sku);
    if (choice.image) {
      item.image = choice.image;
    }
  }

  showCustomerChoicesAlert(item: RainbowOrderItem) {
    const choices = item.specificReplacements || this.getItemSubstitutes(item.name);
    if (!choices || choices.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'Customer Choices',
        text: 'No pre-selected specific alternative was specified by the customer for this item.',
        confirmButtonColor: '#2e3192'
      });
      return;
    }

    let itemsHtml = `
      <div style="text-align: left; font-size: 13px;">
        <p class="text-muted mb-3" style="font-size: 12px;">Customer specified the following preferred alternatives for <strong>${item.originalItemName || item.name}</strong>:</p>
        <div style="display: flex; flex-direction: column; gap: 8px;">
    `;

    choices.forEach((c, idx) => {
      itemsHtml += `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; gap: 10px;">
          <div style="display: flex; align-items: center; gap: 10px; min-width: 0;">
            <img src="${c.image || 'assets/images/products/img-01.png'}" style="width: 36px; height: 36px; object-fit: cover; border-radius: 6px; border: 1px solid #cbd5e1; flex-shrink: 0;" />
            <div style="min-width: 0;">
              <div style="font-weight: 600; color: #0f172a; font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 250px;">${c.name}</div>
              <small style="color: #64748b; font-family: monospace; font-size: 11px;">Choice #${idx + 1} &bull; <strong style="color: #2e3192;">Rs ${c.price.toFixed(2)}</strong></small>
            </div>
          </div>
          <button id="swal-select-choice-${idx}" class="btn btn-sm btn-primary" style="background: #2e3192; border-color: #2e3192; font-size: 11px; font-weight: 600; padding: 4px 12px; border-radius: 6px; cursor: pointer; flex-shrink: 0;">
            Select
          </button>
        </div>
      `;
    });

    itemsHtml += `</div></div>`;

    Swal.fire({
      title: 'Customer Replacement Choices',
      html: itemsHtml,
      showConfirmButton: false,
      showCloseButton: true,
      width: '520px',
      didOpen: () => {
        choices.forEach((c, idx) => {
          const btn = document.getElementById(`swal-select-choice-${idx}`);
          if (btn) {
            btn.onclick = () => {
              this.applySpecificReplacement(item, c);
              Swal.close();
            };
          }
        });
      }
    });
  }

  applyAutoBestMatch(item: RainbowOrderItem) {
    const subs = this.getItemSubstitutes(item.originalItemName || item.name);
    if (subs && subs.length > 0) {
      this.applyItemSubstitution(item, subs[0].name, subs[0].price, subs[0].sku);
    } else {
      this.applyItemSubstitution(item, 'Store Selected Best Match', item.originalItemPrice || item.finalPrice);
    }
  }

  confirmCustomerPhoneResolution(item: RainbowOrderItem, action: 'approved_sub' | 'remove') {
    if (action === 'approved_sub') {
      this.applyAutoBestMatch(item);
    } else {
      this.removeItemFromOrder(item);
    }
  }

  toggleItemStockStatus(item: RainbowOrderItem) {
    item.isOutOfStock = !item.isOutOfStock;
    if (item.isOutOfStock) {
      if (item.substitutionStatus === 'None' || !item.substitutionStatus) {
        item.substitutionStatus = 'Pending Choice';
      }
    } else {
      item.substitutionStatus = 'None';
    }
  }

  applyItemSubstitution(item: RainbowOrderItem, substituteName: string, substitutePrice: number, substituteSku?: string) {
    if (!item.originalItemName) {
      item.originalItemName = item.name;
    }
    if (!item.originalItemPrice) {
      item.originalItemPrice = item.finalPrice;
    }
    item.substituteItemName = substituteName;
    item.substituteItemPrice = substitutePrice;
    item.substituteSku = substituteSku || 'SUB-' + Math.floor(100000 + Math.random() * 900000);
    item.name = substituteName;
    item.finalPrice = substitutePrice;
    item.totalPrice = item.deliveredQty * substitutePrice;
    item.substitutionStatus = 'Substituted';
    item.isOutOfStock = false;
    item.isOverridden = true;
  }

  searchSubQuery: { [key: number]: string } = {};
  newProductSearchTerm: string = '';

  searchCatalogProducts(query: string): ProductType[] {
    if (!query || query.trim().length < 2) return [];
    const q = query.trim().toLowerCase();
    return ProductList.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.barcode && p.barcode.toLowerCase().includes(q)) ||
      (p.sku && p.sku.toLowerCase().includes(q))
    ).slice(0, 5);
  }

  applyProductSubstitution(item: RainbowOrderItem, product: ProductType, itemIndex: number) {
    this.applyItemSubstitution(item, product.name, product.price, product.sku);
    item.image = product.image;
    this.searchSubQuery[itemIndex] = '';
  }

  addNewProductToOrder(prod: ProductType) {
    if (!this.selectedOrderForEdit) return;
    const newItem: RainbowOrderItem = {
      itemId: 'ITM-' + Math.floor(1000 + Math.random() * 9000),
      name: prod.name,
      image: prod.image,
      barcode: prod.barcode || prod.sku,
      sku: prod.sku,
      orderedQty: 1,
      deliveredQty: 1,
      originalPrice: prod.price,
      discountPercent: 0,
      finalPrice: prod.price,
      totalPrice: prod.price,
      isOutOfStock: false,
      substitutionStatus: 'None',
      isOverridden: true
    };
    this.editableItems.push(newItem);
    this.newProductSearchTerm = '';
  }

  applyCustomSubstitution(index: number, item: RainbowOrderItem) {
    const name = this.customSubName[index];
    const price = this.customSubPrice[index] || item.finalPrice;
    if (!name || name.trim().length === 0) return;
    this.applyItemSubstitution(item, name.trim(), price);
    this.customSubName[index] = '';
  }

  removeItemFromOrder(item: RainbowOrderItem) {
    item.substitutionStatus = 'Removed';
    item.deliveredQty = 0;
    item.totalPrice = 0;
    item.isOverridden = true;
  }

  restoreOriginalItem(item: RainbowOrderItem) {
    if (item.originalItemName) {
      item.name = item.originalItemName;
    }
    if (item.originalItemPrice) {
      item.finalPrice = item.originalItemPrice;
    }
    item.deliveredQty = item.orderedQty || 1;
    item.totalPrice = item.deliveredQty * item.finalPrice;
    item.substitutionStatus = 'None';
    item.isOutOfStock = false;
    item.substituteItemName = undefined;
    item.substituteItemPrice = undefined;
  }

  adjustItemQty(item: RainbowOrderItem, delta: number) {
    const nextQty = Math.max(0, item.deliveredQty + delta);
    item.deliveredQty = nextQty;
    item.totalPrice = nextQty * item.finalPrice;
    if (nextQty === 0) {
      item.substitutionStatus = 'Removed';
    } else if (item.substitutionStatus === 'Removed') {
      item.substitutionStatus = 'None';
    }
    item.isOverridden = true;
  }

  getCalculatedSubtotal(): number {
    return this.editableItems.reduce((acc, it) => {
      if (it.substitutionStatus === 'Removed' || it.deliveredQty === 0) return acc;
      return acc + (it.deliveredQty * it.finalPrice);
    }, 0);
  }

  getCalculatedNetTotal(): number {
    if (!this.selectedOrderForEdit) return 0;
    const subtotal = this.getCalculatedSubtotal();
    return Math.max(0, subtotal + (this.selectedOrderForEdit.deliveryFee || 0) + (this.selectedOrderForEdit.packagingFee || 0) - (this.selectedOrderForEdit.discount || 0));
  }

  getOriginalNetTotal(): number {
    return this.selectedOrderForEdit ? this.selectedOrderForEdit.totalAmount : 0;
  }

  getTotalPriceDifference(): number {
    return this.getCalculatedNetTotal() - this.getOriginalNetTotal();
  }

  saveOrderItemsEdit() {
    if (!this.selectedOrderForEdit) return;

    const success = this.workflowService.updateOrderItems(
      this.selectedOrderForEdit.id,
      this.editableItems,
      this.currentUser,
      this.editOrderNotes
    );

    if (success) {
      // Sync selectedOrder if it is currently open in details modal
      if (this.selectedOrder && this.selectedOrder.id === this.selectedOrderForEdit.id) {
        const refreshed = this.workflowService.orders.find(o => o.id === this.selectedOrderForEdit?.id);
        if (refreshed) {
          this.selectedOrder = refreshed;
        }
      }

      this.assignmentToast = `Order #${this.selectedOrderForEdit.id} items and substitutions updated successfully. New total: Rs. ${this.getCalculatedNetTotal().toFixed(2)}`;
      setTimeout(() => this.assignmentToast = null, 4000);

      if (this.activeEditModalRef) {
        this.activeEditModalRef.close();
      }
    }
  }

  getItemSubstitutes(itemName: string): SpecificReplacementChoice[] {
    const lower = (itemName || '').toLowerCase();
    if (lower.includes('oil') || lower.includes('dalda') || lower.includes('ghee')) {
      return this.suggestedSubstitutes['oil'] || [];
    }
    if (lower.includes('chicken') || lower.includes('shashlik') || lower.includes('k&n') || lower.includes('wing') || lower.includes('meat')) {
      return this.suggestedSubstitutes['chicken'] || [];
    }
    if (lower.includes('milk') || lower.includes('olper') || lower.includes('dairy')) {
      return this.suggestedSubstitutes['milk'] || [];
    }
    return [
      { name: 'Rainbow Choice Premium Alternative', price: 950, sku: 'RBN-ALT-950', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&auto=format&fit=crop&q=80' }
    ];
  }

  // =========================================================================
  // REFUND & CANCELLATION APPROVAL METHODS
  // =========================================================================
  openRefundDialog(order: RainbowOrder, content: any) {
    this.targetOrderForRefund = order;
    this.refundAmount = order.totalAmount;
    this.refundReason = '';
    this.refundActionType = 'Refund';
    this.refundError = null;
    this.activeRefundModalRef = this.modalService.open(content, { centered: true, size: 'md' });
  }

  openCancelDialog(order: RainbowOrder, content: any) {
    this.targetOrderForRefund = order;
    this.refundAmount = order.totalAmount;
    this.refundReason = '';
    this.refundActionType = 'Cancel';
    this.refundError = null;
    this.activeRefundModalRef = this.modalService.open(content, { centered: true, size: 'md' });
  }

  confirmRefundOrCancel() {
    if (!this.targetOrderForRefund) return;
    if (!this.refundReason || this.refundReason.trim().length < 5) {
      this.refundError = 'Please specify a valid operational reason (min 5 chars).';
      return;
    }

    const result = this.workflowService.approveRefundOrCancel(
      this.targetOrderForRefund.id,
      this.refundAmount,
      this.refundActionType,
      this.refundReason,
      this.currentUser
    );

    if (!result.success) {
      this.refundError = result.message;
      return;
    }

    this.assignmentToast = result.message;
    setTimeout(() => this.assignmentToast = null, 4000);
    if (this.activeRefundModalRef) {
      this.activeRefundModalRef.close();
    }
  }

  // =========================================================================
  // TIME LOG & PRODUCTIVITY HELPERS
  // =========================================================================
  getOrderProductivity(orderId: string): DerivedProductivityMetrics {
    return this.timeLogService.getOrderMetrics(orderId);
  }

  getOrderTimelineLogs(orderId: string): TimeLogRecord[] {
    return this.timeLogService.logs.filter(l => l.orderId === orderId);
  }

  getPriorityBadgeClass(tier?: PriorityTier): string {
    switch (tier) {
      case 'P1': return 'bg-danger text-white border-0 shadow-sm';
      case 'P2': return 'bg-warning-subtle text-warning-emphasis border border-warning';
      case 'P3': return 'bg-primary-subtle text-primary border border-primary-subtle';
      case 'P4': return 'bg-secondary-subtle text-secondary border';
      default: return 'bg-light text-muted border';
    }
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
      case 'Placed':
      case 'Pending':
        return 'bg-warning-subtle text-warning-emphasis border border-warning';
      case 'Confirmed':
        return 'bg-primary-subtle text-primary border border-primary-subtle';
      case 'Picking':
        return 'bg-info-subtle text-info border border-info-subtle';
      case 'Packed':
        return 'bg-indigo-subtle text-indigo border border-indigo-subtle';
      case 'Accepted':
        return 'bg-primary-subtle text-primary';
      case 'Rider assigned':
        return 'bg-teal-subtle text-teal border border-teal-subtle';
      case 'Out for delivery':
      case 'Dispatch':
        return 'bg-info text-white shadow-sm';
      case 'Delivered':
        return 'bg-success text-white shadow-sm';
      case 'Cancelled':
      case 'Rejected':
        return 'bg-danger text-white shadow-sm';
      case 'Refunded':
        return 'bg-secondary-subtle text-dark border';
      default:
        return 'bg-secondary-subtle text-secondary';
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

  // =========================================================================
  // DISPATCHER QUEUE & QUICK VERIFICATION ACTIONS
  // =========================================================================
  targetOrderForDispatcher: RainbowOrder | null = null;
  selectedDispatcherStaffId: string = '';
  selectedStagingBay: string = '';
  dispatcherReassignReason: string = 'Store queue workload balancing';
  activeDispatcherModalRef: any = null;
  stagingBays: string[] = [];

  openReassignDispatcherModal(order: RainbowOrder, content: any) {
    this.targetOrderForDispatcher = order;
    const branchDispatchers = this.getBranchDispatchers(order);
    this.selectedDispatcherStaffId = order.assignedDispatcher?.id || (branchDispatchers[0]?.id || '');
    this.selectedStagingBay = '';
    this.dispatcherReassignReason = 'Store queue workload balancing';
    this.activeDispatcherModalRef = this.modalService.open(content, { centered: true, size: 'md' });
  }

  getBranchDispatchers(order: RainbowOrder | null): BranchStaff[] {
    if (!order) return [];
    return this.workflowService.getStoreDispatchers(order.branchCode);
  }

  confirmReassignDispatcher() {
    if (!this.targetOrderForDispatcher) return;
    const dispatchers = this.getBranchDispatchers(this.targetOrderForDispatcher);
    const chosen = dispatchers.find(d => d.id === this.selectedDispatcherStaffId) || dispatchers[0];
    if (!chosen) return;

    const result = this.workflowService.reassignDispatcher(
      this.targetOrderForDispatcher.id,
      chosen,
      '',
      this.dispatcherReassignReason,
      this.currentUser
    );

    this.assignmentToast = result.message;
    setTimeout(() => this.assignmentToast = null, 4000);
    if (this.activeDispatcherModalRef) {
      this.activeDispatcherModalRef.close();
    }
  }

  verifyAndQueueOrder(order: RainbowOrder) {
    const result = this.workflowService.confirmAndQueueOrder(order.id, this.currentUser);
    this.assignmentToast = result.message;
    setTimeout(() => this.assignmentToast = null, 4000);
  }

  markOrderReadyToPick(order: RainbowOrder) {
    const result = this.workflowService.markReadyToPick(order.id, this.currentUser);
    this.assignmentToast = result.message;
    setTimeout(() => this.assignmentToast = null, 4000);
  }
}

export { OrdersListComponent as OrdersList };
