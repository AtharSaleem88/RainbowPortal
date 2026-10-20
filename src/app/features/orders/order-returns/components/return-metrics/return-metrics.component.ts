import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-return-metrics',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrl: './return-metrics.component.scss',
  templateUrl: './return-metrics.component.html',
})
export class ReturnMetricsComponent {
  @Input() counts: {
    all: number;
    pending: number;
    approved: number;
    rejected: number;
    totalRefunded: number;
  } = {
    all: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    totalRefunded: 0,
  };
}
