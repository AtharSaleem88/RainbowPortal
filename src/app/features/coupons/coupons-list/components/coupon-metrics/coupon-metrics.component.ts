import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-coupon-metrics',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrl: './coupon-metrics.component.scss',
  templateUrl: './coupon-metrics.component.html',
})
export class CouponMetricsComponent {
  @Input() counts: {
    all: number;
    active: number;
    scheduled: number;
    expired: number;
    paused: number;
    totalRedemptions: number;
    totalSavings: number;
  } = {
    all: 0,
    active: 0,
    scheduled: 0,
    expired: 0,
    paused: 0,
    totalRedemptions: 0,
    totalSavings: 0,
  };
}
