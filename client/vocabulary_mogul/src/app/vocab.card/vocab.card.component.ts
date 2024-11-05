import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vocab-card',
  standalone: true,
  templateUrl: './vocab.card.component.html',
  styleUrls: ['./vocab.card.component.scss'],
})
export class VocabCardComponent implements OnInit {
  vocabArray: { [key: string]: string } = {
    "Equanimity (noun)": "Mental calmness, composure, and evenness of temper, especially in a difficult situation.",
    "Obsequious (adjective)": "Obedient or attentive to an excessive or servile degree.",
    "Saturnine (adjective)": "(of a person or their manner) slow or gloomy.",
    "Quixotic (adjective)": "Exceedingly idealistic; unrealistic and impractical.",
    "Cognoscenti (noun)": "People who are considered to be well informed about a particular subject.",
    "Compunction (noun)": "A feeling of guilt or moral scruple that prevents or follows the doing of something bad.",
    "Galvanize (verb)": "Shock or excite (someone) into taking action."
  };

  currentKey: string = '';
  currentValue: string = '';
  private index: number = 0;
  private entries: [string, string][] = Object.entries(this.vocabArray);

  ngOnInit(): void {
    this.displayNextPair();
  }

  private displayNextPair(): void {
    if (this.index < this.entries.length) {
      const [key, value] = this.entries[this.index];
      this.currentKey = key;
      this.currentValue = value;
      this.index++;

      // Use a Promise to ensure the timeout does not interfere with Angular's change detection
      Promise.resolve().then(() => {
        setTimeout(() => {
          this.displayNextPair();
        }, 2000);
      });
    } else {
      // Reset index and restart the display
      this.index = 0;
      this.displayNextPair();
    }
  }
}
