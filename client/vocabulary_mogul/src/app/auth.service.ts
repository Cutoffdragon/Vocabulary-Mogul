import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './environments/environment';
import { AuthModel } from './auth.model';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {

  private apiURL = environment.apiURL

  constructor(private http: HttpClient) { }

  register(username: string, password: string) {

    const authData: AuthModel = { username: username, password: password }

    this.http.post(`${this.apiURL}/register`, authData)
      .pipe(
        catchError(err => {
          console.error('Error during registration:', err);
          return throwError(err);  // Re-throw the error if needed
        })
      )
      .subscribe(
        (res) => {
          console.log('Registration successful:', res);
        }
      );
  }

  login(username: string, password: string) {

    const authData: AuthModel = { username: username, password: password };

    this.http.post(`${this.apiURL}/login`, authData)
      .pipe(
        catchError(err => {
          console.error('Error during Login:', err);
          return throwError(err);  // Re-throw the error if needed
        })
      )
      .subscribe(
        (res) => {
          console.log('Login successful:', res);
        }
      );
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  public get loggedIn(): boolean {
    return localStorage.getItem('token') !== null;
  }

}