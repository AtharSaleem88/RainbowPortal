import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sub-sub-category-metrics',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrl: './sub-sub-category-metrics.component.scss',
  templateUrl: './sub-sub-category-metrics.component.html',
})
export class SubSubCategoryMetricsComponent {
  @Input() totalSubSubCategories: number = 0;
  @Input() masterCategoriesCount: number = 0;
  @Input() activeSubSubCount: number = 0;
  @Input() subCategoriesCount: number = 0;
}
