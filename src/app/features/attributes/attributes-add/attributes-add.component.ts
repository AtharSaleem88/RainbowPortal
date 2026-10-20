import { Component } from '@angular/core';
import { SelectFormInputDirective } from '@shared/directives/select-form-input.directive';

@Component({
  selector: 'app-attributes-add',
  standalone: true,
  imports: [SelectFormInputDirective],
  templateUrl: './attributes-add.component.html',
  styles: ``,
})
export class AttributesAddComponent {
  title = 'Attribute Add';
}

export { AttributesAddComponent as AttributesAdd };
