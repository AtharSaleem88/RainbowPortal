import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { transactionHistory } from '../../data';
import { CommonModule, DecimalPipe } from '@angular/common'
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'customer-transaction-history',
  standalone: true,
  imports: [DecimalPipe, CommonModule, NgbPaginationModule],
  templateUrl: './transaction-history.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: ``,
})
export class TransactionHistory {
  transactionList = transactionHistory;

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
