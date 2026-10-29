import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThemedSelectComponent, ThemedSelectOption } from '../../../../products/themed-select/themed-select.component';

@Component({
  selector: 'category-add-general-info',
  standalone: true,
  imports: [FormsModule, ThemedSelectComponent],
  templateUrl: './general-info.html',
  styles: ``
})
export class GeneralInfo {
  createdBy = 'Admin';
  creatorOptions: ThemedSelectOption[] = [
    { value: 'Admin', label: 'Admin' },
    { value: 'Moderator', label: 'Moderator' },
    { value: 'Super Admin', label: 'Super Admin' },
  ];
}
