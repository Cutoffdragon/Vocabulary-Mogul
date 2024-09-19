import { Component, inject } from '@angular/core';
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
export class QuizComponent {
  vocabularyList: VocabularyList = inject(VocabularyList);
  vocabularyQuiz: QuizQuestion[] = [];
  currentQuestionIndex: number = 0;
  resultShown: boolean = false;
  resultMessage: string = '';
  correctAnswer: string = '';
  isCorrect: boolean = false;
  finalScore: number = 100;
  showFinalResults: boolean = false;

  constructor() {
    this.vocabularyQuiz = this.vocabularyList.getVocabularyQuiz();
  }

  submitAnswer(selectedOption: string) {
    const currentQuestion = this.vocabularyQuiz[this.currentQuestionIndex];
    this.correctAnswer = currentQuestion.correct;
    this.isCorrect = selectedOption === this.correctAnswer;
    this.resultMessage = this.isCorrect ? 'Right!' : 'Wrong!';
    this.resultShown = true;
    this.finalScore = this.isCorrect ? this.finalScore : this.finalScore - 6.66;
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
    // Additional reset logic if necessary
  }
}
