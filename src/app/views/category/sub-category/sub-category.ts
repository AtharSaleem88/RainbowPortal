import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgbModal, NgbModalModule, NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { MASTER_CATEGORIES, SUB_CATEGORIES, SubCategory, MasterCategory } from '../data';

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
    NgbTooltipModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './sub-category.html',
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
    .cat-avatar {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      overflow: hidden;
      flex-shrink: 0;
      border: 1px solid #eaedf1;
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
  `]
})
export class SubCategoryList implements OnInit {
  private route = inject(ActivatedRoute);
  private modalService = inject(NgbModal);

  masterCategories: MasterCategory[] = MASTER_CATEGORIES;
  allSubCategories: SubCategory[] = SUB_CATEGORIES;
  
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
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredSubCategories.slice(start, start + this.pageSize);
  }

  get currentEndIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredSubCategories.length);
  }

  get isAllSelected(): boolean {
    const visible = this.paginatedSubCategories;
    if (visible.length === 0) return false;
    return visible.every(s => this.selectedIds.has(s.id));
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
    this.selectedCategoryId = 'all';
    this.statusFilter = 'all';
    this.sortBy = 'skus_desc';
    this.currentPage = 1;
  }

  onCategoryFilterChange(): void {
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
    const visible = this.paginatedSubCategories;
    if (checked) {
      visible.forEach(s => this.selectedIds.add(s.id));
    } else {
      visible.forEach(s => this.selectedIds.delete(s.id));
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

  // Status toggle
  toggleStatus(sub: SubCategory) {
    sub.status = sub.status === 'Active' ? 'Inactive' : 'Active';
    this.triggerToast(`"${sub.name}" status updated to ${sub.status}`);
  }

  // Delete
  deleteSubCategory(sub: SubCategory): void {
    if (confirm(`Are you sure you want to delete subcategory "${sub.name}"?`)) {
      this.allSubCategories = this.allSubCategories.filter(s => s.id !== sub.id);
      this.triggerToast(`"${sub.name}" deleted successfully`);
    }
  }

  // Modal actions
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
    this.subCategoryForm = { ...sub };
    this.modalService.open(content, { centered: true });
  }

  saveSubCategory(modal: any) {
    if (!this.subCategoryForm.name) {
      alert('Please enter a subcategory name.');
      return;
    }
    const parent = this.masterCategories.find(c => c.id === this.subCategoryForm.parentCategoryId);
    const parentName = parent ? parent.name : 'Dairy, Bread & Eggs';

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
      this.triggerToast(`Subcategory "${newEntry.name}" created successfully`);
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
        this.triggerToast(`Subcategory "${this.subCategoryForm.name}" updated successfully`);
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
