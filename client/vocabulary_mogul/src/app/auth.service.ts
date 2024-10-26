import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './environments/environment';
import { AuthModel } from './auth.model';
import { catchError } from 'rxjs/operators';
import { throwError, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { VocabularyList } from './vocab-list';
import { PLATFORM_ID } from '@angular/core'; // Import PLATFORM_ID
import { isPlatformBrowser } from '@angular/common';


@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {

  private apiURL = environment.apiURL;
  isAuthenticated = false;
  platformId = inject(PLATFORM_ID);  // Inject the platformId
  private token = ''

  constructor(private http: HttpClient, private router: Router, private vocabularyList: VocabularyList) {
    if (isPlatformBrowser(this.platformId)) {
      this.token = localStorage.getItem('token') || '';
      this.isAuthenticated = !!this.token; // Set based on presence of token
    } else {
      this.router.navigate(['/'])
    }
  }


  register(username: string, password: string) {
    const userVocab = this.vocabularyList.generateVocabularyNumbers(15, 562)
    const authData: AuthModel = { username: username, password: password, userVocab: userVocab };

    this.http.post<{ token: string, username: string, user_id: string }>(`${this.apiURL}/register`, authData)
      .pipe(
        catchError(err => {
          console.error('Error during registration:', err);
          return throwError(err);  // Re-throw the error if needed
        })
      )
      .subscribe(
        (res) => {
          localStorage.setItem('token', res.token);
          localStorage.setItem('username', res.username);
          localStorage.setItem('user_id', res.user_id)
          this.isAuthenticated = true;
          console.log('Registration successful:', res);
          this.router.navigate(['/profile'])
        }
      );

    this.http.post(`${this.apiURL}/vocabulary`, userVocab)
      .pipe(
        catchError(err => {
          console.error('Error during registration:', err);
          return throwError(err);  // Re-throw the error if needed
        })
      )
      .subscribe(
        (res) => {
          console.log('Generated vocabulary:', res);
        }
      );
  }

  login(username: string, password: string) {

    const authData: AuthModel = { username: username, password: password, userVocab: [] };

    this.http.post<{ token: string, username: string, user_id: string }>(`${this.apiURL}/login`, authData)
      .pipe(
        catchError(err => {
          console.error('Error during Login:', err);
          return throwError(err);  // Re-throw the error if needed
        })
      )
      .subscribe(
        (res) => {
          localStorage.setItem('token', res.token);
          localStorage.setItem('username', res.username);
          localStorage.setItem('user_id', res.user_id)
          this.isAuthenticated = true;
          console.log('Login successful:', res);
          this.router.navigate(['/profile'])
        }
      );
  }

  logout(): void {
    localStorage.clear();
    this.isAuthenticated = false; // Update local status
    this.router.navigate(['/login']); // Redirect to login page
  }

  public get loggedIn(): boolean {
    return localStorage.getItem('token') !== null;
  }

}