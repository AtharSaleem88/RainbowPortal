import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';
import { NgbDropdownModule, NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { MASTER_CATEGORIES, SUB_CATEGORIES, MasterCategory, SubCategory } from '../data';
import { Categories } from './components/categories/categories';

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
  templateUrl: './category-list.html',
  styles: [`
    .cat-main-card {
      background: #ffffff;
      border: 1px solid #eaedf1;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
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

    .cat-avatar {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      background: #f8fafc;
      border: 1px solid #eaedf1;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      flex-shrink: 0;
    }

    .cat-code-badge {
      font-family: monospace;
      font-size: 11px;
      font-weight: 600;
      padding: 3px 8px;
      border-radius: 6px;
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      color: #334155;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      transition: all 0.15s ease;

      &:hover {
        background: #e0f2fe;
        border-color: #25aae1;
        color: #2e3192;
      }
    }

    .cat-sub-link {
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 11.5px;
      font-weight: 600;
      background: rgba(37, 170, 225, 0.08);
      color: #25aae1;
      border: 1px solid rgba(37, 170, 225, 0.2);
      cursor: pointer;
      transition: all 0.15s ease;

      &:hover {
        background: #25aae1;
        color: #ffffff;
        border-color: #25aae1;
      }
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
  `]
})
export class CategoryList implements OnInit {
  title = 'MASTER CATEGORIES';

  allCategories: MasterCategory[] = MASTER_CATEGORIES;
  allSubCategories: SubCategory[] = SUB_CATEGORIES;

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

  deleteCategory(cat: MasterCategory): void {
    if (confirm(`Are you sure you want to delete master category "${cat.name}"?`)) {
      this.allCategories = this.allCategories.filter(c => c.id !== cat.id);
      this.triggerToast(`"${cat.name}" removed from master categories`, 'warning');
    }
  }
}
