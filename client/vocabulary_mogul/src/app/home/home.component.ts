import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class HomeComponent implements OnInit, OnDestroy {

  private authenticationStaus!: Subscription
  userAuthenticated = false;

  constructor(private authenticationService : AuthenticationService){}

  ngOnDestroy(): void {
    this.authenticationStaus.unsubscribe();
  }

  ngOnInit(): void {
    this.authenticationStaus = this.authenticationService.getAuthenticationStatus().subscribe(status => {
      this.userAuthenticated = status;
    })
  }

}
