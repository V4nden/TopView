import { Camera } from "./Camera";
import { Player } from "./entities/Player";
import { GameObject } from "./GameObject";
import drawGrid from "./helpers/drawGrid";

export class Game {
  canvas: HTMLCanvasElement;
  ctx!: CanvasRenderingContext2D;
  camera: Camera;
  frames: number;
  mousePosition: { x: number; y: number };

  player: Player;

  entities: {
    [key: string]: GameObject[];
  };

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (ctx != null) {
      this.ctx = ctx;
    }

    this.camera = new Camera(this);
    this.mousePosition = { x: 0, y: 0 };

    this.frames = 0;
    this.player = new Player(this);

    window.addEventListener("mousemove", (e) => {
      this.mousePosition = { x: e.clientX, y: e.clientY };
    });

    this.entities = {
      particles: [],
      projectiles: [],
      items: [],
      markers: [],
      enemies: [],
      explosions: [],
    };
  }

  initialize() {
    const animate = () => {
      this.ctx.reset();

      this.camera.render();

      this.frames += 1;

      if (this.frames % 32 == 0) {
        // spawnEnemies();
      }

      drawGrid(this, 64, 256, 4, "#ffffff08");

      this.ctx.fillStyle = "#fff";
      this.ctx.fillRect(150, 150, 50, 50);

      this.player.render();
      for (const entities of Object.values(this.entities)) {
        if (entities instanceof Player) {
          entities.render();
        } else {
          for (const entity of entities) {
            entity.render();
          }
        }
      }

      // elBuffs.innerHTML = "";
      // for (const buffI of uiBuffs) {
      //   elBuffs.innerHTML += `<div class="buff">
      //     <span class="icon">${buffI.icon}</span>
      //     <span class="title">${buffI.title}</span>
      //     <span class="time">${-Math.round(
      //       (Date.now() - buffI.time) / 1000
      //     )}</span>
      //   </div>`;
      // }

      requestAnimationFrame(animate);
    };
    animate();
  }
}
