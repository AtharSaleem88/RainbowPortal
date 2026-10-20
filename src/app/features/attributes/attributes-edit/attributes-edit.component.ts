import { Component } from '@angular/core';
import { SelectFormInputDirective } from '@shared/directives/select-form-input.directive';

@Component({
  selector: 'app-attributes-edit',
  standalone: true,
  imports: [SelectFormInputDirective],
  templateUrl: './attributes-edit.component.html',
  styles: ``,
})
export class AttributesEditComponent {
  title = 'Attribute Edit';
}

export { AttributesEditComponent as AttributesEdit };
