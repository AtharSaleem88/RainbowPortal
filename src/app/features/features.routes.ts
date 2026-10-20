import { Route } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';

export const FEATURES_ROUTES: Route[] = [
  {
    path: 'index',
    component: Dashboard,
    data: { title: 'Dashboard' },
  },
  {
    path: 'product',
    loadChildren: () =>
      import('./products/product.route').then((mod) => mod.PRODUCT_ROUTES),
  },
  {
    path: 'category',
    loadChildren: () =>
      import('./category/category.route').then((mod) => mod.CATEGORY_ROUTES),
  },
  {
    path: 'inventory',
    redirectTo: 'product/list',
    pathMatch: 'prefix',
  },
  {
    path: 'orders',
    loadChildren: () =>
      import('./orders/orders.route').then((mod) => mod.ORDER_ROUTES),
  },
  {
    path: 'attributes',
    loadChildren: () =>
      import('./attributes/attributes.route').then((mod) => mod.ATTRIBUTES_ROUTES),
  },
  {
    path: 'role',
    loadChildren: () =>
      import('./roles/role.route').then((mod) => mod.ROLE_ROUTES),
  },
  {
    path: 'customer',
    loadChildren: () =>
      import('./customer/customer.route').then((mod) => mod.CUSTOMERS_ROUTES),
  },
  {
    path: 'promotions',
    loadChildren: () =>
      import('./promotions/promotions.route').then((mod) => mod.PROMOTION_ROUTES),
  },
  {
    path: 'coupons',
    loadChildren: () =>
      import('./coupons/coupons.route').then((mod) => mod.COUPON_ROUTES),
  },
  {
    path: 'marketing',
    loadChildren: () =>
      import('./marketing/marketing.route').then((mod) => mod.MARKETING_ROUTES),
  },
  {
    path: 'charts',
    loadChildren: () =>
      import('./charts/charts.route').then((mod) => mod.CHART_ROUTES),
  },
];

export const VIEW_ROUTES = FEATURES_ROUTES;
