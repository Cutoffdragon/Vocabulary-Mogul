import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '../login/login.component';
import { Subscription } from 'rxjs';;
import { AuthenticationService } from '../auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ LoginComponent, CommonModule ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  authenticationStatus!: boolean
  userAuthenticated = false;

  constructor(private authenticationService : AuthenticationService){}

  ngOnInit(): void {
    this.authenticationStatus = this.authenticationService.isAuthenticated;
  }

  logout() {
    this.authenticationService.logout();
  }

}
