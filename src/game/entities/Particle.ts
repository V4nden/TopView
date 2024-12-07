import { Game } from "../Game";
import { GameObject } from "../GameObject";
import hexToRgb, { IColorRGB } from "../helpers/hexToRgb";

export class Particle extends GameObject {
  velocity: { x: number; y: number };
  live: number;
  color: IColorRGB;
  size: number;
  curLive: number;
  constructor(
    game: Game,
    x: number,
    y: number,
    velocity: { x: number; y: number },
    size: number,
    color: string,
    live: number
  ) {
    super(game, x, y);
    this.velocity = velocity;
    this.live = live;
    this.color = hexToRgb(color) ?? { r: 0, g: 0, b: 0 };
    this.size = size;
    this.curLive = live;
  }

  render() {
    this.curLive -= 1;
    this.game.ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${
      this.color.b
    }, ${this.curLive / this.live})`;
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    this.game.ctx.fillRect(
      this.position.x,
      this.position.y,
      this.size,
      this.size
    );
    if (
      this.curLive <= 1 ||
      this.position.x + this.game.camera.position.currentX < -100 ||
      this.position.x >
        this.game.canvas.width - this.game.camera.position.currentX + 100 ||
      this.position.y + this.game.camera.position.currentY < -100 ||
      this.position.y + this.game.camera.position.currentY >
        this.game.canvas.height + 100
    ) {
      this.game.entities.particles.splice(
        this.game.entities.particles.indexOf(this),
        1
      );
    }
  }
}
