import Letter, { LetterEvent } from "../view/Letter";
import { getRandomized } from "../common/common";
import Observer from "../common/Observer";

export class Session {
  word: string;
  letters: string[];
  letterButtons: Letter[] = [];
  errors = 0;
  stopObs = new Observer();
  private answerContainer: HTMLElement;
  private letterIndex = 0;

  constructor(word: string, answer: HTMLElement, letters: HTMLElement) {
    this.word = word;
    this.answerContainer = answer;
    this.clearElement(answer);
    this.clearElement(letters);
    this.letters = this.word.split("");
    this.renderLetters(letters);
  }

  clearElement(el: HTMLElement) {
    el.innerHTML = "";
  }

  onClick(event: LetterEvent) {
    this.checkLetter(event.letter);
  }

  checkLetter(letter: Letter) {
    const isError = this.word[this.letterIndex] != letter.value;
    this.markLetter(letter, isError);
    if (!isError) {
      this.letterIndex++;
      this.moveToAnswer(letter);
    } else {
      this.errors++;
    }
    this.checkStopGame();
  }

  moveToAnswer(letter: Letter) {
    this.answerContainer.appendChild(letter.element);
  }

  markLetter(letter: Letter, isError) {
    letter.toggleColor(isError);
    if (!isError) {
      letter.disable();
    }
  }

  checkStopGame() {
    if (this.errors > 2) {
      this.letterButtons
        .sort((a, b) => a.posIndex - b.posIndex)
        .forEach((letter) => {
          this.markLetter(letter, true);
          this.moveToAnswer(letter);
        });
      this.letterIndex = this.word.length;
    }
    if (this.letterIndex >= this.word.length) {
      this.stopGameEmitter();
    }
  }

  stopGameEmitter() {
    this.stopObs.broadcast(true);
  }

  renderLetters(container: HTMLElement) {
    this.letters.forEach((value, index) => {
      const letter = new Letter(value, index);
      letter.changeObs.subscribe(this.onClick.bind(this));
      this.letterButtons.push(letter);
    });
    this.letterButtons = getRandomized(this.letterButtons);
    this.letterButtons.forEach((button) => {
      container.appendChild(button.element);
    });
  }

  onKeydown(key: string) {
    const letter = this.letterButtons.find(
      (button) => button.value === key && button.enabled,
    );
    if (letter) {
      this.checkLetter(letter);
    } else {
      this.errors++;
      this.checkStopGame();
    }
  }
}
