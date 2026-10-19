import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductList, ProductType, RAINBOW_SUPERSTORE_BRANCHES, BranchStock } from '../data';
import { NgbDropdownModule, NgbPaginationModule, NgbModal, NgbModalModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbPaginationModule, NgbDropdownModule, NgbModalModule, NgbTooltipModule, RouterLink],
  templateUrl: './list.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: [`
    /* Container & Cards */
    .cat-main-card {
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(15, 23, 42, 0.05);
      background: #ffffff;
      overflow: hidden;
    }
    .cat-metric-card {
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
      background: #ffffff;
      padding: 16px 18px;
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

    /* Toolbar Segmented Controls */
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

    /* Search & Page Size Inputs */
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
      color: #334155;
      font-weight: 500;
      padding-left: 10px;
      padding-right: 28px;
      background-color: #ffffff;
      cursor: pointer;
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
        padding: 12px 16px;
        user-select: none;
      }
      td {
        padding: 13px 16px;
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

    /* Product Avatar */
    .prod-avatar-box {
      width: 44px;
      height: 44px;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
      background: #ffffff;
      padding: 2px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      flex-shrink: 0;

      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        border-radius: 6px;
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

      &.btn-geo:hover {
        background: #ecfdf5;
        color: #059669;
        border-color: #a7f3d0;
      }
    }

    .font-jost {
      font-family: 'Jost', -apple-system, BlinkMacSystemFont, sans-serif;
    }
  `]
})
export class List implements OnInit {
  private modalService = inject(NgbModal);

  products: ProductType[] = ProductList;
  branches = RAINBOW_SUPERSTORE_BRANCHES;

  selectedBranchId: string = 'all';
  selectedCategory: string = 'all';
  selectedStorage: string = 'all';
  stockFilter: 'all' | 'in_stock' | 'out_of_stock' = 'all';
  searchTerm: string = '';
  sortBy: 'stock_desc' | 'stock_asc' | 'price_desc' | 'price_asc' | 'name_asc' = 'stock_desc';

  // Pagination
  currentPage: number = 1;
  pageSize: number = 10;

  // Selection
  selectedIds: Set<string> = new Set<string>();

  // Toast feedback
  toastMessage: string | null = null;
  toastType: 'success' | 'info' | 'warning' = 'success';

  // Selected product for Branch Geolocation Stock Modal
  activeModalProduct: ProductType | null = null;
  customerLat: number = 24.8607;
  customerLng: number = 67.0011;
  nearestDetectedBranch: string = 'Branch 02 - Clifton Superstore (Ocean Mall)';

  ngOnInit(): void {}

  // Metrics getters
  get totalProductsCount(): number {
    return this.products.length;
  }

  get totalStockUnits(): number {
    return this.products.reduce((acc, p) => acc + (p.items_left || 0), 0);
  }

  get inStockCount(): number {
    return this.products.filter(p => (p.items_left || 0) > 0).length;
  }

  get outStockCount(): number {
    return this.products.filter(p => (p.items_left || 0) === 0).length;
  }

  get inHouseBrandCount(): number {
    return this.products.filter(p => p.brand.toLowerCase().includes('rainbow')).length;
  }

  // Filtered products
  get filteredProducts(): ProductType[] {
    const term = this.searchTerm.trim().toLowerCase();

    let result = this.products.filter(item => {
      const matchesSearch = !term ||
        item.name.toLowerCase().includes(term) ||
        (item.barcode && item.barcode.toLowerCase().includes(term)) ||
        (item.sku && item.sku.toLowerCase().includes(term)) ||
        item.brand.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term) ||
        (item.subCategory && item.subCategory.toLowerCase().includes(term)) ||
        (item.labels && item.labels.some(l => l.toLowerCase().includes(term)));

      const matchesCategory = this.selectedCategory === 'all' || item.category === this.selectedCategory;
      const matchesStorage = this.selectedStorage === 'all' || (item.storageType && item.storageType.toLowerCase() === this.selectedStorage.toLowerCase());

      let matchesStock = true;
      if (this.stockFilter === 'in_stock') {
        matchesStock = (item.items_left || 0) > 0;
      } else if (this.stockFilter === 'out_of_stock') {
        matchesStock = (item.items_left || 0) === 0;
      }

      let matchesBranch = true;
      if (this.selectedBranchId !== 'all') {
        const branchStock = item.branchStock?.find(b => b.branchId === this.selectedBranchId);
        matchesBranch = !!branchStock && branchStock.inStock;
      }

      return matchesSearch && matchesCategory && matchesStorage && matchesStock && matchesBranch;
    });

    result = [...result].sort((a, b) => {
      if (this.sortBy === 'stock_desc') return (b.items_left || 0) - (a.items_left || 0);
      if (this.sortBy === 'stock_asc') return (a.items_left || 0) - (b.items_left || 0);
      if (this.sortBy === 'price_desc') {
        const pA = a.discountPrice || a.sellingPrice || a.price || 0;
        const pB = b.discountPrice || b.sellingPrice || b.price || 0;
        return pB - pA;
      }
      if (this.sortBy === 'price_asc') {
        const pA = a.discountPrice || a.sellingPrice || a.price || 0;
        const pB = b.discountPrice || b.sellingPrice || b.price || 0;
        return pA - pB;
      }
      if (this.sortBy === 'name_asc') return a.name.localeCompare(b.name);
      return 0;
    });

    return result;
  }

  get paginatedProducts(): ProductType[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredProducts.slice(start, start + this.pageSize);
  }

  get currentEndIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredProducts.length);
  }

  // Selection
  get isAllSelected(): boolean {
    const visible = this.paginatedProducts;
    if (visible.length === 0) return false;
    return visible.every(p => this.selectedIds.has(p.id));
  }

  get selectedCount(): number {
    return this.selectedIds.size;
  }

  isSelected(id: string): boolean {
    return this.selectedIds.has(id);
  }

  toggleSelect(id: string): void {
    if (this.selectedIds.has(id)) {
      this.selectedIds.delete(id);
    } else {
      this.selectedIds.add(id);
    }
  }

  toggleSelectAll(event: any): void {
    const checked = event.target.checked;
    if (checked) {
      this.paginatedProducts.forEach(p => this.selectedIds.add(p.id));
    } else {
      this.paginatedProducts.forEach(p => this.selectedIds.delete(p.id));
    }
  }

  clearSelection(): void {
    this.selectedIds.clear();
  }

  // Filter & Page controls
  setStockFilter(tab: 'all' | 'in_stock' | 'out_of_stock'): void {
    this.stockFilter = tab;
    this.currentPage = 1;
  }

  onSearchChange(): void {
    this.currentPage = 1;
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.currentPage = 1;
  }

  onFilterChange(): void {
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

  resetAllFilters(): void {
    this.searchTerm = '';
    this.selectedBranchId = 'all';
    this.selectedCategory = 'all';
    this.selectedStorage = 'all';
    this.stockFilter = 'all';
    this.sortBy = 'stock_desc';
    this.currentPage = 1;
  }

  getBranchStockForProduct(product: ProductType): { inStock: boolean; stock: number } {
    if (this.selectedBranchId === 'all') {
      return { inStock: (product.items_left || 0) > 0, stock: product.items_left || 0 };
    }
    const branch = product.branchStock?.find(b => b.branchId === this.selectedBranchId);
    if (branch) {
      return { inStock: branch.inStock && branch.stockQty > 0, stock: branch.stockQty };
    }
    return { inStock: false, stock: 0 };
  }

  // Branch Geolocation Stock Modal
  openBranchStockModal(content: any, product: ProductType): void {
    this.activeModalProduct = product;
    this.modalService.open(content, { size: 'lg', centered: true });
  }

  toggleBranchAvailability(stock: BranchStock): void {
    stock.inStock = !stock.inStock;
    if (!stock.inStock) {
      stock.stockQty = 0;
    } else if (stock.stockQty === 0) {
      stock.stockQty = 25;
    }
    this.recalculateTotalStock();
  }

  recalculateTotalStock(): void {
    if (this.activeModalProduct && this.activeModalProduct.branchStock) {
      this.activeModalProduct.items_left = this.activeModalProduct.branchStock.reduce(
        (acc, curr) => acc + (curr.inStock ? curr.stockQty : 0),
        0
      );
    }
  }

  testCustomerGeolocation(): void {
    if (this.customerLat > 24.9) {
      this.nearestDetectedBranch = 'Branch 01 - Gulshan Superstore (Main Hub)';
    } else if (this.customerLat < 24.8) {
      this.nearestDetectedBranch = 'Branch 03 - DHA Phase 6 Superstore';
    } else {
      this.nearestDetectedBranch = 'Branch 02 - Clifton Superstore (Ocean Mall)';
    }
  }

  deleteProduct(product: ProductType): void {
    if (confirm(`Are you sure you want to delete "${product.name}" (${product.sku}) from the catalog?`)) {
      this.products = this.products.filter(p => p.id !== product.id);
      this.selectedIds.delete(product.id);
      this.triggerToast(`"${product.name}" removed from catalog`, 'warning');
    }
  }

  bulkDelete(): void {
    if (confirm(`Are you sure you want to delete ${this.selectedCount} selected product(s)?`)) {
      this.products = this.products.filter(p => !this.selectedIds.has(p.id));
      this.triggerToast(`${this.selectedCount} products deleted successfully`, 'warning');
      this.clearSelection();
    }
  }

  exportCSV(): void {
    const headers = ['Barcode / SKU', 'Product Name', 'Category', 'SubCategory', 'Brand', 'Price (PKR)', 'Total Network Stock'];
    const rows = this.filteredProducts.map(p => [
      p.barcode || p.sku,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.category}"`,
      `"${p.subCategory || ''}"`,
      `"${p.brand}"`,
      p.discountPrice || p.sellingPrice || p.price,
      p.items_left
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rainbow_Product_Catalog_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.triggerToast('Product catalog exported to CSV successfully', 'info');
  }

  triggerToast(msg: string, type: 'success' | 'info' | 'warning' = 'success'): void {
    this.toastMessage = msg;
    this.toastType = type;
    setTimeout(() => {
      if (this.toastMessage === msg) this.toastMessage = null;
    }, 3500);
  }

  onImageError(event: any): void {
    event.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&auto=format&fit=crop&q=80';
  }
}
