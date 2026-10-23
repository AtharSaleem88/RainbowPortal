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

  // Responsive row expand state (mobile child rows)
  expandedBranchIds = new Set<string>();

  toggleBranchExpand(id: string): void {
    if (this.expandedBranchIds.has(id)) {
      this.expandedBranchIds.delete(id);
    } else {
      this.expandedBranchIds.add(id);
    }
  }

  isBranchExpanded(id: string): boolean {
    return this.expandedBranchIds.has(id);
  }

  toggleBranchStock(branch: BranchStock) {
    branch.inStock = !branch.inStock;
    if (!branch.inStock) {
      branch.stockQty = 0;
    } else if (branch.stockQty === 0) {
      branch.stockQty = 30;
    }
  }
}
