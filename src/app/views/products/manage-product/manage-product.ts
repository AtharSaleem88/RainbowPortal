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
  templateUrl: './manage-product.html',
  styles: [`
    .font-jost {
      font-family: 'Jost', -apple-system, BlinkMacSystemFont, sans-serif;
    }

    /* Enterprise Card Layout */
    .manage-card {
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      background: #ffffff;
      box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
      margin-bottom: 20px;
      overflow: hidden;

      .card-header-sleek {
        padding: 13px 18px;
        background: #ffffff;
        border-bottom: 1px solid #f1f5f9;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .header-title-wrap {
          display: flex;
          align-items: center;
          gap: 10px;

          .header-icon {
            width: 32px;
            height: 32px;
            border-radius: 8px;
            background: #f1f5f9;
            color: #2e3192;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 17px;
            flex-shrink: 0;
          }

          h5 {
            font-size: 13.5px;
            font-weight: 700;
            color: #0f172a;
            margin: 0;
            letter-spacing: -0.2px;
          }
        }

        .header-desc {
          font-size: 11.5px;
          color: #64748b;
        }
      }

      .card-body-sleek {
        padding: 18px;
      }
    }



    /* Form Controls */
    .form-control-sleek {
      border: 1px solid #cbd5e1;
      border-radius: 7px;
      font-size: 12.5px;
      color: #0f172a;
      transition: all 0.15s ease;

      &:focus {
        border-color: #2e3192;
        box-shadow: 0 0 0 3px rgba(46, 49, 146, 0.1);
      }
    }

    /* Modern Label Chips */
    .label-chip-modern {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 11px;
      border-radius: 6px;
      font-size: 12px;
      background: #f8fafc;
      color: #1e293b;
      border: 1px solid #e2e8f0;
      font-weight: 500;
      transition: all 0.15s ease;

      .chip-remove-btn {
        border: none;
        background: transparent;
        color: #94a3b8;
        cursor: pointer;
        padding: 0;
        display: flex;
        align-items: center;
        font-size: 14px;
        line-height: 1;

        &:hover {
          color: #ef4444;
        }
      }
    }

    /* Competitor Pills */
    .competitor-pill-modern {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      padding: 6px 13px;
      border-radius: 6px;
      font-size: 12px;
      border: 1px solid #e2e8f0;
      background: #ffffff;
      color: #475569;
      cursor: pointer;
      transition: all 0.15s ease;
      user-select: none;

      &:hover:not(.active) {
        background: #f8fafc;
        border-color: #cbd5e1;
        color: #0f172a;
      }

      &.active {
        background: #ecfdf5;
        border-color: #059669;
        color: #065f46;
        font-weight: 600;
      }
    }

    /* Inventory Table */
    .table-inventory {
      th {
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        color: #475569;
        background: #f8fafc;
        border-bottom: 1px solid #e2e8f0;
        padding: 10px 14px;
      }
      td {
        padding: 11px 14px;
        font-size: 12.5px;
        border-bottom: 1px solid #f1f5f9;
        vertical-align: middle;
      }
    }

    /* Product Image Preview Card & Upload Styles */
    .product-media-wrapper {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      box-shadow: 0 1px 3px rgba(15, 23, 42, 0.03);
    }

    .product-image-preview-card {
      width: 165px;
      height: 165px;
      border-radius: 12px;
      border: 1px solid #cbd5e1;
      background: #f8fafc;
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 6px rgba(15, 23, 42, 0.06);
      transition: all 0.2s ease;

      &.has-image:hover {
        border-color: #2e3192;
        box-shadow: 0 4px 14px rgba(46, 49, 146, 0.15);
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .image-hover-actions {
        position: absolute;
        inset: 0;
        background: rgba(15, 23, 42, 0.65);
        backdrop-filter: blur(2px);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8px;
        opacity: 0;
        transition: opacity 0.2s ease;
      }

      &:hover .image-hover-actions {
        opacity: 1;
      }

      .no-image-placeholder {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        background: #f8fafc;

        .placeholder-icon {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          background: #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }

    .image-dropzone-box {
      border: 1.5px dashed #cbd5e1;
      border-radius: 10px;
      background: #f8fafc;
      transition: all 0.2s ease;

      &:hover, &.dragover {
        border-color: #2e3192;
        background: #f1f5f9;
      }

      .dropzone-icon-circle {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        background: #eff6ff;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .url-input-section {
      border-top: 1px dashed #e2e8f0;
    }
  `]
})
export class ManageProduct implements OnInit {
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

  saveProduct() {
    if (!this.product.name.trim()) {
      alert('Please enter a Product Name.');
      return;
    }
    if (!this.product.sellingPrice || this.product.sellingPrice <= 0) {
      alert('Please enter a valid Selling Price.');
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
    this.router.navigate(['/product/list']);
  }
}
