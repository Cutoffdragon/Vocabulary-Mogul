// src/app/vocab-list.ts
import { Injectable } from '@angular/core';
import { VocabularyDefinition } from './vocab-definition';
import { QuizQuestion } from './quiz-question';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class VocabularyList {
    private vocabularySubset: VocabularyDefinition[] = [];
    private distractorCache: { [id: number]: string[] } = {};

    constructor(private supabaseService: SupabaseService) {}

    async loadVocabularyForQuiz(): Promise<void> {
        try {
            // Fetch the subset of vocabulary words
            this.vocabularySubset = await this.supabaseService.getVocabularySubset(this.generateVocabularyNumbers(15, 562));
    
            // Create an array of promises for fetching distractors
            const distractorPromises = this.vocabularySubset.map(async (vocab) => {
                this.distractorCache[vocab.id] = await this.supabaseService.getDefinitionsById(this.generateVocabularyNumbers(3, 562));
            });
    
            // Wait for all distractor fetches to complete
            await Promise.all(distractorPromises);
    
        } catch (error) {
            console.error("Failed to load vocabulary for quiz:", error);
            // Handle the error appropriately, e.g., show a message to the user
        }
    }

    private getCachedDistractors(correctId: number): string[] {
        return this.distractorCache[correctId];
    }

    private shuffleArray(array: any[]): any[] {
        return array.sort(() => Math.random() - 0.5);
    }


    getVocabularyQuiz(): QuizQuestion[] {
        
        const quizQuestions: QuizQuestion[] = [];

        this.loadVocabularyForQuiz().then(() => {
        
            for (const vocab of this.vocabularySubset) {
                const distractors = this.getCachedDistractors(Number(vocab.id)); // Use cached distractors
                const options = this.shuffleArray([vocab.definition, ...distractors]); // Include the correct definition and shuffle
        
                quizQuestions.push({ 
                    word: vocab.word, 
                    options: options, 
                    correct: vocab.definition 
                });
            }
        });
        
        return quizQuestions;
    }

    // Utility method to generate unique random numbers
    private generateVocabularyNumbers(count: number, max: number): number[] {
        const numbers = new Set<number>();

        while (numbers.size < count) {
            const randomNumber = Math.floor(Math.random() * max);
            numbers.add(randomNumber);
        }
        return Array.from(numbers);
    } 
    
}


