import Enemy from "./entities/Enemy";
import { Game } from "./Game";

export default function init(canvas: HTMLCanvasElement) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const game = new Game(canvas);

  game.entities.enemies.push(new Enemy(game, 500, 500, 1000, "#222", 10));

  game.initialize();
}
