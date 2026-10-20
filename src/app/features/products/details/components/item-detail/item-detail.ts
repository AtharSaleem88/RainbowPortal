import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductList, ProductType, RAINBOW_SUPERSTORE_BRANCHES, BranchStock } from '../../../data';

@Component({
  selector: 'item-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './item-detail.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ItemDetail {
  product: ProductType = ProductList[0]; // Chicken Shashlik
  activeTab: 'desc' | 'specs' | 'branches' = 'desc';

  toggleBranchStock(branch: BranchStock) {
    branch.inStock = !branch.inStock;
    if (!branch.inStock) {
      branch.stockQty = 0;
    } else if (branch.stockQty === 0) {
      branch.stockQty = 30;
    }
  }
}
