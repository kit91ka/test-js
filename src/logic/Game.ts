import { Session } from "./Session";
import { getRandomized } from "../common/common";
import log from "../decorators/log";
import Page from "../view/Page";

export class Game extends Page {
  words: string[];
  private session: Session;
  sessions = 6;
  currentSession = 0;
  sessionSub: Function;
  lastError;
  stats = {
    wordsWithoutErrors: 0,
    errors: 0,
    maxErrors: 0,
    maxErrorsWord: "There's no any! Well done",
  };
  constructor(words: string[]) {
    super();
    this.words = getRandomized(words, this.sessions);
    this.startSession();
    document.addEventListener("keydown", (event) => this.keydown(event));
    this.changeView("total_questions", `${this.sessions}`);
    this.toggleVision("stats", false);
    // this.showStats();
  }
  changeSession() {
    this.session.stopObs.unsubscribe(this.sessionSub);
    this.currentSession++;
    if (this.session) {
      this.saveStats();
    }
    if (this.currentSession < this.sessions) {
      new Promise((res, rej) => {
        setTimeout(res, 1000);
      }).then(this.startSession.bind(this));
    } else {
      this.showStats();
    }
  }
  @log
  keydown(event: KeyboardEvent) {
    const key = event.key;
    if (/^[a-zA-Z]$/.test(key)) {
      this.session.onKeydown(key);
    } else if (/^[а-яА-Я]$/.test(key)) {
      this.changeView(
        "errors",
        "You're not pressing the english letters." +
          " Try to change the language",
      );
      clearTimeout(this.lastError);
      this.lastError = setTimeout(
        () => (document.getElementById("errors").innerText = ""),
        700,
      );
    }
  }

  startSession() {
    document.getElementById("current_question").innerText = `${
      this.currentSession + 1
    }`;
    this.session = new Session(
      this.words[this.currentSession],
      document.getElementById("answer"),
      document.getElementById("letters"),
    );
    this.sessionSub = this.changeSession.bind(this);
    this.session.stopObs.subscribe(this.sessionSub);
  }

  saveStats() {
    this.stats.errors += this.session.errors;
    if (this.session.errors > this.stats.maxErrors) {
      this.stats.maxErrors = this.session.errors;
      this.stats.maxErrorsWord = this.session.word;
    }
    if (!this.session.errors) {
      this.stats.wordsWithoutErrors++;
    }
  }

  showStats() {
    this.toggleVision("game", false);
    this.toggleVision("stats", true);
    this.changeView("words_without_errors", this.stats.wordsWithoutErrors);
    this.changeView("errors_count", this.stats.maxErrors);
    this.changeView("max_errors_word", this.stats.maxErrorsWord);
  }
}
