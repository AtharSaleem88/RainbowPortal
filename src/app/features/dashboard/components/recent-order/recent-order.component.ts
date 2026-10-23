import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { orderList } from '@features/dashboard/data';

@Component({
  selector: 'dashboard-recent-order',
  standalone: true,
  imports: [CommonModule, NgbPaginationModule, RouterLink],
  templateUrl: './recent-order.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: ``,
})
export class RecentOrderComponent {
  orders = orderList;

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

export { RecentOrderComponent as RecentOrder };
