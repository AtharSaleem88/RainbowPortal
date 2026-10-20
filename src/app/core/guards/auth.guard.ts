import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthenticationService } from '@core/services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthenticationService);

  if (!authService.session) {
    return router.createUrlTree(['/auth/signin'], {
      queryParams: { returnUrl: state.url },
    });
  }
  return true;
};
