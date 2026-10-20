import { showSaveSuccess, showSaveValidation } from '@shared/utils/save-alert';
import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductList, ProductType, RAINBOW_SUPERSTORE_BRANCHES, BranchStock, SUPERSTORE_COMPETITORS } from '../data';
import { MASTER_CATEGORIES, SUB_CATEGORIES, BRANDS, MasterCategory, SubCategory, Brand, getBrandsForCategoryAndSubCategory } from '../../category/data';

@Component({
  selector: 'app-manage-product',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './manage-product.component.html',
  styleUrl: './manage-product.component.scss',
})
export class ManageProductComponent implements OnInit {
  isEditMode: boolean = false;
  productId: string | null = null;
  pageTitle: string = 'Add New Product';

  masterCategories: MasterCategory[] = MASTER_CATEGORIES;
  allSubCategories: SubCategory[] = SUB_CATEGORIES;
  branches = RAINBOW_SUPERSTORE_BRANCHES;
  competitors: string[] = SUPERSTORE_COMPETITORS;

  newLabelInput: string = '';

  // Product Model (Only Name, Barcode, Description, Image, Category/Brand, Sell/Discount Price, Labels, Competitors, Branches)
  product: ProductType = {
    id: '',
    sku: '',
    barcode: '',
    name: '',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&auto=format&fit=crop&q=80',
    category: 'Frozen Food',
    subCategory: 'Frozen Chicken',
    brand: 'Rainbow Frozen',
    sellingPrice: 850,
    discountPrice: undefined,
    price: 850,
    items_left: 250,
    description: 'Fresh quality supermarket item sourced carefully for Rainbow Superstore customers.',
    priceMatch: true,
    priceMatchCompetitors: ['Imtiaz Super Market', 'Chase Up'],
    labels: ['100% Halal', 'Pre-Cut & Cleaned', 'Fresh Arrival'],
    branchStock: RAINBOW_SUPERSTORE_BRANCHES.map(b => ({
      branchId: b.id,
      branchName: b.name,
      city: b.city,
      latitude: b.latitude,
      longitude: b.longitude,
      deliveryRadiusKm: b.deliveryRadiusKm,
      inStock: true,
      stockQty: 25
    }))
  };

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        this.loadProductForEdit(params['id']);
      } else {
        this.isEditMode = false;
        this.pageTitle = 'Add New Product';
        this.generateNewBarcode();
      }
    });
  }

  loadProductForEdit(id: string) {
    const existing = ProductList.find(p => p.id === id);
    if (existing) {
      this.isEditMode = true;
      this.productId = id;
      this.pageTitle = `Edit Product: ${existing.name}`;
      this.product = JSON.parse(JSON.stringify(existing));
      if (!this.product.sellingPrice) {
        this.product.sellingPrice = this.product.mrp || this.product.price;
      }
      if (!this.product.barcode) {
        this.product.barcode = this.product.sku;
      }
      if (!this.product.labels) {
        this.product.labels = this.product.tags && this.product.tags.length > 0 ? [...this.product.tags] : ['100% Halal'];
      }
      if (!this.product.priceMatchCompetitors) {
        this.product.priceMatchCompetitors = ['Imtiaz Super Market', 'Chase Up'];
      }
    }
  }

  // Cascading Category -> Sub Category
  get filteredSubCategories(): SubCategory[] {
    const selectedCat = this.masterCategories.find(c => c.name === this.product.category);
    if (!selectedCat) return [];
    return this.allSubCategories.filter(s => s.parentCategoryId === selectedCat.id);
  }

  // Cascading Category + Sub Category -> Associated Brands
  get availableBrands(): Brand[] {
    const selectedCat = this.masterCategories.find(c => c.name === this.product.category);
    const catId = selectedCat ? selectedCat.id : undefined;
    const selectedSub = this.allSubCategories.find(s => s.name === this.product.subCategory && s.parentCategoryId === catId);
    const subId = selectedSub ? selectedSub.id : undefined;
    
    const matched = getBrandsForCategoryAndSubCategory(catId, subId);
    if (matched.length === 0) {
      return getBrandsForCategoryAndSubCategory(catId);
    }
    return matched;
  }

  onCategoryChange() {
    const subs = this.filteredSubCategories;
    if (subs.length > 0) {
      this.product.subCategory = subs[0].name;
    } else {
      this.product.subCategory = '';
    }
    this.onSubCategoryChange();
  }

  onSubCategoryChange() {
    const brands = this.availableBrands;
    if (brands.length > 0) {
      this.product.brand = brands[0].name;
    }
    this.generateNewBarcode();
  }

  generateNewBarcode() {
    if (!this.isEditMode) {
      const prefix = this.product.category.substring(0, 3).toUpperCase();
      const subPrefix = this.product.subCategory ? this.product.subCategory.substring(0, 2).toUpperCase() : 'GN';
      this.product.sku = `RW-${prefix}-${subPrefix}${Math.floor(10 + Math.random() * 90)}`;
      this.product.barcode = `8964000${Math.floor(1000 + Math.random() * 9000)}`;
    }
  }

  // Custom Labels (for displaying in product card/cart)
  addLabel(event?: any) {
    if (event) {
      event.preventDefault();
    }
    const trimmed = this.newLabelInput.trim();
    if (!trimmed) return;
    if (!this.product.labels) {
      this.product.labels = [];
    }
    if (!this.product.labels.includes(trimmed)) {
      this.product.labels.push(trimmed);
    }
    this.newLabelInput = '';
  }

  removeLabel(label: string) {
    if (this.product.labels) {
      this.product.labels = this.product.labels.filter(l => l !== label);
    }
  }

  // Competitor Superstores
  isCompetitorSelected(comp: string): boolean {
    return !!this.product.priceMatchCompetitors?.includes(comp);
  }

  toggleCompetitor(comp: string) {
    if (!this.product.priceMatchCompetitors) {
      this.product.priceMatchCompetitors = [];
    }
    const idx = this.product.priceMatchCompetitors.indexOf(comp);
    if (idx > -1) {
      this.product.priceMatchCompetitors.splice(idx, 1);
    } else {
      this.product.priceMatchCompetitors.push(comp);
    }
  }

  toggleBranchAvailability(stock: BranchStock) {
    stock.inStock = !stock.inStock;
    if (!stock.inStock) {
      stock.stockQty = 0;
    } else if (stock.stockQty === 0) {
      stock.stockQty = 25;
    }
    this.recalculateTotalStock();
  }

  recalculateTotalStock() {
    this.product.items_left = this.product.branchStock.reduce((acc, curr) => acc + (curr.inStock ? curr.stockQty : 0), 0);
  }

  // Image Upload & File Handling
  isDraggingOver: boolean = false;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.readFile(input.files[0]);
      input.value = '';
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDraggingOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDraggingOver = false;
  }

  onDropFile(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDraggingOver = false;
    if (event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
      this.readFile(event.dataTransfer.files[0]);
    }
  }

  readFile(file: File) {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, JPEG, WEBP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (e.target?.result) {
        this.product.image = e.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  }

  removeImage() {
    this.product.image = '';
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80';
  }

  async saveProduct(): Promise<void> {
    if (!this.product.name.trim()) {
      void showSaveValidation('Please enter a Product Name.');
      return;
    }
    if (!this.product.sellingPrice || this.product.sellingPrice <= 0) {
      void showSaveValidation('Please enter a valid Selling Price.');
      return;
    }

    this.recalculateTotalStock();

    // Active price is discountPrice if defined, otherwise regular sellingPrice
    this.product.price = (this.product.discountPrice && this.product.discountPrice > 0)
      ? this.product.discountPrice
      : this.product.sellingPrice;

    if (!this.product.barcode) {
      this.product.barcode = this.product.sku || `8964000${Math.floor(1000 + Math.random() * 9000)}`;
    }

    if (this.isEditMode) {
      const idx = ProductList.findIndex(p => p.id === this.productId);
      if (idx > -1) {
        ProductList[idx] = JSON.parse(JSON.stringify(this.product));
      }
    } else {
      this.product.id = `PRD-RW-${Date.now().toString().slice(-4)}`;
      ProductList.unshift(JSON.parse(JSON.stringify(this.product)));
    }
    await showSaveSuccess('Product saved successfully.');
    this.router.navigate(['/product/list']);
  }
}

export { ManageProductComponent as ManageProduct };
