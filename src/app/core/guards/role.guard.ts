import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthenticationService } from '@core/services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthenticationService);

  const currentUser = authService.user;
  if (!currentUser) {
    return router.createUrlTree(['/auth/signin'], {
      queryParams: { returnUrl: state.url },
    });
  }

  const expectedRoles = route.data?.['roles'] as Array<string> | undefined;

  // If no roles specified, any authenticated user can access
  if (!expectedRoles || expectedRoles.length === 0) {
    return true;
  }

  const userRole = currentUser.role || 'Admin';

  if (expectedRoles.includes(userRole)) {
    return true;
  }

  // Not authorized: redirect to role's primary landing view
  if (userRole === 'Moderator') {
    return router.createUrlTree(['/orders/list']);
  } else if (userRole === 'Branch Manager') {
    return router.createUrlTree(['/index']);
  } else {
    return router.createUrlTree(['/index']);
  }
};
