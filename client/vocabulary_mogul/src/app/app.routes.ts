import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { QuizComponent } from './quiz/quiz.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import { UserQuizComponent } from './user.quiz/user.quiz.component';
import { ReviewQuizComponent } from './review.quiz/review.quiz.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        title: 'Vocabulary Mogul'
    },
    {
        path: 'registerPage',
        component: RegisterComponent,
        title: 'Sign Up'
    },
    {
        path: 'quiz',
        component: QuizComponent,
        title: 'Vocabulary Quiz'
    },
    {
        path: 'login',
        component: LoginComponent,
        title: 'Log In'
    },
    {
        path: 'register',
        component: RegisterComponent,
        title: 'Register'
    },
    {
        path:'user-quiz',
        component: UserQuizComponent,
        title: 'User Quiz',
        canActivate: [AuthGuard]
    },
    {
        path:'review-quiz',
        component: ReviewQuizComponent,
        title: 'Review Quiz',
        canActivate: [AuthGuard]
    }

];
