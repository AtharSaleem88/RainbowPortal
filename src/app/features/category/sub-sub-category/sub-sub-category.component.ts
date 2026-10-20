import { showSaveSuccess, showSaveValidation } from '@shared/utils/save-alert';
import { confirmAction } from '@shared/utils/confirmation';
import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgbModal, NgbModalModule, NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { MASTER_CATEGORIES, SUB_CATEGORIES, SUB_SUB_CATEGORIES, SubSubCategory, SubCategory, MasterCategory } from '../data';
import { SubSubCategoryMetricsComponent } from './components/sub-sub-category-metrics/sub-sub-category-metrics.component';

@Component({
  selector: 'app-sub-sub-category',
  standalone: true,
  imports: [
    CommonModule,
    DecimalPipe,
    FormsModule,
    RouterLink,
    NgbModalModule,
    NgbPaginationModule,
    NgbTooltipModule,
    SubSubCategoryMetricsComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './sub-sub-category.component.html',
  styleUrl: './sub-sub-category.component.scss',
})
export class SubSubCategoryComponent implements OnInit {
  title = 'Sub-Sub Categories';
  private route = inject(ActivatedRoute);
  private modalService = inject(NgbModal);

  masterCategories: MasterCategory[] = MASTER_CATEGORIES;
  subCategories: SubCategory[] = SUB_CATEGORIES;
  allSubSubCategories: SubSubCategory[] = SUB_SUB_CATEGORIES;

  selectedSubCategoryId: string = 'all';
  statusFilter: 'all' | 'active' | 'inactive' = 'all';
  searchTerm: string = '';
  sortBy: 'skus_desc' | 'skus_asc' | 'name_asc' = 'skus_desc';

  // Pagination
  currentPage: number = 1;
  pageSize: number = 10;

  // Selection
  selectedIds: Set<string> = new Set<string>();

  // Toast
  toastMessage: string | null = null;

  // Modal Model
  modalMode: 'add' | 'edit' = 'add';
  modalCategoryId: string = 'CAT-01';
  subSubForm: Partial<SubSubCategory> = {
    name: '',
    subCategoryId: 'SUB-01-01',
    status: 'Active'
  };

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['subcategory']) {
        this.selectedSubCategoryId = params['subcategory'];
      }
    });
  }

  get modalSubCategories(): SubCategory[] {
    return this.subCategories.filter(s => s.parentCategoryId === this.modalCategoryId);
  }

  onModalCategoryChange(): void {
    const subs = this.modalSubCategories;
    this.subSubForm.subCategoryId = subs[0]?.id || '';
  }

  get totalProducts(): number {
    return this.allSubSubCategories.reduce((acc, item) => acc + (item.totalProducts || 0), 0);
  }

  get subSubCategoryCounts() {
    return {
      all: this.allSubSubCategories.length,
      active: this.allSubSubCategories.filter(s => s.status === 'Active').length,
      inactive: this.allSubSubCategories.filter(s => s.status === 'Inactive').length
    };
  }

  get activeSubSubCount(): number {
    return this.allSubSubCategories.filter(s => s.status === 'Active').length;
  }

  get filteredList(): SubSubCategory[] {
    const term = this.searchTerm.trim().toLowerCase();
    let result = this.allSubSubCategories.filter(item => {
      const matchesSub = this.selectedSubCategoryId === 'all' || item.subCategoryId === this.selectedSubCategoryId;
      const matchesSearch = !term ||
        item.name.toLowerCase().includes(term) ||
        item.subCategoryName.toLowerCase().includes(term) ||
        item.parentCategoryName.toLowerCase().includes(term) ||
        item.slug.toLowerCase().includes(term);

      const matchesStatus =
        this.statusFilter === 'all' ||
        item.status.toLowerCase() === this.statusFilter;

      return matchesSub && matchesSearch && matchesStatus;
    });

    result = [...result].sort((a, b) => {
      if (this.sortBy === 'skus_desc') return (b.totalProducts || 0) - (a.totalProducts || 0);
      if (this.sortBy === 'skus_asc') return (a.totalProducts || 0) - (b.totalProducts || 0);
      if (this.sortBy === 'name_asc') return a.name.localeCompare(b.name);
      return 0;
    });

    return result;
  }

  get paginatedList(): SubSubCategory[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredList.slice(start, start + this.pageSize);
  }

  get currentEndIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredList.length);
  }

  get isAllSelected(): boolean {
    const visible = this.paginatedList;
    if (visible.length === 0) return false;
    return visible.every(item => this.selectedIds.has(item.id));
  }

  // Filter controls
  setStatusFilter(status: 'all' | 'active' | 'inactive'): void {
    this.statusFilter = status;
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
    this.selectedSubCategoryId = 'all';
    this.statusFilter = 'all';
    this.sortBy = 'skus_desc';
    this.currentPage = 1;
  }

  onSubCategoryFilterChange(): void {
    this.currentPage = 1;
  }

  onSortChange(): void {
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
    const visible = this.paginatedList;
    if (checked) {
      visible.forEach(i => this.selectedIds.add(i.id));
    } else {
      visible.forEach(i => this.selectedIds.delete(i.id));
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

  toggleStatus(item: SubSubCategory) {
    item.status = item.status === 'Active' ? 'Inactive' : 'Active';
    this.triggerToast(`"${item.name}" status updated to ${item.status}`);
  }

  async deleteSubSub(item: SubSubCategory): Promise<void> {
    if (await confirmAction(`Are you sure you want to delete "${item.name}"?`)) {
      this.allSubSubCategories = this.allSubSubCategories.filter(i => i.id !== item.id);
      this.triggerToast(`"${item.name}" deleted successfully`);
    }
  }

  // Modal
  openAddModal(content: any) {
    this.modalMode = 'add';
    if (this.selectedSubCategoryId !== 'all') {
      const sub = this.subCategories.find(s => s.id === this.selectedSubCategoryId);
      this.modalCategoryId = sub?.parentCategoryId || this.masterCategories[0]?.id || 'CAT-01';
      this.subSubForm = {
        name: '',
        subCategoryId: this.selectedSubCategoryId,
        status: 'Active'
      };
    } else {
      this.modalCategoryId = this.masterCategories[0]?.id || 'CAT-01';
      this.subSubForm = {
        name: '',
        subCategoryId: this.modalSubCategories[0]?.id || '',
        status: 'Active'
      };
    }
    this.modalService.open(content, { centered: true });
  }

  openEditModal(item: SubSubCategory, content: any) {
    this.modalMode = 'edit';
    const sub = this.subCategories.find(s => s.id === item.subCategoryId);
    this.modalCategoryId = sub?.parentCategoryId || item.parentCategoryId || this.masterCategories[0]?.id || 'CAT-01';
    this.subSubForm = {
      id: item.id,
      name: item.name,
      subCategoryId: item.subCategoryId,
      status: item.status
    };
    this.modalService.open(content, { centered: true });
  }

  saveSubSub(modal: any) {
    if (!this.subSubForm.name) {
      void showSaveValidation('Please enter a sub-sub category name.');
      return;
    }
    const parentSub = this.subCategories.find(s => s.id === this.subSubForm.subCategoryId);
    const parentSubName = parentSub ? parentSub.name : 'Subcategory';
    const parentCat = this.masterCategories.find(c => c.id === this.modalCategoryId) ||
                      this.masterCategories.find(c => c.id === parentSub?.parentCategoryId);
    const parentCatId = parentCat ? parentCat.id : (parentSub ? parentSub.parentCategoryId : 'CAT-01');
    const parentCatName = parentCat ? parentCat.name : (parentSub ? parentSub.parentCategoryName : 'Master Category');

    if (this.modalMode === 'add') {
      const newEntry: SubSubCategory = {
        id: `SSC-${Date.now().toString().slice(-4)}`,
        name: this.subSubForm.name,
        slug: this.subSubForm.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        parentCategoryId: parentCatId,
        parentCategoryName: parentCatName,
        subCategoryId: this.subSubForm.subCategoryId || parentSub?.id || 'SUB-01-01',
        subCategoryName: parentSubName,
        tags: [],
        totalProducts: 0,
        status: (this.subSubForm.status as 'Active' | 'Inactive') || 'Active'
      };
      this.allSubSubCategories.unshift(newEntry);
      void showSaveSuccess(`"${newEntry.name}" created successfully`);
    } else {
      const index = this.allSubSubCategories.findIndex(i => i.id === this.subSubForm.id);
      if (index !== -1) {
        this.allSubSubCategories[index] = {
          ...this.allSubSubCategories[index],
          name: this.subSubForm.name,
          slug: this.subSubForm.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          subCategoryId: this.subSubForm.subCategoryId || this.allSubSubCategories[index].subCategoryId,
          subCategoryName: parentSubName,
          parentCategoryId: parentCatId,
          parentCategoryName: parentCatName,
          tags: this.allSubSubCategories[index].tags || [],
          status: (this.subSubForm.status as 'Active' | 'Inactive') || 'Active'
        };
        void showSaveSuccess(`"${this.subSubForm.name}" updated successfully`);
      }
    }

    modal.close();
  }

  triggerToast(msg: string): void {
    this.toastMessage = msg;
    setTimeout(() => {
      if (this.toastMessage === msg) this.toastMessage = null;
    }, 3000);
  }
}

export { SubSubCategoryComponent as SubSubCategoryList, SubSubCategoryComponent as SubSubCategory };
