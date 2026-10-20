import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-product-metrics',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrl: './product-metrics.component.scss',
  templateUrl: './product-metrics.component.html',
})
export class ProductMetricsComponent {
  @Input() totalProductsCount: number = 0;
  @Input() totalStockUnits: number = 0;
  @Input() inStockCount: number = 0;
  @Input() branchCount: number = 0;
}
