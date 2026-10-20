import { Route } from '@angular/router';
import { OrdersList } from './orders-list/orders-list';
import { OrderReturns } from './order-returns/order-returns';
import { OrderFeedback } from './order-feedback/order-feedback';

export const ORDER_ROUTES: Route[] = [
  {
    path: 'list',
    component: OrdersList,
    data: { title: 'Customer Orders' },
  },
  {
    path: 'returns',
    component: OrderReturns,
    data: { title: 'Order Returns' },
  },
  {
    path: 'feedback',
    component: OrderFeedback,
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
