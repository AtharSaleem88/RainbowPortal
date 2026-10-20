import { Route } from '@angular/router';
import { CouponsListComponent } from './coupons-list/coupons-list.component';

export const COUPON_ROUTES: Route[] = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
  {
    path: 'list',
    component: CouponsListComponent,
    data: { title: 'Customer Coupons & Vouchers' },
  },
  {
    path: 'add',
    redirectTo: 'list',
    pathMatch: 'full',
  },
];

export const COUPONS_ROUTES = COUPON_ROUTES;
