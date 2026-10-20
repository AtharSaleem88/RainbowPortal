import { Route } from '@angular/router';
import { PromotionsList } from './promotions-list/promotions-list';

export const PROMOTION_ROUTES: Route[] = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
  {
    path: 'list',
    component: PromotionsList,
    data: { title: 'Product Promotions' },
  },
];
