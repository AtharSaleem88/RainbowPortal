import { Component } from '@angular/core';
import { SelectFormInputDirective } from '@shared/directives/select-form-input.directive';

@Component({
  selector: 'app-role-add',
  standalone: true,
  imports: [SelectFormInputDirective],
  templateUrl: './role-add.component.html',
  styles: ``,
})
export class RoleAddComponent {
  title = 'Role Add';
}

export { RoleAddComponent as RoleAdd };
