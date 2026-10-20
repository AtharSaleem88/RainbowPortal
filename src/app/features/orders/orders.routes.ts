import { Route } from '@angular/router';
import { OrdersListComponent } from './orders-list/orders-list.component';
import { OrderReturnsComponent } from './order-returns/order-returns.component';
import { OrderFeedbackComponent } from './order-feedback/order-feedback.component';

export const ORDER_ROUTES: Route[] = [
  {
    path: 'list',
    component: OrdersListComponent,
    data: { title: 'Customer Orders' },
  },
  {
    path: 'returns',
    component: OrderReturnsComponent,
    data: { title: 'Order Returns' },
  },
  {
    path: 'feedback',
    component: OrderFeedbackComponent,
    data: { title: 'Customer Feedback & Reviews' },
  },
  {
    path: 'detail',
    redirectTo: 'list',
    pathMatch: 'full',
  },
  {
    path: 'cart',
    redirectTo: 'list',
    pathMatch: 'full',
  },
];

export const ORDERS_ROUTES = ORDER_ROUTES;
