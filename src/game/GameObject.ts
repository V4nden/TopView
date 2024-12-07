import { Game } from "./Game";

export class GameObject {
  game: Game;
  position: { x: number; y: number };

  constructor(game: Game, x: number, y: number) {
    this.game = game;
    this.position = { x: x, y: y };
  }

  render() {
    console.log("GAMNO!");
  }
}
