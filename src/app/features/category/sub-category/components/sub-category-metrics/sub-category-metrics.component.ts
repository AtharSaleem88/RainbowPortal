import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-sub-category-metrics',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrl: './sub-category-metrics.component.scss',
  templateUrl: './sub-category-metrics.component.html',
})
export class SubCategoryMetricsComponent {
  @Input() totalSubCategories: number = 0;
  @Input() activeSubCount: number = 0;
  @Input() totalProducts: number = 0;
  @Input() masterDepartmentsCount: number = 0;
}
