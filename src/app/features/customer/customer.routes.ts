import { Route } from '@angular/router';
import { CustomerListComponent } from './customer-list/customer-list.component';

export const CUSTOMERS_ROUTES: Route[] = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
  {
    path: 'list',
    component: CustomerListComponent,
    data: { title: 'Customer List' },
  },
  {
    path: 'detail',
    redirectTo: 'list',
    pathMatch: 'full',
  },
];

export const CUSTOMER_ROUTES = CUSTOMERS_ROUTES;
