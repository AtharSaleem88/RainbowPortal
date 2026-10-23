import { showSaveSuccess, showSaveValidation } from '@shared/utils/save-alert';
import { confirmAction } from '@shared/utils/confirmation';
import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgbModal, NgbModalModule, NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { MASTER_CATEGORIES, SUB_CATEGORIES, SubCategory, MasterCategory } from '../data';
import { SubCategoryMetricsComponent } from './components/sub-category-metrics/sub-category-metrics.component';

@Component({
  selector: 'app-sub-category',
  standalone: true,
  imports: [
    CommonModule,
    DecimalPipe,
    FormsModule,
    RouterLink,
    NgbModalModule,
    NgbPaginationModule,
    NgbTooltipModule,
    SubCategoryMetricsComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './sub-category.component.html',
  styleUrl: './sub-category.component.scss',
})
export class SubCategoryComponent implements OnInit {
  title = 'Sub Categories';
  private route = inject(ActivatedRoute);
  private modalService = inject(NgbModal);

  masterCategories: MasterCategory[] = MASTER_CATEGORIES;
  allSubCategories: SubCategory[] = SUB_CATEGORIES;
  
  // View Mode: Table (default) or Cards
  viewMode: 'table' | 'cards' = 'table';

  selectedCategoryId: string = 'all';
  searchTerm: string = '';
  statusFilter: 'all' | 'active' | 'inactive' = 'all';
  sortBy: 'skus_desc' | 'skus_asc' | 'name_asc' = 'skus_desc';

  // Pagination
  currentPage: number = 1;
  pageSize: number = 10;

  // Selection
  selectedIds: Set<string> = new Set<string>();

  // Toast
  toastMessage: string | null = null;

  // Add/Edit SubCategory Model
  modalMode: 'add' | 'edit' = 'add';
  subCategoryForm: Partial<SubCategory> = {
    name: '',
    parentCategoryId: 'CAT-02',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=160&auto=format&fit=crop&q=80'
  };

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.selectedCategoryId = params['category'];
      }
    });
  }

  // Scroll Synchronization for Top Scrollbar
  onTopScroll(top: HTMLElement, table: HTMLElement): void {
    if (table && Math.abs(table.scrollLeft - top.scrollLeft) > 1) {
      table.scrollLeft = top.scrollLeft;
    }
  }

  onTableScroll(table: HTMLElement, top: HTMLElement): void {
    if (top && Math.abs(top.scrollLeft - table.scrollLeft) > 1) {
      top.scrollLeft = table.scrollLeft;
    }
  }

  get totalProducts(): number {
    return this.allSubCategories.reduce((acc, sub) => acc + (sub.totalProducts || 0), 0);
  }

  get subCategoryCounts() {
    return {
      all: this.allSubCategories.length,
      active: this.allSubCategories.filter(s => s.status === 'Active').length,
      inactive: this.allSubCategories.filter(s => s.status === 'Inactive').length
    };
  }

  get activeSubCount(): number {
    return this.allSubCategories.filter(s => s.status === 'Active').length;
  }

  get filteredSubCategories(): SubCategory[] {
    const term = this.searchTerm.trim().toLowerCase();
    let result = this.allSubCategories.filter(sub => {
      const matchesCategory = this.selectedCategoryId === 'all' || sub.parentCategoryId === this.selectedCategoryId;
      const matchesSearch = !term ||
        sub.name.toLowerCase().includes(term) ||
        sub.parentCategoryName.toLowerCase().includes(term) ||
        sub.slug.toLowerCase().includes(term);

      const matchesStatus =
        this.statusFilter === 'all' ||
        sub.status.toLowerCase() === this.statusFilter;

      return matchesCategory && matchesSearch && matchesStatus;
    });

    result = [...result].sort((a, b) => {
      if (this.sortBy === 'skus_desc') return (b.totalProducts || 0) - (a.totalProducts || 0);
      if (this.sortBy === 'skus_asc') return (a.totalProducts || 0) - (b.totalProducts || 0);
      if (this.sortBy === 'name_asc') return a.name.localeCompare(b.name);
      return 0;
    });

    return result;
  }

  get paginatedSubCategories(): SubCategory[] {
    const list = this.filteredSubCategories;
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return list.slice(startIndex, startIndex + this.pageSize);
  }

  get currentEndIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredSubCategories.length);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredSubCategories.length / this.pageSize) || 1;
  }

  get isAllSelected(): boolean {
    const visible = this.paginatedSubCategories;
    if (visible.length === 0) return false;
    return visible.every(s => this.selectedIds.has(s.id));
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
    this.selectedCategoryId = 'all';
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

  // Selection Handlers
  toggleSelectAll(event: any) {
    const checked = event.target.checked;
    const visible = this.paginatedSubCategories;
    if (checked) {
      visible.forEach(s => this.selectedIds.add(s.id));
    } else {
      visible.forEach(s => this.selectedIds.delete(s.id));
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

  toggleStatus(sub: SubCategory) {
    sub.status = sub.status === 'Active' ? 'Inactive' : 'Active';
    this.triggerToast(`"${sub.name}" status updated to ${sub.status}`);
  }

  async deleteSubCategory(sub: SubCategory): Promise<void> {
    if (await confirmAction(`Are you sure you want to delete subcategory "${sub.name}"?`)) {
      this.allSubCategories = this.allSubCategories.filter(s => s.id !== sub.id);
      this.triggerToast(`"${sub.name}" deleted successfully`);
    }
  }

  // Modal Handlers
  openAddModal(content: any) {
    this.modalMode = 'add';
    this.subCategoryForm = {
      name: '',
      parentCategoryId: this.selectedCategoryId !== 'all' ? this.selectedCategoryId : 'CAT-02',
      status: 'Active',
      image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=160&auto=format&fit=crop&q=80'
    };
    this.modalService.open(content, { centered: true });
  }

  openEditModal(sub: SubCategory, content: any) {
    this.modalMode = 'edit';
    this.subCategoryForm = {
      id: sub.id,
      name: sub.name,
      parentCategoryId: sub.parentCategoryId,
      status: sub.status,
      image: sub.image
    };
    this.modalService.open(content, { centered: true });
  }

  saveSubCategory(modal: any) {
    if (!this.subCategoryForm.name) {
      void showSaveValidation('Please enter a subcategory name.');
      return;
    }
    const parentCat = this.masterCategories.find(c => c.id === this.subCategoryForm.parentCategoryId);
    const parentName = parentCat ? parentCat.name : 'Master Department';

    if (this.modalMode === 'add') {
      const newEntry: SubCategory = {
        id: `SUB-${Date.now().toString().slice(-4)}`,
        name: this.subCategoryForm.name,
        slug: this.subCategoryForm.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        parentCategoryId: this.subCategoryForm.parentCategoryId || 'CAT-02',
        parentCategoryName: parentName,
        image: this.subCategoryForm.image || 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=160&auto=format&fit=crop&q=80',
        icon: 'solar:box-bold-duotone',
        subSubCategoryCount: 0,
        totalProducts: 0,
        status: (this.subCategoryForm.status as 'Active' | 'Inactive') || 'Active'
      };
      this.allSubCategories.unshift(newEntry);
      void showSaveSuccess(`Subcategory "${newEntry.name}" created successfully`);
    } else {
      const index = this.allSubCategories.findIndex(s => s.id === this.subCategoryForm.id);
      if (index !== -1) {
        this.allSubCategories[index] = {
          ...this.allSubCategories[index],
          name: this.subCategoryForm.name,
          slug: this.subCategoryForm.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          parentCategoryId: this.subCategoryForm.parentCategoryId || this.allSubCategories[index].parentCategoryId,
          parentCategoryName: parentName,
          image: this.subCategoryForm.image || this.allSubCategories[index].image,
          status: (this.subCategoryForm.status as 'Active' | 'Inactive') || 'Active'
        };
        void showSaveSuccess(`Subcategory "${this.subCategoryForm.name}" updated successfully`);
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

  onImageError(event: any): void {
    event.target.style.display = 'none';
  }
}

export { SubCategoryComponent as SubCategoryList, SubCategoryComponent as SubCategory };
