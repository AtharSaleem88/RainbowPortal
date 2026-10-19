import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgbModal, NgbModalModule, NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { BRANDS, Brand, MASTER_CATEGORIES, SUB_CATEGORIES, MasterCategory, SubCategory, BrandCategoryMapping } from '../data';

@Component({
  selector: 'app-brand-list',
  standalone: true,
  imports: [
    CommonModule,
    DecimalPipe,
    FormsModule,
    RouterLink,
    NgbModalModule,
    NgbPaginationModule,
    NgbTooltipModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './brands.html',
  styles: [`
    .cat-main-card {
      background: #ffffff;
      border: 1px solid #eaedf1;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
    }
    .kpi-card {
      background: #ffffff;
      border: 1px solid #eaedf1;
      border-radius: 12px;
      padding: 16px;
      text-decoration: none;
      color: inherit;
      display: block;
      height: 100%;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);

      &:hover {
        transform: translateY(-2px);
        border-color: #25aae1 !important;
        box-shadow: 0 8px 24px rgba(46, 49, 146, 0.08) !important;
      }
    }
    .kpi-icon-box {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .cursor-pointer {
      cursor: pointer;
    }
    .cat-row {
      transition: background-color 0.15s ease;
      &:hover {
        background-color: #f8fafc !important;
      }
    }
    .brand-logo-box {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      overflow: hidden;
      flex-shrink: 0;
      border: 1px solid #eaedf1;
      background: #f8fafc;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .cat-action-btn {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
      background: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #64748b;
      cursor: pointer;
      transition: all 0.15s ease;

      &:hover {
        background: #f8fafc;
        color: #2e3192;
        border-color: #25aae1;
      }

      &.btn-delete:hover {
        background: #fef2f2;
        color: #ef4444;
        border-color: #ef4444;
      }
    }
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

    .page-select-input {
      height: 34px;
      width: 120px;
      min-width: 120px;
      border-radius: 7px;
      border: 1px solid #cbd5e1;
      font-size: 12px;
      font-weight: 500;
      color: #1e293b;
      cursor: pointer;
      background-color: #ffffff;
      padding-left: 10px;
      padding-right: 28px;
      transition: all 0.15s ease;

      &:focus {
        border-color: #2e3192;
        box-shadow: 0 0 0 3px rgba(46, 49, 146, 0.1);
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
    .table-clean th {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      color: #64748b;
      background: #f8fafc;
      border-bottom: 1px solid #edf2f7;
      padding: 11px 14px;
      user-select: none;
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
    .chip-select-btn {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      font-size: 11.5px;
      padding: 5px 10px;
      border-radius: 6px;
      border: 1px solid #e2e8f0;
      background: #ffffff;
      color: #475569;
      cursor: pointer;
      transition: all 0.15s ease-in-out;
      user-select: none;

      &:hover {
        background: #f1f5f9;
        border-color: #cbd5e1;
        color: #1e293b;
      }

      &.selected {
        background: #eef2ff;
        border-color: #2e3192;
        color: #2e3192;
        font-weight: 600;
      }
    }
    .btn-classification {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 7px 12px;
      border-radius: 6px;
      font-size: 12px;
      border: 1px solid #e2e8f0;
      background: #ffffff;
      color: #64748b;
      cursor: pointer;
      transition: all 0.15s ease;

      &:hover {
        background: #f8fafc;
        border-color: #cbd5e1;
        color: #1e293b;
      }

      &.active {
        background: #eef2ff;
        border-color: #2e3192;
        color: #2e3192;
        font-weight: 600;
      }
    }
    .brand-preview-box {
      width: 44px;
      height: 44px;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
      background: #f8fafc;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      flex-shrink: 0;

      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        padding: 4px;
      }
    }
  `]
})
export class BrandList implements OnInit {
  private modalService = inject(NgbModal);

  brands: Brand[] = BRANDS;
  masterCategories: MasterCategory[] = MASTER_CATEGORIES;
  subCategories: SubCategory[] = SUB_CATEGORIES;

  searchTerm: string = '';
  selectedCategoryFilter: string = 'all';
  statusFilter: 'all' | 'active' | 'inactive' = 'all';
  sortBy: 'skus_desc' | 'skus_asc' | 'name_asc' = 'skus_desc';

  // Pagination
  currentPage: number = 1;
  pageSize: number = 10;

  // Selection
  selectedIds: Set<string> = new Set<string>();

  // Toast
  toastMessage: string | null = null;

  // Modal form fields
  isEditMode: boolean = false;
  editingBrandId: string | null = null;
  newBrand: Partial<Brand> = {
    name: '',
    origin: 'Local (Pakistan)',
    isVerified: true,
    isInHouse: false,
    status: 'Active',
    logo: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=100&auto=format&fit=crop&q=80',
    description: ''
  };

  modalSelectedCategoryId: string = 'CAT-02';
  modalSelectedSubCategoryIds: string[] = ['SUB-02-01'];

  ngOnInit(): void {}

  get totalBrandProducts(): number {
    return this.brands.reduce((acc, b) => acc + (b.totalProducts || 0), 0);
  }

  get brandCounts() {
    return {
      all: this.brands.length,
      active: this.brands.filter(b => b.status === 'Active').length,
      inactive: this.brands.filter(b => b.status === 'Inactive').length
    };
  }

  get activeBrandsCount(): number {
    return this.brands.filter(b => b.status === 'Active').length;
  }

  get subCategoriesForModal(): SubCategory[] {
    return this.subCategories.filter(s => s.parentCategoryId === this.modalSelectedCategoryId);
  }

  get filteredBrands(): Brand[] {
    const term = this.searchTerm.trim().toLowerCase();
    let result = this.brands.filter(b => {
      const matchesSearch = !term ||
        b.name.toLowerCase().includes(term) ||
        b.description.toLowerCase().includes(term);

      const matchesStatus =
        this.statusFilter === 'all' ||
        b.status.toLowerCase() === this.statusFilter;

      let matchesCategory = true;
      if (this.selectedCategoryFilter !== 'all') {
        const cat = this.masterCategories.find(c => c.id === this.selectedCategoryFilter);
        const catName = cat ? cat.name : '';
        matchesCategory = b.categoryNames.includes(catName) || 
          b.categoryMappings?.some(m => m.categoryId === this.selectedCategoryFilter || m.categoryName === catName);
      }

      return matchesSearch && matchesStatus && matchesCategory;
    });

    result = [...result].sort((a, b) => {
      if (this.sortBy === 'skus_desc') return (b.totalProducts || 0) - (a.totalProducts || 0);
      if (this.sortBy === 'skus_asc') return (a.totalProducts || 0) - (b.totalProducts || 0);
      if (this.sortBy === 'name_asc') return a.name.localeCompare(b.name);
      return 0;
    });

    return result;
  }

  get paginatedBrands(): Brand[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredBrands.slice(start, start + this.pageSize);
  }

  get currentEndIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredBrands.length);
  }

  get isAllSelected(): boolean {
    const visible = this.paginatedBrands;
    if (visible.length === 0) return false;
    return visible.every(b => this.selectedIds.has(b.id));
  }

  // Filter controls
  setStatusFilter(status: 'all' | 'active' | 'inactive'): void {
    this.statusFilter = status;
    this.currentPage = 1;
  }

  onCategoryFilterChange(): void {
    this.currentPage = 1;
  }

  onSortChange(): void {
    this.currentPage = 1;
  }

  onSearchChange(): void {
    this.currentPage = 1;
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.currentPage = 1;
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedCategoryFilter = 'all';
    this.statusFilter = 'all';
    this.sortBy = 'skus_desc';
    this.currentPage = 1;
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
  }

  // Selection
  toggleSelectAll(event: any): void {
    const checked = event.target.checked;
    const visible = this.paginatedBrands;
    if (checked) {
      visible.forEach(b => this.selectedIds.add(b.id));
    } else {
      visible.forEach(b => this.selectedIds.delete(b.id));
    }
  }

  toggleSelect(id: string): void {
    if (this.selectedIds.has(id)) {
      this.selectedIds.delete(id);
    } else {
      this.selectedIds.add(id);
    }
  }

  isSelected(id: string): boolean {
    return this.selectedIds.has(id);
  }

  toggleStatus(b: Brand): void {
    b.status = b.status === 'Active' ? 'Inactive' : 'Active';
    this.triggerToast(`"${b.name}" status updated to ${b.status}`);
  }

  deleteBrand(brand: Brand): void {
    if (confirm(`Are you sure you want to delete brand "${brand.name}"?`)) {
      this.brands = this.brands.filter(b => b.id !== brand.id);
      this.triggerToast(`"${brand.name}" deleted successfully`);
    }
  }

  toggleModalSubCategory(subId: string) {
    const idx = this.modalSelectedSubCategoryIds.indexOf(subId);
    if (idx > -1) {
      this.modalSelectedSubCategoryIds.splice(idx, 1);
    } else {
      this.modalSelectedSubCategoryIds.push(subId);
    }
  }

  isSubSelected(subId: string): boolean {
    return this.modalSelectedSubCategoryIds.includes(subId);
  }

  openAddModal(content: any) {
    this.isEditMode = false;
    this.editingBrandId = null;
    this.modalSelectedCategoryId = 'CAT-02';
    this.modalSelectedSubCategoryIds = ['SUB-02-01'];
    this.newBrand = {
      name: '',
      origin: 'Local (Pakistan)',
      isVerified: true,
      isInHouse: false,
      status: 'Active',
      logo: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=100&auto=format&fit=crop&q=80',
      description: ''
    };
    this.modalService.open(content, { size: 'lg', centered: true });
  }

  openEditModal(brand: Brand, content: any) {
    this.isEditMode = true;
    this.editingBrandId = brand.id;
    this.newBrand = {
      name: brand.name,
      origin: brand.origin,
      isVerified: brand.isVerified,
      isInHouse: brand.isInHouse,
      status: brand.status,
      logo: brand.logo,
      description: brand.description
    };

    if (brand.categoryMappings && brand.categoryMappings.length > 0) {
      this.modalSelectedCategoryId = brand.categoryMappings[0].categoryId;
      this.modalSelectedSubCategoryIds = [...(brand.categoryMappings[0].subCategoryIds || [])];
    } else {
      const foundCat = this.masterCategories.find(c => brand.categoryNames.includes(c.name));
      this.modalSelectedCategoryId = foundCat ? foundCat.id : 'CAT-02';
      const foundSubs = this.subCategories.filter(s => 
        s.parentCategoryId === this.modalSelectedCategoryId && 
        brand.subCategoryNames?.includes(s.name)
      );
      this.modalSelectedSubCategoryIds = foundSubs.map(s => s.id);
    }

    this.modalService.open(content, { size: 'lg', centered: true });
  }

  saveBrand(modal: any) {
    if (!this.newBrand.name) {
      alert('Please enter a brand name.');
      return;
    }
    const cat = this.masterCategories.find(c => c.id === this.modalSelectedCategoryId);
    const catName = cat ? cat.name : 'Dairy, Bread & Eggs';
    const selectedSubs = this.subCategories.filter(s => this.modalSelectedSubCategoryIds.includes(s.id));
    const subNames = selectedSubs.map(s => s.name);

    const mapping: BrandCategoryMapping = {
      categoryId: this.modalSelectedCategoryId,
      categoryName: catName,
      subCategoryIds: [...this.modalSelectedSubCategoryIds],
      subCategoryNames: subNames
    };

    if (this.isEditMode && this.editingBrandId) {
      const idx = this.brands.findIndex(b => b.id === this.editingBrandId);
      if (idx !== -1) {
        this.brands[idx] = {
          ...this.brands[idx],
          name: this.newBrand.name,
          slug: this.newBrand.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          logo: this.newBrand.logo || this.brands[idx].logo,
          origin: (this.newBrand.origin as any) || this.brands[idx].origin,
          isInHouse: !!this.newBrand.isInHouse,
          categoryMappings: [mapping],
          categoryNames: [catName],
          subCategoryNames: subNames,
          description: this.newBrand.description || this.brands[idx].description,
          status: this.newBrand.status || this.brands[idx].status,
        };
        this.triggerToast(`"${this.newBrand.name}" updated successfully`);
      }
    } else {
      const newEntry: Brand = {
        id: `BRD-${Date.now().toString().slice(-4)}`,
        name: this.newBrand.name,
        slug: this.newBrand.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        logo: this.newBrand.logo || 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=100&auto=format&fit=crop&q=80',
        origin: (this.newBrand.origin as any) || 'Local (Pakistan)',
        isVerified: true,
        isInHouse: !!this.newBrand.isInHouse,
        categoryMappings: [mapping],
        categoryNames: [catName],
        subCategoryNames: subNames,
        totalProducts: 0,
        rating: 5.0,
        status: (this.newBrand.status as 'Active' | 'Inactive') || 'Active',
        description: this.newBrand.description || 'Verified manufacturer partner for Rainbow Superstores.'
      };
      this.brands.unshift(newEntry);
      this.triggerToast(`"${newEntry.name}" added successfully`);
    }

    modal.close();
  }

  // Export CSV
  exportCSV(): void {
    const headers = ['Brand ID', 'Name', 'Products', 'Status'];
    const rows = this.filteredBrands.map(b => [
      b.id,
      `"${b.name}"`,
      b.totalProducts,
      b.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rainbow_Brands_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.triggerToast('Brands exported to CSV successfully');
  }

  triggerToast(msg: string): void {
    this.toastMessage = msg;
    setTimeout(() => {
      if (this.toastMessage === msg) this.toastMessage = null;
    }, 3000);
  }

  onImageError(event: any): void {
    event.target.style.display = 'none';
  }
}
