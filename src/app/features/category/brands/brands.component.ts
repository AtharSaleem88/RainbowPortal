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

  async deleteBrand(brand: Brand): Promise<void> {
    if (await confirmAction(`Are you sure you want to delete brand "${brand.name}"?`)) {
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
      void showSaveValidation('Please enter a brand name.');
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
        void showSaveSuccess(`"${this.newBrand.name}" updated successfully`);
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
