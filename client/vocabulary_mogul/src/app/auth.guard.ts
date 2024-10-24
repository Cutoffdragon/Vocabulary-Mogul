import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from './auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthenticationService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.getAuthenticationStatus().pipe(
      map((isAuthenticated: boolean) => {
        if (isAuthenticated) {
          return true; // Allow access to the route
        } else {
          this.router.navigate(['/']); // Redirect to home if not authenticated
          return false; // Block access to the route
        }
      })
    );
  }
}
