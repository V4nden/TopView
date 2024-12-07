import { Game } from "../Game";
import { GameObject } from "../GameObject";
import distanceBetweenTwoDots from "../helpers/distanceBetweenTwoDots";
import hexToRgb, { IColorRGB } from "../helpers/hexToRgb";
import Explosion from "./Explosion";
import { Particle } from "./Particle";

export default class Enemy extends GameObject {
  health: number;
  color: IColorRGB;
  size: number;

  hexColor: string;
  maxHealth: number;
  rage: number;
  constructor(
    game: Game,
    x: number,
    y: number,
    health: number,
    color: string,
    size: number
  ) {
    super(game, x, y);

    this.health = health;
    this.color = hexToRgb(color) ?? { r: 0, g: 0, b: 0 };
    this.hexColor = color;
    this.size = size;
    this.maxHealth = health;
    this.rage = 0;
  }

  kill() {
    this.game.entities.enemies.splice(
      this.game.entities.enemies.indexOf(this),
      1
    );

    this.game.entities.explosions.push(
      new Explosion(
        this.game,
        this.position.x,
        this.position.y,
        100,
        this.hexColor,
        30,
        10
      )
    );
    for (let i = 0; i <= 10; i++) {
      const randomx = 5 * Math.random();
      const randomy = 5 * Math.random();
      this.game.entities.particles.push(
        new Particle(
          this.game,
          this.position.x,
          this.position.y,
          {
            x: Math.random() > 0.5 ? randomx : -randomx,
            y: Math.random() > 0.5 ? randomy : -randomy,
          },
          4,
          this.hexColor,
          100
        )
      );
    }
  }

  deathCheck() {
    if (this.health <= 0) {
      this.game.camera.zoom += 0.15;
      this.game.camera.pulse = 100;
      this.kill();
    }
  }

  damageCheck() {
    for (let i = 0; i < this.game.entities.projectiles.length; i++) {
      for (let c = 0; c <= 3; c++) {
        if (
          Math.abs(
            this.game.entities.projectiles[i].position.x +
              (this.game.entities.projectiles[i].velocity.x / 3) * c -
              this.position.x
          ) < this.size &&
          Math.abs(
            this.game.entities.projectiles[i].position.y +
              (this.game.entities.projectiles[i].velocity.y / 3) * c -
              this.position.y
          ) < this.size
        ) {
          console.log(1);
          this.health -= this.game.entities.projectiles[i].damage;
          this.game.camera.pulse += 1;
          for (let s = 0; s <= 3; s++) {
            const randomx = 2 * Math.random();
            const randomy = 2 * Math.random();
            this.game.entities.particles.push(
              new Particle(
                this.game,
                this.position.x,
                this.position.y,
                {
                  x:
                    Math.random() > 0.5
                      ? randomx +
                        this.game.entities.projectiles[i].velocity.x / 14
                      : -randomx +
                        this.game.entities.projectiles[i].velocity.x / 14,
                  y:
                    Math.random() > 0.5
                      ? randomy +
                        this.game.entities.projectiles[i].velocity.y / 14
                      : -randomy +
                        this.game.entities.projectiles[i].velocity.y / 14,
                },
                this.game.entities.projectiles[i].size / 1.5,
                this.game.entities.projectiles[i].color,
                30
              )
            );
            this.game.entities.particles.push(
              new Particle(
                this.game,
                this.position.x,
                this.position.y,
                {
                  x: Math.random() > 0.5 ? randomx : -randomx,
                  y: Math.random() > 0.5 ? randomy : -randomy,
                },
                this.game.entities.projectiles[i].size / 1.5,
                this.game.entities.projectiles[i].color,
                30
              )
            );
          }

          this.game.entities.projectiles.splice(i, 1);
          return;
        }
      }
    }
  }

  move() {
    const distanceX = (this.position.x - this.game.player.currentX) / 100;
    const distanceY = (this.position.y - this.game.player.currentY) / 100;
    const close = Math.abs(distanceX) < 3 && Math.abs(distanceY) < 3;

    if (close) {
      this.rage = 100;
    } else {
      this.rage = 0;
    }

    this.position.x -= close ? distanceX * 5 : distanceX;
    this.position.y -= close ? distanceY * 5 : distanceY;

    if (
      distanceBetweenTwoDots(
        this.position.x,
        this.game.player.currentX,
        this.position.y,
        this.game.player.currentY
      ) < 40
    ) {
      this.kill();
    }
  }

  render() {
    this.damageCheck();
    this.deathCheck();
    this.move();
    const fillcolor = `rgba(${this.color.r + this.rage}, ${this.color.g}, ${
      this.color.b
    }, ${this.health / this.maxHealth + 0.5})`;

    this.game.ctx.fillStyle = `rgba(${this.color.r + 100}, ${
      this.color.g + 100
    }, ${this.color.b + 100}, ${this.health / this.maxHealth + 0.5})`;

    this.game.ctx.shadowColor = fillcolor;
    this.game.ctx.shadowBlur = 32 + Math.sin(this.game.frames / 16) * 10;

    this.game.ctx.beginPath();
    this.game.ctx.arc(
      this.position.x - 1,
      this.position.y - 1,
      this.size,
      0,
      2 * Math.PI
    );
    this.game.ctx.fill();

    this.game.ctx.fillStyle = fillcolor;
    this.game.ctx.beginPath();
    this.game.ctx.arc(
      this.position.x - 1,
      this.position.y - 1,
      Math.abs((this.size * this.health) / this.maxHealth),
      0,
      2 * Math.PI
    );
    this.game.ctx.fill();
    this.game.ctx.shadowBlur = 0;
  }
}
