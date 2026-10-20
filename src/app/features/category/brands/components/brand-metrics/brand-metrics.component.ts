import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-brand-metrics',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrl: './brand-metrics.component.scss',
  templateUrl: './brand-metrics.component.html',
})
export class BrandMetricsComponent {
  @Input() brandsCount: number = 0;
  @Input() activeBrandsCount: number = 0;
  @Input() categoriesCount: number = 0;
  @Input() totalBrandProducts: number = 0;
}
