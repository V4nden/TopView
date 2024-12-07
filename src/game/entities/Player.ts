import { Game } from "../Game";
import { GameObject } from "../GameObject";
import { Particle } from "./Particle";
import { Projectile } from "./Projectile";

export class Player extends GameObject {
  currentX: number;
  currentY: number;
  smoothingFactor: number;
  spread: number;
  health: number;
  maxHealth: number;
  speed: number;
  controls: { [key: string]: boolean };
  shooting: boolean;
  constructor(game: Game) {
    super(game, game.canvas.width / 2, game.canvas.height / 2);

    this.currentX = 0;
    this.currentY = 0;
    this.smoothingFactor = 10;

    this.spread = 10;
    this.health = 100;
    this.maxHealth = 100;
    this.speed = 15;
    this.controls = {
      forward: false,
      left: false,
      right: false,
      back: false,
    };
    this.shooting = false;

    window.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "w":
          this.controls.forward = true;
          break;
        case "a":
          this.controls.left = true;
          break;
        case "s":
          this.controls.back = true;
          break;
        case "d":
          this.controls.right = true;
          break;
      }
    });
    window.addEventListener("keyup", (e) => {
      switch (e.key) {
        case "w":
          this.controls.forward = false;
          break;
        case "a":
          this.controls.left = false;
          break;
        case "s":
          this.controls.back = false;
          break;
        case "d":
          this.controls.right = false;
          break;
      }
    });

    window.addEventListener("mousedown", () => {
      this.shooting = true;
    });
    window.addEventListener("mouseup", () => {
      this.shooting = false;
    });
  }

  damage(amount: number) {
    this.health -= amount;
    for (let s = 0; s <= 30; s++) {
      const randomx = 20 * Math.random();
      const randomy = 20 * Math.random();
      this.game.entities.particles.push(
        new Particle(
          this.game,
          this.currentX,
          this.currentY,
          {
            x: Math.random() > 0.5 ? randomx : -randomx,
            y: Math.random() > 0.5 ? randomy : -randomy,
          },
          3,
          "#ffffff",
          150
        )
      );
    }
  }

  shot() {
    this.game.entities.projectiles.push(
      new Projectile(
        this.game,
        this.currentX,
        this.currentY,
        {
          x:
            ((this.game.mousePosition.x -
              this.currentX -
              this.game.camera.viewport.currentX -
              this.game.camera.position.currentX) /
              this.game.canvas.width) *
            (this.game.canvas.width / this.game.canvas.height) *
            100,
          y:
            ((this.game.mousePosition.y -
              this.currentY -
              this.game.camera.viewport.currentY -
              this.game.camera.position.currentY) /
              this.game.canvas.height) *
            100,
        },
        10,
        2,
        "#fff"
      )
    );
  }

  control() {
    if (this.controls.forward) {
      this.position.y -= this.speed;
      this.game.camera.addPosition(0, this.speed);
    }
    if (this.controls.back) {
      this.position.y += this.speed;
      this.game.camera.addPosition(0, -this.speed);
    }
    if (this.controls.right) {
      this.position.x += this.speed;
      this.game.camera.addPosition(-this.speed, 0);
    }
    if (this.controls.left) {
      this.position.x -= this.speed;
      this.game.camera.addPosition(this.speed, 0);
    }
  }

  render() {
    this.currentX += (this.position.x - this.currentX) / this.smoothingFactor;
    this.currentY += (this.position.y - this.currentY) / this.smoothingFactor;

    this.game.ctx.fillStyle = "#ffffff44";

    this.control();

    if (Math.round(this.game.frames) % 5 === 1 && this.shooting) this.shot();

    this.game.ctx.fillStyle = `rgba(255, ${
      (1000 * this.health) / this.maxHealth
    }, ${(255 * this.health) / this.maxHealth}, 1)`;
    this.game.ctx.beginPath();
    this.game.ctx.arc(this.currentX, this.currentY, 8, 0, 2 * Math.PI);
    this.game.ctx.fill();
  }
}
