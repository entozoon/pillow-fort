import Game from "./lib/game";
const initGame = (): void => {
  const canvas = document.getElementById("game-canvas") as HTMLCanvasElement;
  const game = new Game({ canvas });
};
window.addEventListener("DOMContentLoaded", initGame);
// @ts-ignore
module.hot && module.hot.accept(initGame);
