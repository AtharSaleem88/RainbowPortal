import { Route } from '@angular/router';
import { PromotionsListComponent } from './promotions-list/promotions-list.component';

export const PROMOTION_ROUTES: Route[] = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
  {
    path: 'list',
    component: PromotionsListComponent,
    data: { title: 'Product Promotions' },
  },
];

export const PROMOTIONS_ROUTES = PROMOTION_ROUTES;
