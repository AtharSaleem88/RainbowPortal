import { showSaveSuccess, showSaveValidation } from '@shared/utils/save-alert';
import { confirmAction } from '@shared/utils/confirmation';
import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgbModal, NgbModalModule, NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { BRANDS, Brand, MASTER_CATEGORIES, SUB_CATEGORIES, MasterCategory, SubCategory, BrandCategoryMapping } from '../data';
import { BrandMetricsComponent } from './components/brand-metrics/brand-metrics.component';

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
    NgbTooltipModule,
    BrandMetricsComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.scss',
})
export class BrandsComponent implements OnInit {
  title = 'Supermarket Brands & Labels';
  private modalService = inject(NgbModal);

  brands: Brand[] = BRANDS;
  masterCategories: MasterCategory[] = MASTER_CATEGORIES;
  subCategories: SubCategory[] = SUB_CATEGORIES;

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
        (b.description && b.description.toLowerCase().includes(term));

      const matchesStatus =
        this.statusFilter === 'all' ||
        b.status.toLowerCase() === this.statusFilter;

      const matchesCategory =
        this.selectedCategoryFilter === 'all' ||
        b.categoryMappings.some(m => m.categoryId === this.selectedCategoryFilter);

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
    const list = this.filteredBrands;
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return list.slice(startIndex, startIndex + this.pageSize);
  }

  get currentEndIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredBrands.length);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredBrands.length / this.pageSize) || 1;
  }

  get isAllSelected(): boolean {
    const visible = this.paginatedBrands;
    if (visible.length === 0) return false;
    return visible.every(b => this.selectedIds.has(b.id));
  }

  get selectedCount(): number {
    return this.selectedIds.size;
  }

  // Filter & Search Controls
  setStatusFilter(status: 'all' | 'active' | 'inactive') {
    this.statusFilter = status;
    this.currentPage = 1;
  }

  onCategoryFilterChange() {
    this.currentPage = 1;
  }

  onSearchChange() {
    this.currentPage = 1;
  }

  clearSearch() {
    this.searchTerm = '';
    this.currentPage = 1;
  }

  resetFilters() {
    this.searchTerm = '';
    this.statusFilter = 'all';
    this.selectedCategoryFilter = 'all';
    this.sortBy = 'skus_desc';
    this.currentPage = 1;
  }

  onSortChange() {
    this.currentPage = 1;
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }

  onPageSizeChange(size: number) {
    this.pageSize = size;
    this.currentPage = 1;
  }

  // Selection
  toggleSelectAll(event: any) {
    const checked = event.target.checked;
    const visible = this.paginatedBrands;
    if (checked) {
      visible.forEach(b => this.selectedIds.add(b.id));
    } else {
      visible.forEach(b => this.selectedIds.delete(b.id));
    }
  }

  toggleSelect(id: string) {
    if (this.selectedIds.has(id)) {
      this.selectedIds.delete(id);
    } else {
      this.selectedIds.add(id);
    }
  }

  isSelected(id: string): boolean {
    return this.selectedIds.has(id);
  }

  clearSelection() {
    this.selectedIds.clear();
  }

  toggleStatus(b: Brand) {
    b.status = b.status === 'Active' ? 'Inactive' : 'Active';
    this.triggerToast(`"${b.name}" status updated to ${b.status}`);
  }

  async deleteBrand(b: Brand): Promise<void> {
    if (await confirmAction(`Are you sure you want to remove brand "${b.name}"?`)) {
      this.brands = this.brands.filter(item => item.id !== b.id);
      this.triggerToast(`"${b.name}" removed successfully`);
    }
  }

  // Modal handlers
  openAddModal(content: any) {
    this.isEditMode = false;
    this.editingBrandId = null;
    this.newBrand = {
      name: '',
      origin: 'Local (Pakistan)',
      isVerified: true,
      isInHouse: false,
      status: 'Active',
      logo: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=100&auto=format&fit=crop&q=80',
      description: ''
    };
    this.modalSelectedCategoryId = this.masterCategories[0]?.id || 'CAT-01';
    const firstSub = this.subCategories.find(s => s.parentCategoryId === this.modalSelectedCategoryId);
    this.modalSelectedSubCategoryIds = firstSub ? [firstSub.id] : [];
    this.modalService.open(content, { size: 'lg', centered: true });
  }

  openEditModal(b: Brand, content: any) {
    this.isEditMode = true;
    this.editingBrandId = b.id;
    this.newBrand = { ...b };
    const firstMapping = b.categoryMappings[0];
    if (firstMapping) {
      this.modalSelectedCategoryId = firstMapping.categoryId;
      this.modalSelectedSubCategoryIds = [...firstMapping.subCategoryIds];
    } else {
      this.modalSelectedCategoryId = this.masterCategories[0]?.id || 'CAT-01';
      this.modalSelectedSubCategoryIds = [];
    }
    this.modalService.open(content, { size: 'lg', centered: true });
  }

  toggleModalSubCategory(subId: string) {
    if (this.modalSelectedSubCategoryIds.includes(subId)) {
      this.modalSelectedSubCategoryIds = this.modalSelectedSubCategoryIds.filter(id => id !== subId);
    } else {
      this.modalSelectedSubCategoryIds.push(subId);
    }
  }

  isSubSelected(subId: string): boolean {
    return this.modalSelectedSubCategoryIds.includes(subId);
  }

  saveBrand(modal: any) {
    if (!this.newBrand.name) {
      void showSaveValidation('Please provide a valid brand name.');
      return;
    }
    const cat = this.masterCategories.find(c => c.id === this.modalSelectedCategoryId);
    const catName = cat ? cat.name : 'Master Department';
    const subNames = this.subCategories
      .filter(s => this.modalSelectedSubCategoryIds.includes(s.id))
      .map(s => s.name);

    const mapping: BrandCategoryMapping = {
      categoryId: this.modalSelectedCategoryId,
      categoryName: catName,
      subCategoryIds: [...this.modalSelectedSubCategoryIds],
      subCategoryNames: subNames
    };

    if (this.isEditMode && this.editingBrandId) {
      const index = this.brands.findIndex(b => b.id === this.editingBrandId);
      if (index !== -1) {
        this.brands[index] = {
          ...this.brands[index],
          ...this.newBrand,
          categoryMappings: [mapping],
          categoryNames: [catName],
          subCategoryNames: subNames
        } as Brand;
        void showSaveSuccess(`"${this.newBrand.name}" updated successfully`);
      }
    } else {
      const newEntry: Brand = {
        id: `BR-${Date.now().toString().slice(-4)}`,
        name: this.newBrand.name,
        slug: this.newBrand.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        logo: this.newBrand.logo || 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=100&auto=format&fit=crop&q=80',
        origin: this.newBrand.origin || 'Local (Pakistan)',
        isVerified: this.newBrand.isVerified ?? true,
        isInHouse: this.newBrand.isInHouse ?? false,
        status: (this.newBrand.status as 'Active' | 'Inactive') || 'Active',
        categoryMappings: [mapping],
        categoryNames: [catName],
        subCategoryNames: subNames,
        rating: 4.8,
        totalProducts: 0,
        description: this.newBrand.description || 'Verified manufacturer partner for Rainbow Superstores.'
      };
      this.brands.unshift(newEntry);
      void showSaveSuccess(`"${newEntry.name}" added successfully`);
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

export { BrandsComponent as BrandList, BrandsComponent as Brands };
