import { Component, OnInit, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { VocabularyList } from '../vocab-list';
import { QuizQuestion } from '../quiz-question';

@Component({
  selector: 'app-user.quiz',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user.quiz.component.html',
  styleUrl: './user.quiz.component.scss'
})
export class UserQuizComponent implements OnInit{

  constructor(private http: HttpClient, private router: Router, private vocabularyList: VocabularyList){}
  

  private apiURL = environment.apiURL;
  userQuizObject : any;
  vocabularyQuiz: QuizQuestion[] = [];
  currentQuestionIndex: number = 0;
  resultShown: boolean = false;
  resultMessage: string = '';
  correctAnswer: string = '';
  isCorrect: boolean = false;
  finalScore: number = 100;
  showFinalResults: boolean = false;
  currentSelection : string = '';

  async loadVocabularyQuiz() {
    try {
      this.vocabularyQuiz = await this.vocabularyList.getVocabularyQuiz(this.userQuizObject);
    } catch (error) {
      console.error('Error loading vocabulary quiz:', error);
    }
  }

  async ngOnInit(): Promise<void> {
    try {
      // Await the result of the HTTP call
      const res = await this.http.get<any>(`${this.apiURL}/vocabulary`).toPromise();
  
      // Assign the result to the userQuizObject
      this.userQuizObject = res['userVocabulary'];
  
      // Now load the vocabulary quiz, since the vocabulary data is available
      this.loadVocabularyQuiz();
  
    } catch (err) {
      // Log the error for debugging and navigate away if something goes wrong
      console.error('Error during registration:', err);
      this.router.navigate(['/']);
    }
  }

  submitAnswer(selectedOption: string) {
    this.currentSelection = selectedOption
    const currentQuestion = this.vocabularyQuiz[this.currentQuestionIndex];
    this.correctAnswer = currentQuestion.correct;
    this.isCorrect = selectedOption === this.correctAnswer;
    if (this.isCorrect) this.updateVocabulary(currentQuestion['id'])
    this.resultMessage = this.isCorrect ? 'Right!' : 'Wrong!';
    this.resultShown = true;
    this.finalScore = Math.round(this.isCorrect ? this.finalScore : this.finalScore - 6.66);
  }

  nextQuestion() {
    this.resultShown = false;
    if (this.currentQuestionIndex < this.vocabularyQuiz.length - 1) {
      this.currentQuestionIndex++;
    } else {
      // Handle end of quiz, perhaps by resetting or showing a final score
      this.showFinalResults = true;
    }
  }

  resetQuiz() {
    this.currentQuestionIndex = 0;
    this.resultShown = false;
    this.showFinalResults = false;
    this.finalScore = 100;
    // Additional reset logic if necessary
  }

  updateVocabulary(wordId : number) {
      this.http.patch(`${this.apiURL}/vocabulary`, {id: wordId})
      .pipe(
        catchError(err => {
          console.error('Error during registration:', err);
          return throwError(err);
        })
      )
      .subscribe(
        (res) => {
          console.log('Updated correct count')
        }, (err) => {
          console.log('Failed to update correct count')
        }
      )
    }
  }
