import Observer from "../common/Observer";

export default class Letter {
  // element :HTMLElement;
  value: string;
  element = document.createElement("button");
  changeObs = new Observer();
  enabled = true;
  posIndex: number;
  mouseDownListener: EventListenerOrEventListenerObject;
  mouseUpListener: EventListenerOrEventListenerObject;
  private isError: boolean;

  constructor(value: string, posIndex: number) {
    this.value = value;
    this.posIndex = posIndex;
    this.element.innerText = this.value;
    this.element.className = "btn btn-primary px-3 ml-1";
    this.mouseDownListener = this.onClick.bind(this);
    this.mouseUpListener = this.returnColorIfError.bind(this);
    this.element.addEventListener("mousedown", this.mouseDownListener);
    this.element.addEventListener("mouseup", this.mouseUpListener);
  }

  toggleColor(isError?: boolean) {
    this.isError = isError;
    const classes = ["btn-danger", "btn-success"];
    const [oldOne, newOne] = isError ? [1, 0] : [0, 1];
    this.element.classList.remove("btn-primary");
    this.element.classList.remove(classes[oldOne]);
    this.element.classList.add(classes[newOne]);
  }

  returnColorIfError() {
    if (this.isError) {
      this.element.classList.remove("btn-danger");
      this.element.classList.add("btn-primary");
    }
  }

  onClick(event) {
    this.changeObs.broadcast({ event, letter: this } as LetterEvent);
  }

  disable() {
    this.enabled = false;
    this.element.removeEventListener("click", this.mouseDownListener);
    this.element.removeEventListener("mouseup", this.mouseUpListener);
  }
}

export interface LetterEvent {
  event: MouseEvent;
  letter: Letter;
}
