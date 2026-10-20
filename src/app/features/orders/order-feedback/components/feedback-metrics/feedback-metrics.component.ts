import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-feedback-metrics',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrl: './feedback-metrics.component.scss',
  templateUrl: './feedback-metrics.component.html',
})
export class FeedbackMetricsComponent {
  @Input() counts: {
    all: number;
    pending: number;
    approved: number;
    rejected: number;
    averageRating: number;
  } = {
    all: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    averageRating: 0,
  };
}
