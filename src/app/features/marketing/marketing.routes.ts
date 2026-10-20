import { Route } from '@angular/router';
import { PushNotificationsComponent } from './push-notifications/push-notifications.component';
import { LoyaltyPointsComponent } from './loyalty-points/loyalty-points.component';
import { CustomerWalletsComponent } from './wallets/wallets.component';

export const MARKETING_ROUTES: Route[] = [
  {
    path: '',
    redirectTo: 'push-notifications',
    pathMatch: 'full',
  },
  {
    path: 'push-notifications',
    component: PushNotificationsComponent,
    data: { title: 'Push Notifications' },
  },
  {
    path: 'loyalty-points',
    component: LoyaltyPointsComponent,
    data: { title: 'Customer Loyalty Points' },
  },
  {
    path: 'wallets',
    component: CustomerWalletsComponent,
    data: { title: 'Customer Wallets Management' },
  },
];

