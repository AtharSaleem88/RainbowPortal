import { CommonModule } from '@angular/common'
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WidgetCardComponent } from '@shared/components/widget-card/widget-card.component';
import { stateData } from '@features/dashboard/data';

@Component({
  selector: 'dashboard-state',
  standalone: true,
  imports: [CommonModule, WidgetCardComponent],
  templateUrl: './state.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class StateComponent {
  stateList = stateData;
}

export { StateComponent as State };
