import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizQuestion } from '../quiz-question';
import { VocabularyList } from '../vocab-list';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit{

  constructor(private vocabularyList: VocabularyList) {}


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
      this.vocabularyQuiz = await this.vocabularyList.getVocabularyQuiz();
    } catch (error) {
      console.error('Error loading vocabulary quiz:', error);
    }
  }

  ngOnInit(): void {
    this.loadVocabularyQuiz();
  }

  submitAnswer(selectedOption: string) {
    this.currentSelection = selectedOption
    const currentQuestion = this.vocabularyQuiz[this.currentQuestionIndex];
    this.correctAnswer = currentQuestion.correct;
    this.isCorrect = selectedOption === this.correctAnswer;
    this.resultMessage = this.isCorrect ? 'Correct!' : 'Wrong!';
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
    // Additional reset logic if necessary
  }
}
