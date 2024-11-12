import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '../auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})

export class NavbarComponent {

  isAuthenticated : boolean = false

  constructor(private authService: AuthenticationService) {
    this.isAuthenticated = this.authService.isAuthenticated
  }

  logOut() {
    this.authService.logout();
  }

}
