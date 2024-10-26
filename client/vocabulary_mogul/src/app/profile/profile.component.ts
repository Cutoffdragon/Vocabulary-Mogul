import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../auth.service'; // Adjust the path accordingly
import { PLATFORM_ID } from '@angular/core'; // Import PLATFORM_ID
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  platformId = inject(PLATFORM_ID); // Inject the platformId
  username = '';

  constructor(private router: Router, private authService: AuthenticationService) {}

  ngOnInit(): void {
    // Check authentication status
      if (this.authService.isAuthenticated) {
        if (isPlatformBrowser(this.platformId)) {
          this.username = localStorage.getItem('username') || '';
        }
      } else {
        // If not authenticated, navigate to home
        this.router.navigate(['/']);
      }
    };
  }

