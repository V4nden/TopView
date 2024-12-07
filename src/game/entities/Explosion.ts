import { Game } from "../Game.js";
import { GameObject } from "../GameObject.js";
import distanceBetweenTwoDots from "../helpers/distanceBetweenTwoDots.js";
import hexToRgb, { IColorRGB } from "../helpers/hexToRgb.js";

export default class Explosion extends GameObject {
  size: number;
  color: IColorRGB;
  live: number;
  damage: number;
  curLive: number;

  constructor(
    game: Game,
    x: number,
    y: number,
    size: number,
    color: string,
    live: number,
    damage: number
  ) {
    super(game, x, y);
    this.live = live;
    this.color = hexToRgb(color) ?? { r: 0, g: 0, b: 0 };
    this.size = size;
    this.curLive = live;
    this.damage = damage;

    this.applyDamage();
  }

  applyDamage() {
    if (
      distanceBetweenTwoDots(
        this.game.player.currentX,
        this.position.x,
        this.game.player.currentY,
        this.position.y
      ) < this.size
    ) {
      this.game.player.damage(this.damage);
    }
    for (const enemy of this.game.entities.enemies) {
      if (
        distanceBetweenTwoDots(
          enemy.position.x,
          this.position.x,
          enemy.position.y,
          this.position.y
        ) < this.size
      ) {
        if (enemy.health - this.damage < 0) {
          enemy.kill();
        } else {
          enemy.health -= this.damage;
        }
      }
    }
  }

  render() {
    this.curLive -= 1;
    this.game.ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${
      this.color.b
    }, ${this.curLive / this.live})`;

    this.game.ctx.beginPath();
    this.game.ctx.arc(
      this.position.x - 1,
      this.position.y - 1,
      this.size * Math.abs(Math.sin((this.curLive / this.live) * 3)),
      0,
      2 * Math.PI
    );
    this.game.ctx.fill();
    if (
      this.curLive <= 1 ||
      this.position.x + this.game.camera.position.currentX < -100 ||
      this.position.x >
        this.game.canvas.width - this.game.camera.position.currentX + 100 ||
      this.position.y + this.game.camera.position.currentY < -100 ||
      this.position.y + this.game.camera.position.currentY >
        this.game.canvas.height + 100
    ) {
      this.game.entities.explosions.splice(
        this.game.entities.explosions.indexOf(this),
        1
      );
    }
  }
}
