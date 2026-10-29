import { showSaveSuccess, showSaveValidation } from '@shared/utils/save-alert';
import { confirmAction } from '@shared/utils/confirmation';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbModal, NgbModalModule, NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ProductPromotion, RAINBOW_PROMOTIONS, RAINBOW_BRANCH_OPTIONS, BranchOption } from '../data';
import { ProductList, ProductType } from '../../products/data';
import { MASTER_CATEGORIES, SUB_CATEGORIES, SUB_SUB_CATEGORIES, BRANDS, MasterCategory, SubCategory, SubSubCategory, Brand, getBrandsForCategoryAndSubCategory } from '../../category/data';
import { ThemedNativeSelectDirective } from '../../products/themed-select/themed-native-select.directive';

@Component({
  selector: 'app-promotions-list',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe, NgbDropdownModule, NgbPaginationModule, NgbModalModule, NgbTooltipModule, ThemedNativeSelectDirective],
  templateUrl: './promotions-list.component.html',
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

    /* Scope Pills */
    .scope-pill-btn {
      padding: 5px 11px;
      font-size: 12px;
      font-weight: 600;
      border-radius: 6px;
      border: 1px solid #e2e8f0;
      background: #ffffff;
      color: #64748b;
      cursor: pointer;
      transition: all 0.15s ease;

      &:hover:not(.active) {
        background: #f8fafc;
        border-color: #cbd5e1;
        color: #0f172a;
      }

      &.active {
        background: #2e3192;
        border-color: #2e3192;
        color: #ffffff;
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

      &.btn-pause:hover {
        background: #fffbeb;
        color: #d97706;
        border-color: #fcd34d;
      }

      &.btn-play:hover {
        background: #ecfdf5;
        color: #059669;
        border-color: #a7f3d0;
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

    .promotion-scope {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
      .btn { min-height: 44px; white-space: normal; }
    }

    .promotion-form {
      .form-control-sleek { min-height: 44px; }
      .form-label { line-height: 1.5; }
      .input-group-text { min-height: 44px; }
      .badge { white-space: normal; line-height: 1.4; text-align: left; }
    }

    .promotion-product-preview {
      height: 44px;
      padding: 5px 8px;
      line-height: 1.3;
      > div:last-child { min-width: 0; }
    }

    .promotion-price-result {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 44px;
      padding: 8px;
    }

    @media (max-width: 575.98px) {
      .promotion-scope { grid-template-columns: minmax(0, 1fr); }

      .table-clean {
        th, td {
          padding: 8px 8px;
        }
      }

      .dtr-child-table {
        .dtr-child-title {
          width: 32%;
          min-width: 90px;
          padding: 8px 10px;
          font-size: 11px;
          line-height: 1.3;
          vertical-align: middle;
          word-break: normal;
        }

        .dtr-child-data {
          padding: 8px 10px;
          font-size: 12px;
          word-break: break-word;
        }
      }
    }

    /* Branch Checkbox Card */
    .branch-card-select {
      border: 1px solid #e2e8f0;
      border-radius: 7px;
      padding: 8px 12px;
      background: #ffffff;
      transition: all 0.15s ease;

      &:hover {
        border-color: #cbd5e1;
        background: #f8fafc;
      }
    }
  `]
})
export class PromotionsListComponent implements OnInit {
  title = 'Product Promotions & Discount Deals';
  promotions: ProductPromotion[] = RAINBOW_PROMOTIONS;
  branches: BranchOption[] = RAINBOW_BRANCH_OPTIONS;
  availableProducts: ProductType[] = ProductList;

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

  // Filters
  selectedBranch: string = 'all';
  selectedStatus: string = 'all';
  selectedScope: string = 'all';
  selectedDiscountType: string = 'all';
  searchTerm: string = '';

  // Pagination
  pageSize: number = 8;
  currentPage: number = 1;

  // Modal State for Add / Edit
  isEditing: boolean = false;
  activePromoModalRef: any = null;
  formPromo: Partial<ProductPromotion> = {};
  selectedBranchMap: { [branchId: string]: boolean } = {};
  actionFeedback: string | null = null;

  masterCategories: MasterCategory[] = MASTER_CATEGORIES;
  allSubCategories: SubCategory[] = SUB_CATEGORIES;
  allSubSubCategories: SubSubCategory[] = SUB_SUB_CATEGORIES;
  allBrands: Brand[] = BRANDS;

  // Individual Cascading Selection: Category -> Sub Category -> Sub Sub Category -> Brand -> Product
  individualCategory: string = '';
  individualSubCategory: string = '';
  individualSubSubCategory: string = '';
  individualBrand: string = '';

  // Bulk Cascading Selection: Category -> Sub Category -> Sub Sub Category -> Brand
  bulkCategory: string = '';
  bulkSubCategory: string = '';
  bulkSubSubCategory: string = '';
  bulkBrand: string = '';

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {
    this.refreshAllStatuses();
  }

  // Automatically refresh campaign statuses relying on start & end dates
  refreshAllStatuses(): void {
    for (const p of this.promotions) {
      if (p.status !== 'Paused') {
        p.status = this.computeStatusFromDates(p.startDate, p.endDate);
      }
    }
  }

  computeStatusFromDates(startDateStr?: string, endDateStr?: string): 'Active' | 'Scheduled' | 'Expired' {
    if (!startDateStr || !endDateStr) return 'Active';
    const todayStr = new Date().toISOString().substring(0, 10);
    if (todayStr < startDateStr) {
      return 'Scheduled';
    } else if (todayStr > endDateStr) {
      return 'Expired';
    } else {
      return 'Active';
    }
  }

  // ==========================================
  // Individual Cascading Hierarchy (Cat -> Sub -> SubSub -> Brand -> Product)
  // ==========================================
  get individualFilteredSubCategories(): SubCategory[] {
    const cat = this.masterCategories.find(c => c.name === this.individualCategory);
    if (!cat) return this.allSubCategories;
    const subs = this.allSubCategories.filter(s => s.parentCategoryId === cat.id);
    return subs.length > 0 ? subs : this.allSubCategories;
  }

  get individualFilteredSubSubCategories(): SubSubCategory[] {
    const cat = this.masterCategories.find(c => c.name === this.individualCategory);
    const catId = cat ? cat.id : undefined;
    const sub = this.allSubCategories.find(s => s.name === this.individualSubCategory && (!catId || s.parentCategoryId === catId));
    const subId = sub ? sub.id : undefined;

    let sscs = this.allSubSubCategories;
    if (catId) {
      sscs = sscs.filter(s => s.parentCategoryId === catId);
    }
    if (subId) {
      sscs = sscs.filter(s => s.subCategoryId === subId);
    }
    return sscs.length > 0 ? sscs : this.allSubSubCategories;
  }

  get individualFilteredBrands(): Brand[] {
    const cat = this.masterCategories.find(c => c.name === this.individualCategory);
    const catId = cat ? cat.id : undefined;
    const sub = this.allSubCategories.find(s => s.name === this.individualSubCategory && s.parentCategoryId === catId);
    const subId = sub ? sub.id : undefined;

    let brands = getBrandsForCategoryAndSubCategory(catId, subId);
    if (!brands || brands.length === 0) {
      brands = getBrandsForCategoryAndSubCategory(catId);
    }
    if (!brands || brands.length === 0) {
      brands = this.allBrands;
    }
    return brands;
  }

  get individualFilteredProducts(): ProductType[] {
    let prods = this.availableProducts;
    if (this.individualCategory) {
      const byCat = prods.filter(p => p.category?.toLowerCase() === this.individualCategory.toLowerCase());
      if (byCat.length > 0) prods = byCat;
    }
    if (this.individualSubCategory) {
      const bySub = prods.filter(p => p.subCategory?.toLowerCase() === this.individualSubCategory.toLowerCase());
      if (bySub.length > 0) prods = bySub;
    }
    if (this.individualSubSubCategory) {
      const bySsc = prods.filter(p => p.subSubCategory?.toLowerCase() === this.individualSubSubCategory.toLowerCase());
      if (bySsc.length > 0) prods = bySsc;
    }
    if (this.individualBrand) {
      const byBrand = prods.filter(p => p.brand?.toLowerCase() === this.individualBrand.toLowerCase());
      if (byBrand.length > 0) prods = byBrand;
    }
    return prods.length > 0 ? prods : this.availableProducts;
  }

  onIndividualCategoryChange() {
    const subs = this.individualFilteredSubCategories;
    this.individualSubCategory = subs[0]?.name || '';
    this.onIndividualSubCategoryChange();
  }

  onIndividualSubCategoryChange() {
    const sscs = this.individualFilteredSubSubCategories;
    this.individualSubSubCategory = sscs[0]?.name || '';
    this.onIndividualSubSubCategoryChange();
  }

  onIndividualSubSubCategoryChange() {
    const brands = this.individualFilteredBrands;
    this.individualBrand = brands[0]?.name || '';
    this.onIndividualBrandChange();
  }

  onIndividualBrandChange() {
    const prods = this.individualFilteredProducts;
    if (prods.length > 0) {
      const exists = prods.some(p => p.id === this.formPromo.productId);
      if (!exists) {
        this.formPromo.productId = prods[0].id;
        this.onProductSelectChange();
      }
    }
  }

  // ==========================================
  // Bulk Cascading Hierarchy (Cat -> Sub -> SubSub -> Brand)
  // ==========================================
  get bulkFilteredSubCategories(): SubCategory[] {
    const cat = this.masterCategories.find(c => c.name === this.bulkCategory);
    if (!cat) return this.allSubCategories;
    const subs = this.allSubCategories.filter(s => s.parentCategoryId === cat.id);
    return subs.length > 0 ? subs : this.allSubCategories;
  }

  get bulkFilteredSubSubCategories(): SubSubCategory[] {
    const cat = this.masterCategories.find(c => c.name === this.bulkCategory);
    const catId = cat ? cat.id : undefined;
    const sub = this.allSubCategories.find(s => s.name === this.bulkSubCategory && (!catId || s.parentCategoryId === catId));
    const subId = sub ? sub.id : undefined;

    let sscs = this.allSubSubCategories;
    if (catId) {
      sscs = sscs.filter(s => s.parentCategoryId === catId);
    }
    if (subId) {
      sscs = sscs.filter(s => s.subCategoryId === subId);
    }
    return sscs.length > 0 ? sscs : this.allSubSubCategories;
  }

  get bulkFilteredBrands(): Brand[] {
    const cat = this.masterCategories.find(c => c.name === this.bulkCategory);
    const catId = cat ? cat.id : undefined;
    const sub = this.allSubCategories.find(s => s.name === this.bulkSubCategory && s.parentCategoryId === catId);
    const subId = sub ? sub.id : undefined;

    let brands = getBrandsForCategoryAndSubCategory(catId, subId);
    if (!brands || brands.length === 0) {
      brands = getBrandsForCategoryAndSubCategory(catId);
    }
    if (!brands || brands.length === 0) {
      brands = this.allBrands;
    }
    return brands;
  }

  onBulkTargetTypeChange() {
    if (this.formPromo.bulkTargetType === 'category') {
      this.formPromo.bulkTargetValue = this.bulkCategory || this.masterCategories[0]?.name;
    } else if (this.formPromo.bulkTargetType === 'subcategory') {
      const subs = this.bulkFilteredSubCategories;
      this.bulkSubCategory = subs[0]?.name || '';
      this.formPromo.bulkTargetValue = this.bulkSubCategory;
    } else if (this.formPromo.bulkTargetType === 'subsubcategory') {
      const subs = this.bulkFilteredSubCategories;
      this.bulkSubCategory = subs[0]?.name || '';
      const sscs = this.bulkFilteredSubSubCategories;
      this.bulkSubSubCategory = sscs[0]?.name || '';
      this.formPromo.bulkTargetValue = this.bulkSubSubCategory;
    } else if (this.formPromo.bulkTargetType === 'brand') {
      const brands = this.bulkFilteredBrands;
      this.bulkBrand = brands[0]?.name || '';
      this.formPromo.bulkTargetValue = this.bulkBrand;
    }
    this.updateEstimatedSkus();
  }

  onBulkCategoryChange() {
    if (this.formPromo.bulkTargetType === 'category') {
      this.formPromo.bulkTargetValue = this.bulkCategory;
    } else {
      const subs = this.bulkFilteredSubCategories;
      this.bulkSubCategory = subs[0]?.name || '';
      if (this.formPromo.bulkTargetType === 'subcategory') {
        this.formPromo.bulkTargetValue = this.bulkSubCategory;
      } else if (this.formPromo.bulkTargetType === 'subsubcategory') {
        const sscs = this.bulkFilteredSubSubCategories;
        this.bulkSubSubCategory = sscs[0]?.name || '';
        this.formPromo.bulkTargetValue = this.bulkSubSubCategory;
      } else if (this.formPromo.bulkTargetType === 'brand') {
        const brands = this.bulkFilteredBrands;
        this.bulkBrand = brands[0]?.name || '';
        this.formPromo.bulkTargetValue = this.bulkBrand;
      }
    }
    this.updateEstimatedSkus();
  }

  onBulkSubCategoryChange() {
    if (this.formPromo.bulkTargetType === 'subcategory') {
      this.formPromo.bulkTargetValue = this.bulkSubCategory;
    } else if (this.formPromo.bulkTargetType === 'subsubcategory') {
      const sscs = this.bulkFilteredSubSubCategories;
      this.bulkSubSubCategory = sscs[0]?.name || '';
      this.formPromo.bulkTargetValue = this.bulkSubSubCategory;
    } else if (this.formPromo.bulkTargetType === 'brand') {
      const brands = this.bulkFilteredBrands;
      this.bulkBrand = brands[0]?.name || '';
      this.formPromo.bulkTargetValue = this.bulkBrand;
    }
    this.updateEstimatedSkus();
  }

  onBulkSubSubCategoryChange() {
    if (this.formPromo.bulkTargetType === 'subsubcategory') {
      this.formPromo.bulkTargetValue = this.bulkSubSubCategory;
    }
    this.updateEstimatedSkus();
  }

  onBulkBrandChange() {
    if (this.formPromo.bulkTargetType === 'brand') {
      this.formPromo.bulkTargetValue = this.bulkBrand;
    }
    this.updateEstimatedSkus();
  }

  updateEstimatedSkus() {
    const val = this.formPromo.bulkTargetValue;
    if (!val) {
      this.formPromo.estimatedItemsCount = 0;
      return;
    }
    let count = 0;
    const targetType = this.formPromo.bulkTargetType;
    if (targetType === 'category') {
      count = this.availableProducts.filter(p => p.category?.toLowerCase() === val.toLowerCase()).length;
    } else if (targetType === 'subcategory') {
      count = this.availableProducts.filter(p => p.subCategory?.toLowerCase() === val.toLowerCase()).length;
    } else if (targetType === 'subsubcategory') {
      count = this.availableProducts.filter(p => p.subSubCategory?.toLowerCase() === val.toLowerCase()).length;
    } else if (targetType === 'brand') {
      count = this.availableProducts.filter(p => p.brand?.toLowerCase() === val.toLowerCase()).length;
    }
    this.formPromo.estimatedItemsCount = count > 0 ? count : 12;
  }

  get counts() {
    return {
      all: this.promotions.length,
      active: this.promotions.filter(p => p.status === 'Active').length,
      scheduled: this.promotions.filter(p => p.status === 'Scheduled').length,
      expired: this.promotions.filter(p => p.status === 'Expired' || p.status === 'Paused').length,
      individual: this.promotions.filter(p => p.scope === 'individual').length,
      bulk: this.promotions.filter(p => p.scope === 'bulk').length,
      totalSavings: this.promotions.reduce((acc, p) => acc + (p.totalSavingsGiven || 0), 0),
    };
  }

  get filteredPromotions(): ProductPromotion[] {
    return this.promotions.filter(p => {
      // Branch filter
      if (this.selectedBranch !== 'all') {
        if (p.branchSelection === 'all') {
          // Applies to all branches
        } else if (!p.targetBranchIds.includes(this.selectedBranch)) {
          return false;
        }
      }
      // Status filter
      if (this.selectedStatus !== 'all' && p.status !== this.selectedStatus) {
        return false;
      }
      // Scope filter
      if (this.selectedScope !== 'all' && p.scope !== this.selectedScope) {
        return false;
      }
      // Discount type
      if (this.selectedDiscountType !== 'all' && p.discountType !== this.selectedDiscountType) {
        return false;
      }
      // Search
      if (this.searchTerm.trim()) {
        const q = this.searchTerm.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesProduct = p.productName ? p.productName.toLowerCase().includes(q) : false;
        const matchesTarget = p.bulkTargetValue ? p.bulkTargetValue.toLowerCase().includes(q) : false;
        const matchesBadge = p.badgeText.toLowerCase().includes(q);
        if (!matchesTitle && !matchesProduct && !matchesTarget && !matchesBadge) {
          return false;
        }
      }
      return true;
    });
  }

  get paginatedPromotions(): ProductPromotion[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredPromotions.slice(start, start + this.pageSize);
  }

  get currentEndIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredPromotions.length);
  }

  setStatusTab(status: string) {
    this.selectedStatus = status;
    this.currentPage = 1;
  }

  setScopeTab(scope: string) {
    this.selectedScope = scope;
    this.currentPage = 1;
  }

  onSearchChange(): void {
    this.currentPage = 1;
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.currentPage = 1;
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  resetFilters() {
    this.selectedBranch = 'all';
    this.selectedStatus = 'all';
    this.selectedScope = 'all';
    this.selectedDiscountType = 'all';
    this.searchTerm = '';
    this.currentPage = 1;
  }

  // Open modal for Create
  openCreateModal(content: any) {
    this.isEditing = false;

    // Initialize Individual Cascading Selectors: Category -> Sub Category -> Sub Sub Category -> Brand -> Product
    this.individualCategory = this.masterCategories[0]?.name || 'Frozen Food';
    const indSubs = this.individualFilteredSubCategories;
    this.individualSubCategory = indSubs[0]?.name || 'Frozen Chicken';
    const indSscs = this.individualFilteredSubSubCategories;
    this.individualSubSubCategory = indSscs[0]?.name || 'Shashlik & Skewers';
    const indBrands = this.individualFilteredBrands;
    this.individualBrand = indBrands[0]?.name || 'Rainbow Frozen';

    const prods = this.individualFilteredProducts;
    const defaultProd = prods.length > 0 ? prods[0] : this.availableProducts[0];

    // Initialize Bulk Cascading Selectors: Category -> Sub Category -> Sub Sub Category -> Brand
    this.bulkCategory = this.masterCategories[0]?.name || 'Frozen Food';
    const bSubs = this.bulkFilteredSubCategories;
    this.bulkSubCategory = bSubs[0]?.name || 'Frozen Chicken';
    const bSscs = this.bulkFilteredSubSubCategories;
    this.bulkSubSubCategory = bSscs[0]?.name || 'Shashlik & Skewers';
    const bBrands = this.bulkFilteredBrands;
    this.bulkBrand = bBrands[0]?.name || 'Rainbow Frozen';

    this.formPromo = {
      title: '',
      badgeText: 'SPECIAL OFFER',
      scope: 'individual',
      productId: defaultProd?.id || '',
      productName: defaultProd?.name || '',
      productImage: defaultProd?.image || '',
      productSku: defaultProd?.barcode || defaultProd?.sku || '',
      originalPrice: defaultProd?.sellingPrice || defaultProd?.mrp || defaultProd?.price || 900,
      promoPrice: 800,
      bulkTargetType: 'category',
      bulkTargetValue: this.bulkCategory,
      estimatedItemsCount: 15,
      discountType: 'percentage',
      discountValue: 10,
      branchSelection: 'all',
      targetBranchIds: [],
      targetBranchNames: [],
      startDate: new Date().toISOString().substring(0, 10),
      endDate: new Date(Date.now() + 14 * 86400000).toISOString().substring(0, 10),
    };
    this.formPromo.status = this.computeStatusFromDates(this.formPromo.startDate, this.formPromo.endDate);
    this.updateEstimatedSkus();

    // Initialize branch selection map
    this.selectedBranchMap = {};
    for (const b of this.branches) {
      this.selectedBranchMap[b.id] = true;
    }

    this.calculatePromoPrice();
    this.activePromoModalRef = this.modalService.open(content, { size: 'lg', centered: true, backdrop: 'static' });
  }

  // Open modal for Edit
  openEditModal(p: ProductPromotion, content: any) {
    this.isEditing = true;
    this.formPromo = { ...p };

    // Sync Individual Cascading Selectors
    if (p.scope === 'individual' && p.productId) {
      const prod = this.availableProducts.find(item => item.id === p.productId);
      if (prod) {
        if (prod.category) this.individualCategory = prod.category;
        if (prod.subCategory) this.individualSubCategory = prod.subCategory;
        if (prod.subSubCategory) this.individualSubSubCategory = prod.subSubCategory;
        if (prod.brand) this.individualBrand = prod.brand;
      }
    } else if (p.scope === 'bulk') {
      // Sync Bulk Cascading Selectors
      if (p.bulkTargetType === 'category') {
        this.bulkCategory = p.bulkTargetValue || this.masterCategories[0]?.name;
      } else if (p.bulkTargetType === 'subcategory') {
        const sub = this.allSubCategories.find(s => s.name === p.bulkTargetValue);
        if (sub) {
          const parent = this.masterCategories.find(c => c.id === sub.parentCategoryId);
          if (parent) this.bulkCategory = parent.name;
        }
        this.bulkSubCategory = p.bulkTargetValue || '';
      } else if (p.bulkTargetType === 'subsubcategory') {
        const ssc = this.allSubSubCategories.find(s => s.name === p.bulkTargetValue);
        if (ssc) {
          const parentCat = this.masterCategories.find(c => c.id === ssc.parentCategoryId);
          if (parentCat) this.bulkCategory = parentCat.name;
          this.bulkSubCategory = ssc.subCategoryName || '';
        }
        this.bulkSubSubCategory = p.bulkTargetValue || '';
      } else if (p.bulkTargetType === 'brand') {
        const brand = this.allBrands.find(b => b.name === p.bulkTargetValue);
        if (brand && brand.categoryNames && brand.categoryNames.length > 0) {
          this.bulkCategory = brand.categoryNames[0];
          if (brand.subCategoryNames && brand.subCategoryNames.length > 0) {
            this.bulkSubCategory = brand.subCategoryNames[0];
          }
        }
        this.bulkBrand = p.bulkTargetValue || '';
      }
    }

    this.selectedBranchMap = {};
    for (const b of this.branches) {
      this.selectedBranchMap[b.id] = p.branchSelection === 'all' || p.targetBranchIds.includes(b.id);
    }
    this.updateEstimatedSkus();
    this.activePromoModalRef = this.modalService.open(content, { size: 'lg', centered: true, backdrop: 'static' });
  }

  onProductSelectChange() {
    const prod = this.availableProducts.find(p => p.id === this.formPromo.productId);
    if (prod) {
      this.formPromo.productName = prod.name;
      this.formPromo.productImage = prod.image;
      this.formPromo.productSku = prod.barcode || prod.sku;
      this.formPromo.originalPrice = prod.sellingPrice || prod.mrp || prod.price || 900;
      this.calculatePromoPrice();
    }
  }

  calculatePromoPrice() {
    const orig = this.formPromo.originalPrice || 0;
    const discVal = Number(this.formPromo.discountValue) || 0;
    if (this.formPromo.discountType === 'percentage') {
      const savings = Math.round((orig * discVal) / 100);
      this.formPromo.promoPrice = Math.max(0, orig - savings);
      if (!this.isEditing) {
        this.formPromo.badgeText = `${discVal}% OFF`;
      }
    } else {
      this.formPromo.promoPrice = Math.max(0, orig - discVal);
      if (!this.isEditing) {
        this.formPromo.badgeText = `SAVE RS. ${discVal}`;
      }
    }
  }

  selectAllBranches(select: boolean) {
    for (const b of this.branches) {
      this.selectedBranchMap[b.id] = select;
    }
  }

  savePromotion() {
    if (!this.formPromo.title?.trim()) {
      void showSaveValidation('Please enter a promotion title.');
      return;
    }

    // Determine targeted branches
    let targetedIds: string[] = [];
    let targetedNames: string[] = [];

    if (this.formPromo.branchSelection === 'all') {
      targetedIds = this.branches.map(b => b.id);
      targetedNames = ['All 10 Superstores'];
    } else {
      targetedIds = this.branches.filter(b => this.selectedBranchMap[b.id]).map(b => b.id);
      if (targetedIds.length === 0) {
        void showSaveValidation('Please select at least one branch for this promotion.');
        return;
      }
      if (targetedIds.length === this.branches.length) {
        this.formPromo.branchSelection = 'all';
        targetedNames = ['All 10 Superstores'];
      } else {
        targetedNames = this.branches.filter(b => targetedIds.includes(b.id)).map(b => b.name.replace(/Branch \d+ - /, ''));
      }
    }

    // Automatically compute promotion status relying strictly on the active schedule dates
    const computedStatus = this.computeStatusFromDates(this.formPromo.startDate, this.formPromo.endDate);
    this.formPromo.status = computedStatus;

    if (this.isEditing && this.formPromo.id) {
      const idx = this.promotions.findIndex(p => p.id === this.formPromo.id);
      if (idx !== -1) {
        this.promotions[idx] = {
          ...this.promotions[idx],
          ...this.formPromo,
          status: computedStatus,
          targetBranchIds: targetedIds,
          targetBranchNames: targetedNames,
        } as ProductPromotion;
        void showSaveSuccess(`Promotion "${this.formPromo.title}" updated successfully.`);
      }
    } else {
      const newPromo: ProductPromotion = {
        id: `PRM-2026-0${this.promotions.length + 1}`,
        title: this.formPromo.title!,
        badgeText: this.formPromo.badgeText || 'SPECIAL DEAL',
        scope: this.formPromo.scope as 'individual' | 'bulk',
        productId: this.formPromo.productId,
        productName: this.formPromo.productName,
        productImage: this.formPromo.productImage,
        productSku: this.formPromo.productSku,
        originalPrice: this.formPromo.originalPrice,
        promoPrice: this.formPromo.promoPrice,
        bulkTargetType: this.formPromo.bulkTargetType,
        bulkTargetValue: this.formPromo.bulkTargetValue,
        estimatedItemsCount: this.formPromo.estimatedItemsCount || 12,
        discountType: this.formPromo.discountType as 'percentage' | 'fixed_amount',
        discountValue: Number(this.formPromo.discountValue) || 10,
        branchSelection: this.formPromo.branchSelection as 'all' | 'specific',
        targetBranchIds: targetedIds,
        targetBranchNames: targetedNames,
        startDate: this.formPromo.startDate || new Date().toISOString().substring(0, 10),
        endDate: this.formPromo.endDate || new Date(Date.now() + 14 * 86400000).toISOString().substring(0, 10),
        status: computedStatus,
        ordersCount: 0,
        totalSavingsGiven: 0,
        createdBy: 'Administrator',
        createdAt: new Date().toLocaleDateString(),
      };
      this.promotions.unshift(newPromo);
      void showSaveSuccess(`Promotion "${newPromo.title}" created successfully.`);
    }

    if (this.activePromoModalRef) {
      this.activePromoModalRef.close();
    }
  }

  toggleStatus(p: ProductPromotion) {
    if (p.status === 'Active') {
      p.status = 'Paused';
      this.showNotification(`Promotion "${p.title}" paused.`);
    } else {
      p.status = 'Active';
      this.showNotification(`Promotion "${p.title}" activated.`);
    }
  }

  async deletePromotion(p: ProductPromotion): Promise<void> {
    if (await confirmAction(`Are you sure you want to delete promotion "${p.title}"?`)) {
      this.promotions = this.promotions.filter(item => item.id !== p.id);
      this.showNotification(`Promotion "${p.title}" deleted.`);
    }
  }

  showNotification(msg: string) {
    this.actionFeedback = msg;
    setTimeout(() => {
      this.actionFeedback = null;
    }, 4500);
  }
}

export { PromotionsListComponent as PromotionsList };
