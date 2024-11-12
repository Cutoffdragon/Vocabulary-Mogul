import { Component, OnInit, Inject, OnDestroy, ChangeDetectorRef, ViewChild, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';
import { AuthenticationService } from '../auth.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { PLATFORM_ID } from '@angular/core'; // Import PLATFORM_ID
import { isPlatformBrowser } from '@angular/common';
import { QuizComponent } from '../quiz/quiz.component';
import { UserQuizComponent } from '../user.quiz/user.quiz.component';
import { ReviewQuizComponent } from '../review.quiz/review.quiz.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [LoginComponent, CommonModule, RegisterComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss', '../app.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {

  @ViewChild('quizContainer', { read: ViewContainerRef }) quizContainer!: ViewContainerRef;

  images = [
    'https://images.unsplash.com/photo-1618866569162-6be428961651?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Ym9vayUyMG9uJTIwdGFibGV8ZW58MHx8MHx8fDA%3D',
    'https://tillstest.com/wp-content/uploads/2017/02/AdobeStock_90550437.jpeg',
    'https://images.unsplash.com/photo-1502979932800-33d311b7ce56?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8b3BlbiUyMGJvb2t8ZW58MHx8MHx8fDA%3D'
  ]

  backgroundIndex: number = 0;
  private subscription!: Subscription;
  userAuthenticated = false;
  username = '';
  pageState: number = 0;
  intervalId: any;
  fadeClass = 'fade-in'; // Controls the fade animation class
  containerState : boolean = false;

  constructor(private authenticationService: AuthenticationService, @Inject(PLATFORM_ID) private platformId: Object, private cdr: ChangeDetectorRef) {
    this.userAuthenticated = this.authenticationService.isAuthenticated;
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.subscription = interval(8000).subscribe(() => this.cycleContent());
      if (this.authenticationService.isAuthenticated) {
        this.username = localStorage.getItem('username') || '';
      }
    }
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  cycleContent() {
    // Trigger fade-out
    this.fadeClass = 'fade-out';
    // Wait for fade-out to complete before changing background image
    setTimeout(() => {
      this.fadeClass = 'fade-in';
    }, 400); // 500ms matches the fade-out duration
    setTimeout(() => {
      this.backgroundIndex = (this.backgroundIndex + 1) % this.images.length;
    }, 500); // 500ms matches the fade-out duration
  }



  setPageState(num: number) {
    this.pageState = num;
  }

  logout() {
    this.authenticationService.logout();
    this.cdr.detectChanges();
  }

  renderQuiz(quizType: string | null) {
    this.containerState = true;
    if(this.quizContainer) this.quizContainer.clear();

    quizType == 'user' ? (
      this.quizContainer.createComponent(UserQuizComponent)
    ) : quizType == 'review' ? (
      this.quizContainer.createComponent(ReviewQuizComponent)
    ) : (
      this.quizContainer.createComponent(QuizComponent)
    )
  }

  renderRegister() {
    this.containerState = true;
    if(this.quizContainer) this.quizContainer.clear();
    this.quizContainer.createComponent(RegisterComponent);
  }

  endContainer() {
    this.containerState = false;
    this.quizContainer.clear();
  }

}
