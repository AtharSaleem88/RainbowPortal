import { confirmAction } from '@shared/utils/confirmation';
import { showSaveSuccess } from '@shared/utils/save-alert';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, inject } from '@angular/core';
import { AuthenticationService } from '@core/services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductList, ProductType, RAINBOW_SUPERSTORE_BRANCHES, BranchStock } from '../data';
import { NgbDropdownModule, NgbPaginationModule, NgbModal, NgbModalModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterLink } from '@angular/router';
import { ProductMetricsComponent } from './components/product-metrics/product-metrics.component';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbPaginationModule,
    NgbDropdownModule,
    NgbModalModule,
    NgbTooltipModule,
    RouterLink,
    ProductMetricsComponent
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProductListComponent implements OnInit {
  title = 'Product Catalog & Inventory';
  private modalService = inject(NgbModal);
  private authService = inject(AuthenticationService);
  currentUser = this.authService.user;

  products: ProductType[] = ProductList;
  branches = RAINBOW_SUPERSTORE_BRANCHES;

  selectedBranchId: string = 'all';
  selectedCategory: string = 'all';
  selectedSubCategory: string = 'all';
  selectedBrand: string = 'all';
  selectedStorage: string = 'all';
  stockFilter: 'all' | 'in_stock' | 'out_of_stock' = 'all';
  searchTerm: string = '';
  sortBy: 'stock_desc' | 'stock_asc' | 'price_desc' | 'price_asc' | 'name_asc' = 'stock_desc';

  // Pagination
  currentPage: number = 1;
  pageSize: number = 10;

  // Selection
  selectedIds: Set<string> = new Set<string>();

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

  // Toast feedback
  toastMessage: string | null = null;
  toastType: 'success' | 'info' | 'warning' = 'success';

  // Selected product for Branch Geolocation Stock Modal
  activeModalProduct: ProductType | null = null;
  customerLat: number = 24.8607;
  customerLng: number = 67.0011;
  nearestDetectedBranch: string = 'Branch 02 - Clifton Superstore (Ocean Mall)';

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(u => {
      this.currentUser = u;
      if (u?.role === 'Branch Manager') {
        this.selectedBranchId = 'b1';
      }
    });
  }

  get isBranchLocked(): boolean {
    return this.currentUser?.role === 'Branch Manager';
  }

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

  get categories(): string[] {
    return [...new Set(this.products.map(p => p.category).filter(Boolean))].sort();
  }

  get availableSubCategories(): string[] {
    const list = this.selectedCategory === 'all'
      ? this.products
      : this.products.filter(p => p.category === this.selectedCategory);
    return [...new Set(list.map(p => p.subCategory).filter(Boolean))].sort();
  }

  get brands(): string[] {
    return [...new Set(this.products.map(p => p.brand).filter(Boolean))].sort();
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
      const matchesSubCategory = this.selectedSubCategory === 'all' || item.subCategory === this.selectedSubCategory;
      const matchesBrand = this.selectedBrand === 'all' || item.brand === this.selectedBrand;
      const matchesStorage = this.selectedStorage === 'all' || item.storageType === this.selectedStorage;

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

      return matchesSearch && matchesCategory && matchesSubCategory && matchesBrand && matchesStock && matchesBranch && matchesStorage;
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

  onCategoryChange(): void {
    this.selectedSubCategory = 'all';
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
    this.selectedSubCategory = 'all';
    this.selectedBrand = 'all';
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

  saveBranchStock(modal: { close: () => void }): void {
    this.recalculateTotalStock();
    modal.close();
    void showSaveSuccess('Branch stock and availability changes saved successfully.');
  }

  async deleteProduct(product: ProductType): Promise<void> {
    if (await confirmAction(`Are you sure you want to delete "${product.name}" (${product.sku}) from the catalog?`)) {
      this.products = this.products.filter(p => p.id !== product.id);
      this.selectedIds.delete(product.id);
      this.triggerToast(`"${product.name}" removed from catalog`, 'warning');
    }
  }

  async bulkDelete(): Promise<void> {
    if (await confirmAction(`Are you sure you want to delete ${this.selectedCount} selected product(s)?`)) {
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

export { ProductListComponent as List };
