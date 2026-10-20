import { Routes } from '@angular/router'
import { LayoutComponent, AuthLayoutComponent } from '@layouts/index'
import { authGuard } from '@core/guards/auth.guard'

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'index',
    pathMatch: 'full',
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/features.routes').then((mod) => mod.FEATURES_ROUTES),
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    loadChildren: () =>
      import('./features/auth/auth.routes').then((mod) => mod.AUTH_ROUTES),
  },
]
