import { confirmAction } from '@shared/utils/confirmation';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';
import { NgbDropdownModule, NgbModal, NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { MASTER_CATEGORIES, SUB_CATEGORIES, MasterCategory, SubCategory } from '../data';
import { Categories } from './components/categories/categories';
import { CategoryAddComponent } from '../category-add/category-add.component';
import { CategoryEditComponent } from '../category-edit/category-edit.component';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [
    CommonModule,
    DecimalPipe,
    FormsModule,
    RouterLink,
    RouterModule,
    Categories,
    NgbDropdownModule,
    NgbPaginationModule,
    NgbTooltipModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss',
})
export class CategoryListComponent implements OnInit {
  title = 'MASTER CATEGORIES';
  private modalService = inject(NgbModal);

  openEditCategory(category: MasterCategory): void {
    const modal = this.modalService.open(CategoryEditComponent, {
      size: 'lg',
      centered: true,
      scrollable: true,
      backdrop: 'static',
      ariaLabelledBy: 'edit-master-category-title',
    });
    modal.componentInstance.category = { ...category };
    modal.result.then((updated: MasterCategory) => {
      this.allCategories = this.allCategories.map(item => item.id === updated.id ? updated : item);
    }, () => {});
  }

  openAddCategory(): void {
    const modal = this.modalService.open(CategoryAddComponent, {
      size: 'lg',
      centered: true,
      scrollable: true,
      backdrop: 'static',
      ariaLabelledBy: 'add-master-category-title',
    });
    modal.result.then((category: MasterCategory) => {
      if (!this.allCategories.includes(category)) {
        this.allCategories = [category, ...this.allCategories];
      }
    }, () => {});
  }

  allCategories: MasterCategory[] = MASTER_CATEGORIES;
  allSubCategories: SubCategory[] = SUB_CATEGORIES;

  // View Mode: Table (default) or Cards
  viewMode: 'table' | 'cards' = 'table';

  // Filter & Search
  searchTerm: string = '';
  statusFilter: 'all' | 'active' | 'inactive' = 'all';
  sortBy: 'skus_desc' | 'skus_asc' | 'subcats_desc' | 'name_asc' = 'skus_desc';

  // Pagination
  currentPage: number = 1;
  pageSize: number = 10;

  // Selection
  selectedIds: Set<string> = new Set<string>();

  // Feedback notifications
  toastMessage: string | null = null;
  toastType: 'success' | 'info' | 'warning' = 'success';

  ngOnInit(): void {
    // Initial setup
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

  get categoryCounts() {
    return {
      all: this.allCategories.length,
      active: this.allCategories.filter(c => c.status === 'Active').length,
      inactive: this.allCategories.filter(c => c.status === 'Inactive').length
    };
  }

  get filteredCategories(): MasterCategory[] {
    const term = this.searchTerm.trim().toLowerCase();
    let result = this.allCategories.filter(cat => {
      const matchesSearch = !term ||
        cat.name.toLowerCase().includes(term) ||
        cat.description.toLowerCase().includes(term);

      const matchesStatus =
        this.statusFilter === 'all' ||
        cat.status.toLowerCase() === this.statusFilter;

      return matchesSearch && matchesStatus;
    });

    // Sorting
    result = [...result].sort((a, b) => {
      if (this.sortBy === 'skus_desc') return (b.totalProducts || 0) - (a.totalProducts || 0);
      if (this.sortBy === 'skus_asc') return (a.totalProducts || 0) - (b.totalProducts || 0);
      if (this.sortBy === 'subcats_desc') return (b.subCategoryCount || 0) - (a.subCategoryCount || 0);
      if (this.sortBy === 'name_asc') return a.name.localeCompare(b.name);
      return 0;
    });

    return result;
  }

  get paginatedCategories(): MasterCategory[] {
    const list = this.filteredCategories;
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return list.slice(startIndex, startIndex + this.pageSize);
  }

  get currentEndIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredCategories.length);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredCategories.length / this.pageSize) || 1;
  }

  get isAllSelected(): boolean {
    const visible = this.paginatedCategories;
    if (visible.length === 0) return false;
    return visible.every(c => this.selectedIds.has(c.id));
  }

  get selectedCount(): number {
    return this.selectedIds.size;
  }

  // Filter & Search Controls
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
    this.statusFilter = 'all';
    this.sortBy = 'skus_desc';
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

  // Selection Handlers
  toggleSelectAll(event: any): void {
    const checked = event.target.checked;
    const visible = this.paginatedCategories;
    if (checked) {
      visible.forEach(c => this.selectedIds.add(c.id));
    } else {
      visible.forEach(c => this.selectedIds.delete(c.id));
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

  clearSelection(): void {
    this.selectedIds.clear();
  }

  bulkActivate(): void {
    this.allCategories.forEach(c => {
      if (this.selectedIds.has(c.id)) c.status = 'Active';
    });
    this.triggerToast(`${this.selectedIds.size} departments activated`, 'success');
    this.clearSelection();
  }

  bulkDeactivate(): void {
    this.allCategories.forEach(c => {
      if (this.selectedIds.has(c.id)) c.status = 'Inactive';
    });
    this.triggerToast(`${this.selectedIds.size} departments set to Inactive`, 'warning');
    this.clearSelection();
  }

  // Status Toggle
  toggleStatus(cat: MasterCategory, event: Event): void {
    event.stopPropagation();
    cat.status = cat.status === 'Active' ? 'Inactive' : 'Active';
    this.triggerToast(`"${cat.name}" status updated to ${cat.status}`, 'info');
  }

  // Export CSV
  exportCSV(): void {
    const headers = ['Department ID', 'Name', 'Subcategories', 'Total SKUs', 'Created By', 'Status'];
    const rows = this.filteredCategories.map(c => [
      c.id,
      `"${c.name}"`,
      c.subCategoryCount,
      c.totalProducts,
      c.createdBy,
      c.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rainbow_Master_Categories_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.triggerToast('Master categories exported to CSV successfully', 'success');
  }

  // Toast Trigger
  triggerToast(message: string, type: 'success' | 'info' | 'warning' = 'success'): void {
    this.toastMessage = message;
    this.toastType = type;
    setTimeout(() => {
      if (this.toastMessage === message) this.toastMessage = null;
    }, 3500);
  }

  // Calculate percentage of highest category
  getRelativeWidth(products: number): number {
    return Math.min(100, Math.round((products / 342) * 100));
  }

  // Fallback for image load failure
  onImageError(event: any): void {
    event.target.style.display = 'none';
  }

  async deleteCategory(cat: MasterCategory): Promise<void> {
    if (await confirmAction(`Are you sure you want to delete master category "${cat.name}"?`)) {
      this.allCategories = this.allCategories.filter(c => c.id !== cat.id);
      this.triggerToast(`"${cat.name}" removed from master categories`, 'warning');
    }
  }
}

export { CategoryListComponent as CategoryList };
