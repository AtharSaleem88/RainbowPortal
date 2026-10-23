import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AttributeData } from './data';
import { NgbDropdownModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-attributes-list',
  standalone: true,
  imports: [NgbDropdownModule,NgbPaginationModule],
  templateUrl: './attributes-list.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AttributesListComponent {
  title = 'Attribute List';
  attributes = AttributeData;

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

export { AttributesListComponent as AttributesList };
