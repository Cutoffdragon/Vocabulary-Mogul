import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { AuthenticationService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss', '../app.component.scss']
})
export class LoginComponent {

  username: string = '';
  password: string = '';


  constructor(private authService: AuthenticationService) {}


  onSubmit() {
    this.authService.login(this.username, this.password)
  }

}
