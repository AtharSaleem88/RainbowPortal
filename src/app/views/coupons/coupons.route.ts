import { Route } from '@angular/router';
import { CouponsList } from './coupons-list/coupons-list';

export const COUPON_ROUTES: Route[] = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
  {
    path: 'list',
    component: CouponsList,
    data: { title: 'Customer Coupons & Vouchers' },
  },
  {
    path: 'add',
    redirectTo: 'list',
    pathMatch: 'full',
  },
];
