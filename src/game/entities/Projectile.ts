import { Game } from "../Game";
import { GameObject } from "../GameObject";

export class Projectile extends GameObject {
  velocity: { x: number; y: number };
  size: number;
  color: string;
  damage: number;
  constructor(
    game: Game,
    x: number,
    y: number,
    velocity: { x: number; y: number },
    damage: number,
    size: number,
    color: string
  ) {
    super(game, x, y);
    this.velocity = velocity;
    this.size = size;
    this.color = color;
    this.damage = damage;
  }

  render() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (
      this.position.x + this.game.camera.position.currentX < -100 ||
      this.position.x >
        this.game.canvas.width - this.game.camera.position.currentX + 100 ||
      this.position.y + this.game.camera.position.currentY < -100 ||
      this.position.y + this.game.camera.position.currentY >
        this.game.canvas.height + 100
    ) {
      this.game.entities.projectiles.splice(
        this.game.entities.projectiles.indexOf(this),
        1
      );
      console.log("delete");
    }

    this.game.ctx.fillStyle = this.color;
    this.game.ctx.beginPath();
    this.game.ctx.arc(
      this.position.x - 1,
      this.position.y - 1,
      this.size,
      0,
      2 * Math.PI
    );
    this.game.ctx.fill();
  }
}
