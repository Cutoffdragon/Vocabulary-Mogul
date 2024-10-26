import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from './auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export const AuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {

  const authService = inject(AuthenticationService)
  const router = inject(Router);

  if (authService.isAuthenticated) {
    return true; // Allow access to the route
  } else {
    router.navigate(['/']); // Redirect to home if not authenticated
    return false; // Block access to the route
  }
}