import { Route } from '@angular/router';
import { PushNotifications } from './push-notifications/push-notifications';
import { LoyaltyPoints } from './loyalty-points/loyalty-points';
import { CustomerWallets } from './wallets/wallets';

export const MARKETING_ROUTES: Route[] = [
  {
    path: '',
    redirectTo: 'push-notifications',
    pathMatch: 'full',
  },
  {
    path: 'push-notifications',
    component: PushNotifications,
    data: { title: 'Push Notifications' },
  },
  {
    path: 'loyalty-points',
    component: LoyaltyPoints,
    data: { title: 'Customer Loyalty Points' },
  },
  {
    path: 'wallets',
    component: CustomerWallets,
    data: { title: 'Customer Wallets Management' },
  },
];

