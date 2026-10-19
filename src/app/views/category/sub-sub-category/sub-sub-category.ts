import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgbModal, NgbModalModule, NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { MASTER_CATEGORIES, SUB_CATEGORIES, SUB_SUB_CATEGORIES, SubSubCategory, SubCategory, MasterCategory } from '../data';

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
    NgbTooltipModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './sub-sub-category.html',
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
export class SubSubCategoryList implements OnInit {
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

  deleteSubSub(item: SubSubCategory): void {
    if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
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
      alert('Please enter a sub-sub category name.');
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
      this.triggerToast(`"${newEntry.name}" created successfully`);
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
        this.triggerToast(`"${this.subSubForm.name}" updated successfully`);
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
