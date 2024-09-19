import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { AuthenticationService } from '../auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  username: string = '';
  password: string = '';

  constructor(private authService: AuthenticationService) {}

  onSubmit() {
    this.authService.register(this.username, this.password)
  }
}
