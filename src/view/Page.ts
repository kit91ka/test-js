export default class Page {
  constructor() {}

  changeView(id: string, value: string | number) {
    document.getElementById(id).innerText = value.toString();
  }
  toggleVision(id: string, shown: boolean) {
    document.getElementById(id).classList.remove(shown ? "d-none" : "d-flex");
    document.getElementById(id).classList.add(shown ? "d-flex" : "d-none");
  }
}
