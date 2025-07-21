import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { VocabularyDefinition } from './vocab-definition';
import { environment } from './environments/environment';

const supabaseUrl = 'https://fjvswnxotlbfadmatuae.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqdnN3bnhvdGxiZmFkbWF0dWFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4NzYyNzEsImV4cCI6MjA2ODQ1MjI3MX0.LDzj5xxjuXWa2POCm8cIRBBKMhsPmi_iBgJluMUHiq4';
const supabase = createClient(supabaseUrl, supabaseKey);

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {

  async getVocabularySubset(numArray: number[]): Promise<VocabularyDefinition[]> {

    const { data, error } = await supabase
      .from('Vocabulary')
      .select('*')
      .in('id', numArray);  // Use the `in` operator for batch querying
  
    if (error) {
      console.error('Error fetching vocabulary:', error);
      return [];
    }
    return data || [];
  }
  
  async getAllVocabulary(): Promise<VocabularyDefinition[]> {
    const { data, error } = await supabase
      .from('Vocabulary')
      .select('*');

    if (error) {
      console.error('Error fetching all vocabulary:', error);
      return [];
    }

    return data;
  }

  async getDefinitionsById(idArray: number[]): Promise<string[]> {

    const definitionArray: string[] = []
    for (let i = 0; i < idArray.length; i++) {
        const { data, error } = await supabase
          .from('Vocabulary')
          .select('*')
          .eq('id', idArray[i]);
      if (error) {
        console.log('Error fetching definition:', error);
        return [];
      }
      definitionArray.push(data[0]['definition'])
    }
    return definitionArray;
  }

}