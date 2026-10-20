import { Route } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';

export const FEATURES_ROUTES: Route[] = [
  {
    path: 'index',
    component: DashboardComponent,
    data: { title: 'Dashboard' },
  },
  {
    path: 'product',
    loadChildren: () =>
      import('./products/products.routes').then((mod) => mod.PRODUCT_ROUTES),
  },
  {
    path: 'category',
    loadChildren: () =>
      import('./category/category.routes').then((mod) => mod.CATEGORY_ROUTES),
  },
  {
    path: 'inventory',
    redirectTo: 'product/list',
    pathMatch: 'prefix',
  },
  {
    path: 'orders',
    loadChildren: () =>
      import('./orders/orders.routes').then((mod) => mod.ORDER_ROUTES),
  },
  {
    path: 'attributes',
    loadChildren: () =>
      import('./attributes/attributes.routes').then((mod) => mod.ATTRIBUTES_ROUTES),
  },
  {
    path: 'role',
    loadChildren: () =>
      import('./roles/roles.routes').then((mod) => mod.ROLE_ROUTES),
  },
  {
    path: 'customer',
    loadChildren: () =>
      import('./customer/customer.routes').then((mod) => mod.CUSTOMERS_ROUTES),
  },
  {
    path: 'promotions',
    loadChildren: () =>
      import('./promotions/promotions.routes').then((mod) => mod.PROMOTION_ROUTES),
  },
  {
    path: 'coupons',
    loadChildren: () =>
      import('./coupons/coupons.routes').then((mod) => mod.COUPON_ROUTES),
  },
  {
    path: 'marketing',
    loadChildren: () =>
      import('./marketing/marketing.routes').then((mod) => mod.MARKETING_ROUTES),
  },
  {
    path: 'charts',
    loadChildren: () =>
      import('./charts/charts.routes').then((mod) => mod.CHART_ROUTES),
  },
];

export const VIEW_ROUTES = FEATURES_ROUTES;
