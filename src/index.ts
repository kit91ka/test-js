import { Game } from "./logic/Game";
import { words } from "./wordSet";

window.onload = function () {
  const game = new Game(words);
};
