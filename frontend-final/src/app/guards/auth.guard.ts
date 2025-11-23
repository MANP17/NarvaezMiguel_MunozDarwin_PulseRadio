import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);
  const url = state.url;

  const logged = authService.isLoggedIn();

  if (logged && (url.startsWith('/login') || url.startsWith('/register'))) {
    return router.parseUrl('/');
  }

  // Si NO está logueado e intenta ir a /profile → redirigir a /login
  if (!logged && (url.startsWith('/profile') || url.startsWith('/favorites') || url.startsWith('/custom'))) {
    return router.parseUrl('/login');
  }

  // En cualquier otro caso, permitir
  return true;
};
