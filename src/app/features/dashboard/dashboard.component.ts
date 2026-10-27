import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild, inject } from '@angular/core';
import flatpickr from 'flatpickr';
import type { Instance as FlatpickrInstance } from 'flatpickr/dist/types/instance';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import type { ChartOptions } from '@common/apexchart.model';
import { NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from 'ng-apexcharts';
import { Branch, RAINBOW_BRANCHES } from './data';
import { MASTER_CATEGORIES } from '../category/data';
import { RAINBOW_ORDERS, RainbowOrder } from '../orders/data';
import { AuthenticationService } from '@core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    DecimalPipe,
    FormsModule,
    RouterModule,
    NgApexchartsModule,
    NgbDropdownModule,
    NgbTooltipModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './dashboard.component.html',
  styles: [`
    .op-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04), 0 4px 14px rgba(15, 23, 42, 0.02);
      transition: all 0.2s ease-in-out;
    }

    .date-range-capsule {
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      height: 38px;
      transition: all 0.15s ease;
      background: #ffffff;

      &:hover {
        border-color: #25aae1;
        background: #f8fafc;
      }

      &:focus-within {
        border-color: #2e3192;
        box-shadow: 0 0 0 3px rgba(46, 49, 146, 0.1);
      }

      .date-field {
        transition: color 0.15s ease;
        &:hover {
          color: #2e3192 !important;
        }
      }
    }

    .refresh-btn {
      border: 1px solid #cbd5e1;
      color: #2e3192;
      background: #ffffff;
      font-weight: 600;
      transition: all 0.2s ease;

      &:hover {
        background: #eef2ff;
        border-color: #2e3192;
        color: #2e3192;
      }
    }

    .spin-refresh {
      animation: spin 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .btn-branch-pill {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 6px 14px;
      height: 38px;
      max-width: 380px;
      color: #1e293b;
      font-size: 13px;
      font-weight: 600;
      transition: all 0.15s ease;
      cursor: pointer;

      &:hover:not(:disabled) {
        background: #ffffff;
        border-color: #25aae1;
      }

      &:focus, &.show {
        background: #ffffff;
        border-color: #2e3192;
        box-shadow: 0 0 0 3px rgba(46, 49, 146, 0.1);
      }

      &::after {
        display: none !important;
      }
    }

    .branch-dropdown-menu {
      min-width: 360px;
      max-width: 420px;
      max-height: 400px;
      overflow-y: auto;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      box-shadow: 0 14px 35px -5px rgba(15, 23, 42, 0.12), 0 8px 12px -6px rgba(15, 23, 42, 0.06);
      padding: 6px;

      .dropdown-item {
        border-radius: 8px;
        padding: 8px 12px;
        transition: all 0.15s ease;
        white-space: normal;

        &:hover {
          background: #f1f5f9;
        }

        &.active-branch {
          background: rgba(46, 49, 146, 0.08);
          color: #2e3192;
          font-weight: 600;
        }
      }
    }

    .kpi-card, .kpi-card-link {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      text-decoration: none;
      color: inherit;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04), 0 4px 14px rgba(15, 23, 42, 0.02);
      min-height: 188px;
      padding: 16px;
      gap: 12px;
      transition: all 0.2s ease-in-out;

      &:hover {
        transform: translateY(-2px);
        border-color: #25aae1 !important;
        box-shadow: 0 8px 24px rgba(46, 49, 146, 0.09) !important;
      }
    }

    .kpi-heading {
      gap: 12px;
      min-height: 34px;

      > span { font-size: 11px !important; line-height: 1.5; }
    }

    .kpi-value {
      min-height: 48px;
      align-content: center;
      row-gap: 8px !important;

      h2 {
        font-size: clamp(22px, 1.6vw, 26px) !important;
        line-height: 1.2;
        white-space: nowrap;
        font-variant-numeric: tabular-nums;
      }

      .badge { white-space: nowrap; }
    }

    .kpi-footer {
      margin-top: auto;
      padding-top: 10px;
      min-height: 40px;
      gap: 12px;
      font-size: 11px !important;
      line-height: 1.5;

      > :first-child { min-width: 0; flex: 1 1 auto; }
      > :last-child { flex-shrink: 0; max-width: 60%; }
      > .d-inline-flex { white-space: nowrap; }
    }

    .stat-icon {
      width: 34px;
      height: 34px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .period-pill {
      white-space: nowrap !important;
      flex-shrink: 0;
      font-size: 11.5px;
      padding: 5px 12px;
      border: 1px solid #e2e8f0;
      background: #ffffff;
      color: #64748b;
      border-radius: 6px;
      font-weight: 600;
      transition: all 0.15s ease;
      cursor: pointer;

      &.active {
        background: #2e3192;
        color: #ffffff;
        border-color: #2e3192;
      }

      &:hover:not(.active) {
        color: #2e3192;
        background: #f8fafc;
      }
    }

    .section-label {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: #64748b;
    }

    @media (min-width: 768px) {
      .border-end-md {
        border-right: 1px solid #e2e8f0 !important;
      }
    }

    .table-clean th {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      color: #64748b;
      background: #f8fafc;
      border-bottom: 1px solid #edf2f7;
      padding: 10px 14px;
    }

    .table-clean td {
      padding: 12px 14px;
      font-size: 13px;
      border-bottom: 1px solid #f1f5f9;
      vertical-align: middle;
    }

    .font-jost {
      font-family: 'Jost', -apple-system, BlinkMacSystemFont, sans-serif;
    }
  `]
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  title = 'OPERATIONS DASHBOARD';

  authService = inject(AuthenticationService);
  currentUser = this.authService.user;

  branches: Branch[] = RAINBOW_BRANCHES;
  selectedBranchId: string = 'all';

  // Date Filter State
  selectedDatePreset: 'today' | 'yesterday' | '7days' | '30days' | 'this_month' | 'custom' = 'today';
  startDate: string = '2026-10-16';
  endDate: string = '2026-10-16';
  displayDateLabel: string = 'Today (16/Oct/2026)';

  // Chart Timeline State
  selectedChartPeriod: 'Day' | 'Month' | 'Year' = 'Day';

  // Catalog Stats (Prominently requested by user)
  catalogStats = {
    totalCategories: MASTER_CATEGORIES.length,
    activeCategories: MASTER_CATEGORIES.filter(c => c.status === 'Active').length,
    totalSubCategories: MASTER_CATEGORIES.reduce((acc, cat) => acc + (cat.subCategoryCount || 0), 0),
    totalProducts: MASTER_CATEGORIES.reduce((acc, cat) => acc + (cat.totalProducts || 0), 0),
    branchAvailableProducts: 3120,
    inStockProducts: 3280,
    lowStockProducts: 165
  };

  // Operational KPI Stats
  kpiStats = {
    orders: 248,
    sales: 842500,
    salesGrowth: '+8.4%',
    avgOrderValue: 3397,
    fulfillmentRate: '98.4%',
    activeRiders: 46
  };

  // Operational Exceptions & Customer Health
  exceptionStats = {
    newCustomers: 68,
    newCustomerGrowth: '+14.2%',
    repeatRate: '74.2%',
    rejectedOrders: 24,
    rejectedRate: '1.8%',
    rejectedTopReason: 'Out of Stock (14)',
    cancelledOrders: 18,
    cancelledRate: '1.2%',
    cancelledTopReason: 'Customer Change / Delay',
    avgDispatchMinutes: '22 mins'
  };

  // Abandoned Cart Metrics Console
  abandonedStats = {
    totalCarts: 317,
    convertedCarts: 289,
    convertedRate: 91.2,
    abandonedCarts: 28,
    abandonedRate: 8.8,
    totalCartValue: 1372283,
    convertedValue: 1325430,
    abandonedValue: 46853
  };

  // Channel & Payment Breakdowns
  deviceStats = [
    { name: 'Android App', percentage: 70.4, count: 175, color: '#25aae1', icon: 'solar:smartphone-bold' },
    { name: 'iOS App', percentage: 18.2, count: 45, color: '#2e3192', icon: 'solar:iphone-bold' },
    { name: 'Web Portal', percentage: 11.4, count: 28, color: '#64748b', icon: 'solar:laptop-minimalistic-bold' }
  ];

  paymentStats = [
    { name: 'Cash on Delivery (COD)', percentage: 57.4, amount: 483595, color: '#2e3192', badge: 'Standard' },
    { name: 'Card on Delivery', percentage: 28.2, amount: 237585, color: '#25aae1', badge: 'POS Rider' },
    { name: 'Online Paid (Card / JazzCash)', percentage: 14.4, amount: 121320, color: '#10b981', badge: 'Pre-Paid' }
  ];

  // Fulfillment Breakdown
  fulfillmentStats = [
    { label: 'Delivered', count: 178, percentage: 72, color: '#10b981' },
    { label: 'Out for Delivery', count: 45, percentage: 18, color: '#25aae1' },
    { label: 'Packing & Dispatch', count: 20, percentage: 8, color: '#f59e0b' },
    { label: 'Cancelled / Returned', count: 5, percentage: 2, color: '#ef4444' }
  ];

  // Top Performing Departments
  topCategories = [
    { name: 'Dairy, Bread & Eggs', sales: 235900, percentage: 28, items: 342, icon: 'solar:cup-bold-duotone' },
    { name: 'Fruits & Vegetables', sales: 185350, percentage: 22, items: 295, icon: 'solar:apple-bold-duotone' },
    { name: 'Atta, Rice & Staples', sales: 151650, percentage: 18, items: 175, icon: 'solar:shop-bold-duotone' },
    { name: 'Chicken, Meat & Fish', sales: 134800, percentage: 16, items: 130, icon: 'solar:bone-bold-duotone' },
    { name: 'Snacks & Munchies', sales: 134800, percentage: 16, items: 260, icon: 'solar:box-minimalistic-bold-duotone' }
  ];

  // Recent Live Store Orders
  recentOrders: RainbowOrder[] = RAINBOW_ORDERS.slice(0, 6);

  // 2-Dates Calendar Pickers
  @ViewChild('startDateInput') startDateInput!: ElementRef<HTMLInputElement>;
  @ViewChild('endDateInput') endDateInput!: ElementRef<HTMLInputElement>;
  private startFp: FlatpickrInstance | null = null;
  private endFp: FlatpickrInstance | null = null;
  isRefreshing = false;

  // Mobile / Small Screen Row Expansion
  expandedRowIds = new Set<string | number>();

  toggleRowExpand(id: string | number): void {
    if (this.expandedRowIds.has(id)) {
      this.expandedRowIds.delete(id);
    } else {
      this.expandedRowIds.add(id);
    }
  }

  isRowExpanded(id: string | number): boolean {
    return this.expandedRowIds.has(id);
  }

  // ApexCharts
  performanceChart!: Partial<ChartOptions>;
  heatMapChart!: Partial<ChartOptions>;
  deviceChart!: Partial<ChartOptions>;
  paymentChart!: Partial<ChartOptions>;

  ngAfterViewInit(): void {
    this.initDatePickers();
  }

  ngOnDestroy(): void {
    if (this.startFp) {
      this.startFp.destroy();
      this.startFp = null;
    }
    if (this.endFp) {
      this.endFp.destroy();
      this.endFp = null;
    }
  }

  private initDatePickers(): void {
    if (this.startDateInput?.nativeElement) {
      this.startFp = flatpickr(this.startDateInput.nativeElement, {
        dateFormat: 'd M, Y',
        defaultDate: this.startDate,
        maxDate: this.endDate,
        allowInput: false,
        onChange: (selectedDates: Date[]) => {
          if (selectedDates && selectedDates.length > 0) {
            this.startDate = this.formatDateToYMD(selectedDates[0]);
            if (this.endFp) {
              this.endFp.set('minDate', this.startDate);
            }
            this.selectedDatePreset = 'custom';
            this.displayDateLabel = `${this.formatDisplayDate(selectedDates[0])} - ${this.formatDisplayDate(new Date(this.endDate))}`;
            this.updateStats();
            this.initAllCharts();
          }
        }
      }) as FlatpickrInstance;
    }

    if (this.endDateInput?.nativeElement) {
      this.endFp = flatpickr(this.endDateInput.nativeElement, {
        dateFormat: 'd M, Y',
        defaultDate: this.endDate,
        minDate: this.startDate,
        allowInput: false,
        onChange: (selectedDates: Date[]) => {
          if (selectedDates && selectedDates.length > 0) {
            this.endDate = this.formatDateToYMD(selectedDates[0]);
            if (this.startFp) {
              this.startFp.set('maxDate', this.endDate);
            }
            this.selectedDatePreset = 'custom';
            this.displayDateLabel = `${this.formatDisplayDate(new Date(this.startDate))} - ${this.formatDisplayDate(selectedDates[0])}`;
            this.updateStats();
            this.initAllCharts();
          }
        }
      }) as FlatpickrInstance;
    }
  }

  openStartPicker(): void {
    if (this.startFp) {
      this.startFp.open();
    }
  }

  openEndPicker(): void {
    if (this.endFp) {
      this.endFp.open();
    }
  }

  private formatDateToYMD(d: Date): string {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private formatDisplayDate(d: Date): string {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  }

  ngOnInit(): void {
    this.applyBranchScoping(this.authService.user);

    this.authService.currentUser$.subscribe((user: any) => {
      this.currentUser = user;
      this.applyBranchScoping(user);
    });

    this.updateStats();
    this.initAllCharts();
  }

  applyBranchScoping(user: any) {
    if (user?.role === 'Branch Manager' || user?.role === 'Moderator') {
      this.selectedBranchId = user.branchCode || 'VAL-01';
      this.updateStats();
      this.initAllCharts();
    }
  }

  get isBranchLocked(): boolean {
    return this.currentUser?.role === 'Branch Manager' || this.currentUser?.role === 'Moderator';
  }

  get currentBranchDisplayName(): string {
    if (this.isBranchLocked) {
      return this.currentUser?.branchName || 'Rainbow Cash & Carry - Valencia Branch';
    }
    const found = this.branches.find(b => b.id === this.selectedBranchId);
    return found ? found.name : 'All Branches (Consolidated 10 Superstores)';
  }

  get currentSelectedBranch(): Branch {
    if (this.isBranchLocked) {
      return {
        id: this.selectedBranchId,
        name: this.currentUser?.branchName || 'Rainbow Cash & Carry - Valencia Branch',
        city: 'Karachi',
        address: 'Assigned Outlet',
        activeOrders: 34
      };
    }
    return this.branches.find(b => b.id === this.selectedBranchId) || this.branches[0];
  }

  selectBranch(branchId: string): void {
    if (this.isBranchLocked) return;
    this.selectedBranchId = branchId;
    this.onBranchChange();
  }

  onBranchChange(): void {
    this.updateStats();
    this.initAllCharts();
  }

  setDatePreset(preset: 'today' | 'yesterday' | '7days' | '30days' | 'this_month' | 'custom'): void {
    this.selectedDatePreset = preset;
    if (preset === 'today') {
      this.startDate = '2026-10-16';
      this.endDate = '2026-10-16';
      this.displayDateLabel = 'Today (16/Oct/2026)';
    } else if (preset === 'yesterday') {
      this.startDate = '2026-10-15';
      this.endDate = '2026-10-15';
      this.displayDateLabel = 'Yesterday (15/Oct/2026)';
    } else if (preset === '7days') {
      this.startDate = '2026-10-10';
      this.endDate = '2026-10-16';
      this.displayDateLabel = 'Last 7 Days (10/Oct - 16/Oct)';
    } else if (preset === '30days') {
      this.startDate = '2026-09-17';
      this.endDate = '2026-10-16';
      this.displayDateLabel = 'Last 30 Days';
    } else if (preset === 'this_month') {
      this.startDate = '2026-10-01';
      this.endDate = '2026-10-16';
      this.displayDateLabel = 'This Month (October 2026)';
    }

    if (this.startFp && this.endFp && preset !== 'custom') {
      this.startFp.setDate(this.startDate, false);
      this.endFp.setDate(this.endDate, false);
      this.startFp.set('maxDate', this.endDate);
      this.endFp.set('minDate', this.startDate);
    }
    this.updateStats();
    this.initAllCharts();
  }

  onCustomDateChange(): void {
    this.selectedDatePreset = 'custom';
    this.displayDateLabel = `${this.startDate} to ${this.endDate}`;
    this.updateStats();
    this.initAllCharts();
  }

  setChartPeriod(period: 'Day' | 'Month' | 'Year'): void {
    this.selectedChartPeriod = period;
    this.initPerformanceChart();
  }

  updateStats(): void {
    const isSingleBranch = this.selectedBranchId !== 'all';
    const branchMultiplier = isSingleBranch ? 0.14 : 1.0;

    // Time Multiplier according to selected Date preset
    let dateMultiplier = 1.0;
    if (this.selectedDatePreset === 'yesterday') dateMultiplier = 0.95;
    else if (this.selectedDatePreset === '7days') dateMultiplier = 6.85;
    else if (this.selectedDatePreset === '30days') dateMultiplier = 29.5;
    else if (this.selectedDatePreset === 'this_month') dateMultiplier = 15.6;
    else if (this.selectedDatePreset === 'custom') dateMultiplier = 3.2;

    const baseOrders = Math.round(248 * branchMultiplier * dateMultiplier);
    this.kpiStats.orders = baseOrders;
    this.kpiStats.sales = Math.round(842500 * branchMultiplier * dateMultiplier);
    this.kpiStats.avgOrderValue = isSingleBranch ? 3210 : 3397;
    this.kpiStats.activeRiders = isSingleBranch ? 8 : 46;

    // Exception Stats
    this.exceptionStats.newCustomers = Math.round(68 * branchMultiplier * (dateMultiplier > 1 ? dateMultiplier * 0.8 : dateMultiplier));
    this.exceptionStats.rejectedOrders = Math.round(24 * branchMultiplier * dateMultiplier);
    this.exceptionStats.cancelledOrders = Math.round(18 * branchMultiplier * dateMultiplier);

    // Abandoned Cart Stats
    const baseCarts = Math.round(317 * branchMultiplier * dateMultiplier);
    const converted = Math.round(baseCarts * 0.912);
    const abandoned = Math.max(1, baseCarts - converted);
    this.abandonedStats.totalCarts = baseCarts;
    this.abandonedStats.convertedCarts = converted;
    this.abandonedStats.abandonedCarts = abandoned;
    this.abandonedStats.convertedRate = 91.2;
    this.abandonedStats.abandonedRate = 8.8;
    this.abandonedStats.totalCartValue = Math.round(1372283 * branchMultiplier * dateMultiplier);
    this.abandonedStats.convertedValue = Math.round(1325430 * branchMultiplier * dateMultiplier);
    this.abandonedStats.abandonedValue = Math.round(46853 * branchMultiplier * dateMultiplier);

    // Catalog stock adjustment for single branch
    this.catalogStats.branchAvailableProducts = isSingleBranch ? Math.round(3445 * 0.88) : 3445;

    // Filter recent orders
    if (isSingleBranch) {
      const branchObj = this.branches.find(b => b.id === this.selectedBranchId);
      const nameMatch = branchObj ? branchObj.name : '';
      const matched = RAINBOW_ORDERS.filter(o => o.branch.toLowerCase().includes(nameMatch.toLowerCase()) || o.branchCode === this.selectedBranchId);
      this.recentOrders = matched.length >= 3 ? matched.slice(0, 6) : RAINBOW_ORDERS.slice(0, 6);
    } else {
      this.recentOrders = RAINBOW_ORDERS.slice(0, 6);
    }
  }

  initAllCharts(): void {
    this.initPerformanceChart();
    this.initHeatMapChart();
    this.initDeviceChart();
    this.initPaymentChart();
  }

  initPerformanceChart(): void {
    const isSingle = this.selectedBranchId !== 'all';
    const factor = isSingle ? 0.15 : 1.0;

    let categories: string[];
    let revenueData: number[];
    let ordersData: number[];

    if (this.selectedChartPeriod === 'Day') {
      categories = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'];
      revenueData = [620000, 580000, 710000, 680000, 640000, 790000, 842500].map(v => Math.round(v * factor));
      ordersData = [195, 180, 225, 210, 205, 235, 248].map(v => Math.round(v * factor));
    } else if (this.selectedChartPeriod === 'Month') {
      categories = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      revenueData = [5400000, 5850000, 6100000, 6450000].map(v => Math.round(v * factor));
      ordersData = [1620, 1740, 1810, 1920].map(v => Math.round(v * factor));
    } else {
      categories = ['August', 'September', 'October'];
      revenueData = [22400000, 23800000, 24850000].map(v => Math.round(v * factor));
      ordersData = [6800, 7150, 7420].map(v => Math.round(v * factor));
    }

    this.performanceChart = {
      series: [
        {
          name: 'Revenue (PKR)',
          type: 'area',
          data: revenueData
        },
        {
          name: 'Orders',
          type: 'line',
          data: ordersData
        }
      ],
      chart: {
        height: 290,
        type: 'line',
        toolbar: { show: false },
        zoom: { enabled: false },
        fontFamily: 'Open Sans, sans-serif'
      },
      stroke: {
        curve: 'smooth',
        width: [2, 2.5]
      },
      fill: {
        type: ['gradient', 'solid'],
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.22,
          opacityTo: 0.02,
          stops: [0, 95, 100]
        }
      },
      colors: ['#2e3192', '#25aae1'],
      xaxis: {
        categories: categories,
        labels: { style: { colors: '#64748b', fontSize: '11px' } },
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      yaxis: [
        {
          title: { text: 'Revenue (PKR)', style: { color: '#2e3192', fontSize: '11px', fontWeight: 600 } },
          labels: {
            formatter: (val: number) => 'Rs ' + (val >= 1000000 ? (val / 1000000).toFixed(1) + 'M' : (val / 1000).toFixed(0) + 'k'),
            style: { colors: '#64748b', fontSize: '11px' }
          }
        },
        {
          opposite: true,
          title: { text: 'Orders', style: { color: '#25aae1', fontSize: '11px', fontWeight: 600 } },
          labels: {
            formatter: (val: number) => val.toLocaleString(),
            style: { colors: '#64748b', fontSize: '11px' }
          }
        }
      ],
      grid: { borderColor: '#f1f5f9', strokeDashArray: 3 },
      legend: { position: 'top', horizontalAlign: 'right', fontSize: '12px' },
      responsive: [{
        breakpoint: 360,
        options: {
          xaxis: {
            labels: {
              rotate: -45,
              hideOverlappingLabels: true,
              style: { fontSize: '8px' }
            }
          },
          yaxis: [
            {
              title: { text: 'Revenue (PKR)', offsetX: 18, style: { color: '#2e3192', fontSize: '8px', fontWeight: 600 } },
              labels: {
                formatter: (val: number) => 'Rs ' + (val >= 1000000 ? (val / 1000000).toFixed(1) + 'M' : (val / 1000).toFixed(0) + 'k'),
                minWidth: 24,
                maxWidth: 30,
                style: { colors: '#64748b', fontSize: '8px' }
              }
            },
            {
              opposite: true,
              title: { text: 'Orders', offsetX: -18, style: { color: '#25aae1', fontSize: '8px', fontWeight: 600 } },
              labels: {
                formatter: (val: number) => val.toLocaleString(),
                minWidth: 12,
                maxWidth: 18,
                style: { colors: '#64748b', fontSize: '8px' }
              }
            }
          ],
          grid: { padding: { left: -8, right: -8 } },
          legend: { fontSize: '9px' }
        }
      }]
    };
  }

  initHeatMapChart(): void {
    const isSingle = this.selectedBranchId !== 'all';
    const factor = isSingle ? 0.25 : 1.0;

    const scale = (val: number) => Math.max(2, Math.round(val * factor));

    this.heatMapChart = {
      series: [
        { name: 'Sun', data: [ { x: '8 AM', y: scale(14) }, { x: '11 AM', y: scale(38) }, { x: '2 PM', y: scale(52) }, { x: '5 PM', y: scale(68) }, { x: '8 PM', y: scale(84) }, { x: '10 PM', y: scale(45) } ] },
        { name: 'Sat', data: [ { x: '8 AM', y: scale(18) }, { x: '11 AM', y: scale(44) }, { x: '2 PM', y: scale(58) }, { x: '5 PM', y: scale(76) }, { x: '8 PM', y: scale(92) }, { x: '10 PM', y: scale(54) } ] },
        { name: 'Fri', data: [ { x: '8 AM', y: scale(16) }, { x: '11 AM', y: scale(42) }, { x: '2 PM', y: scale(65) }, { x: '5 PM', y: scale(86) }, { x: '8 PM', y: scale(96) }, { x: '10 PM', y: scale(50) } ] },
        { name: 'Thu', data: [ { x: '8 AM', y: scale(11) }, { x: '11 AM', y: scale(29) }, { x: '2 PM', y: scale(44) }, { x: '5 PM', y: scale(60) }, { x: '8 PM', y: scale(72) }, { x: '10 PM', y: scale(36) } ] },
        { name: 'Wed', data: [ { x: '8 AM', y: scale(12) }, { x: '11 AM', y: scale(26) }, { x: '2 PM', y: scale(40) }, { x: '5 PM', y: scale(54) }, { x: '8 PM', y: scale(66) }, { x: '10 PM', y: scale(32) } ] },
        { name: 'Tue', data: [ { x: '8 AM', y: scale(10) }, { x: '11 AM', y: scale(25) }, { x: '2 PM', y: scale(38) }, { x: '5 PM', y: scale(50) }, { x: '8 PM', y: scale(62) }, { x: '10 PM', y: scale(28) } ] },
        { name: 'Mon', data: [ { x: '8 AM', y: scale(15) }, { x: '11 AM', y: scale(32) }, { x: '2 PM', y: scale(46) }, { x: '5 PM', y: scale(62) }, { x: '8 PM', y: scale(74) }, { x: '10 PM', y: scale(38) } ] },
      ],
      chart: {
        height: 290,
        type: 'heatmap',
        toolbar: { show: false },
        fontFamily: 'Open Sans, sans-serif'
      },
      dataLabels: { enabled: false },
      colors: ['#2e3192'],
      plotOptions: {
        heatmap: {
          shadeIntensity: 0.65,
          radius: 5,
          colorScale: {
            ranges: [
              { from: 0, to: 20, color: '#e0f2fe', name: 'Low (0-20)' },
              { from: 21, to: 50, color: '#7dd3fc', name: 'Moderate (21-50)' },
              { from: 51, to: 75, color: '#25aae1', name: 'Busy (51-75)' },
              { from: 76, to: 100, color: '#2e3192', name: 'Peak Rush (76+)' }
            ]
          }
        }
      },
      xaxis: {
        type: 'category',
        labels: { style: { colors: '#64748b', fontSize: '11px' } }
      },
      yaxis: {
        labels: { style: { colors: '#64748b', fontSize: '11px' } }
      },
      grid: { padding: { top: -10, right: 10, bottom: 0 } },
      tooltip: {
        y: { formatter: (val: number) => `${val} Orders / hr` }
      }
    };
  }

  initDeviceChart(): void {
    this.deviceChart = {
      series: [70.4, 18.2, 11.4],
      chart: {
        height: 180,
        type: 'donut',
        toolbar: { show: false }
      },
      labels: ['Android App', 'iOS App', 'Web Browser'],
      colors: ['#25aae1', '#2e3192', '#94a3b8'],
      legend: { show: false },
      dataLabels: { enabled: false },
      plotOptions: {
        pie: {
          donut: {
            size: '72%',
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Mobile',
                formatter: () => '88.6%',
                color: '#25aae1',
                fontSize: '14px',
                fontWeight: 700
              }
            }
          }
        }
      },
      tooltip: {
        y: { formatter: (val: number) => `${val}% of Total Orders` }
      }
    };
  }

  initPaymentChart(): void {
    this.paymentChart = {
      series: [57.4, 28.2, 14.4],
      chart: {
        height: 180,
        type: 'donut',
        toolbar: { show: false }
      },
      labels: ['Cash on Delivery', 'Card on Delivery', 'Online Pre-Paid'],
      colors: ['#2e3192', '#25aae1', '#10b981'],
      legend: { show: false },
      dataLabels: { enabled: false },
      plotOptions: {
        pie: {
          donut: {
            size: '72%',
            labels: {
              show: true,
              total: {
                show: true,
                label: 'COD Share',
                formatter: () => '57.4%',
                color: '#2e3192',
                fontSize: '14px',
                fontWeight: 700
              }
            }
          }
        }
      },
      tooltip: {
        y: { formatter: (val: number) => `${val}%` }
      }
    };
  }

  refreshStats(): void {
    this.isRefreshing = true;
    this.updateStats();
    this.initAllCharts();
    setTimeout(() => {
      this.isRefreshing = false;
    }, 600);
  }

  getSelectedBranchShortName(): string {
    const branch = this.branches.find(b => b.id === this.selectedBranchId);
    return branch ? branch.name.replace(/^Branch \d+ - /, '') : 'All Stores';
  }
}

export { DashboardComponent as Dashboard };
