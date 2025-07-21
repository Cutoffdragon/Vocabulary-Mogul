import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { VocabularyDefinition } from './vocab-definition';
import { environment } from './environments/environment';

const supabaseUrl = environment.supabaseURL;
const supabaseKey = environment.supabaseKey;
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