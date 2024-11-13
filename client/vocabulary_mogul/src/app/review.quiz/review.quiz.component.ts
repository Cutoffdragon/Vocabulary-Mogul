import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import { VocabularyList } from '../vocab-list';
import { QuizQuestion } from '../quiz-question';


@Component({
  selector: 'app-review.quiz',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './review.quiz.component.html',
  styleUrl: './review.quiz.component.scss'
})
export class ReviewQuizComponent implements OnInit{

  constructor(private http: HttpClient, private router: Router, private vocabularyList: VocabularyList){}

  @Input() endContainerHandler!: () => void;

  endContainer() {
    if (this.endContainerHandler) {
      this.endContainerHandler();
    }
  }
  

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
      if(this.vocabularyQuiz.length === 0) {
        window.alert('You have not learned any words yet. Try the user vocabulary quiz a few times first!');
        window.location.reload();
      }

    } catch (error) {
      console.error('Error loading vocabulary quiz:', error);
    }
  }

  async ngOnInit(): Promise<void> {
    try {
      // Await the result of the HTTP call
      const res = await this.http.get<any>(`${this.apiURL}/review`).toPromise();
  
      // Assign the result to the userQuizObject
      this.userQuizObject = res['userVocabulary'];
  
      // Now load the vocabulary quiz, since the vocabulary data is available
      this.loadVocabularyQuiz();
  
    } catch (err) {
      // Log the error for debugging and navigate away if something goes wrong
      console.error('Error fetching quiz', err);
      this.router.navigate(['/']);
    }
  }

  submitAnswer(selectedOption: string) {
    this.currentSelection = selectedOption
    const currentQuestion = this.vocabularyQuiz[this.currentQuestionIndex];
    this.correctAnswer = currentQuestion.correct;
    this.isCorrect = selectedOption === this.correctAnswer;
    this.resultMessage = this.isCorrect ? 'Right!' : 'Wrong!';
    this.resultShown = true;
    this.finalScore = Math.round(this.isCorrect ? this.finalScore : this.finalScore - 6.66);
  }

  nextQuestion() {
    this.resultShown = false;
    if (this.currentQuestionIndex < this.vocabularyQuiz.length - 1) {
      this.currentQuestionIndex++;
    } else {
      this.showFinalResults = true;
    }
  }

  resetQuiz() {
    this.currentQuestionIndex = 0;
    this.resultShown = false;
    this.showFinalResults = false;
    this.finalScore = 100;
  }

}
