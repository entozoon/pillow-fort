import Game from "./lib/game";
const initGame = (): void => {
  const canvasElement = document.getElementById(
    "game-canvas"
  ) as HTMLCanvasElement;
  const game = new Game({ canvasElement });
  game.createScene().animate();
};
window.addEventListener("DOMContentLoaded", initGame);
// @ts-ignore
module.hot && module.hot.accept(initGame);
