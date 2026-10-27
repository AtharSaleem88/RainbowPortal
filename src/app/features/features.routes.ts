import { Route } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { roleGuard } from '@core/guards/role.guard';

export const FEATURES_ROUTES: Route[] = [
  {
    path: 'index',
    component: DashboardComponent,
    canActivate: [roleGuard],
    data: { title: 'Dashboard', roles: ['Admin', 'Branch Manager', 'Moderator'] },
  },
  {
    path: 'product',
    canActivate: [roleGuard],
    data: { roles: ['Admin'] },
    loadChildren: () =>
      import('./products/products.routes').then((mod) => mod.PRODUCT_ROUTES),
  },
  {
    path: 'category',
    canActivate: [roleGuard],
    data: { roles: ['Admin'] },
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
    canActivate: [roleGuard],
    data: { roles: ['Admin', 'Branch Manager', 'Moderator'] },
    loadChildren: () =>
      import('./orders/orders.routes').then((mod) => mod.ORDER_ROUTES),
  },
  {
    path: 'attributes',
    canActivate: [roleGuard],
    data: { roles: ['Admin'] },
    loadChildren: () =>
      import('./attributes/attributes.routes').then((mod) => mod.ATTRIBUTES_ROUTES),
  },
  {
    path: 'role',
    canActivate: [roleGuard],
    data: { roles: ['Admin', 'Branch Manager', 'Moderator'] },
    loadChildren: () =>
      import('./roles/roles.routes').then((mod) => mod.ROLE_ROUTES),
  },
  {
    path: 'customer',
    canActivate: [roleGuard],
    data: { roles: ['Admin', 'Branch Manager'] },
    loadChildren: () =>
      import('./customer/customer.routes').then((mod) => mod.CUSTOMERS_ROUTES),
  },
  {
    path: 'promotions',
    canActivate: [roleGuard],
    data: { roles: ['Admin', 'Branch Manager'] },
    loadChildren: () =>
      import('./promotions/promotions.routes').then((mod) => mod.PROMOTION_ROUTES),
  },
  {
    path: 'coupons',
    canActivate: [roleGuard],
    data: { roles: ['Admin', 'Branch Manager'] },
    loadChildren: () =>
      import('./coupons/coupons.routes').then((mod) => mod.COUPON_ROUTES),
  },
  {
    path: 'marketing',
    canActivate: [roleGuard],
    data: { roles: ['Admin'] },
    loadChildren: () =>
      import('./marketing/marketing.routes').then((mod) => mod.MARKETING_ROUTES),
  },
  {
    path: 'charts',
    canActivate: [roleGuard],
    data: { roles: ['Admin', 'Branch Manager'] },
    loadChildren: () =>
      import('./charts/charts.routes').then((mod) => mod.CHART_ROUTES),
  },
];

export const VIEW_ROUTES = FEATURES_ROUTES;
