import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { orderProducts } from '../../data';
import { CommonModule, DecimalPipe } from '@angular/common'

@Component({
  selector: 'order-product',
  standalone: true,
  imports: [DecimalPipe, CommonModule],
  templateUrl: './order-product.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: ``,
})
export class OrderProduct {
  productList = orderProducts;

  // Responsive row expand state (mobile child rows)
  expandedRowIds = new Set<string | number>();

  toggleRowExpand(id: string | number): void {
    if (this.expandedRowIds.has(id)) {
      this.expandedRowIds.delete(id);
    } else {
      this.expandedRowIds.add(id);
    }
  }

  isRowExpanded(id: string | number): boolean {
    return this.expandedRowIds.has(id);
  }
}
