import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);

  const currentUser =
    localStorage.getItem('currentUser');

  if (currentUser) {
    return true;
  }

  return router.createUrlTree(['/login']);
};