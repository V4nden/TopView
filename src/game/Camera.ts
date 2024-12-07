import { Game } from "./Game";
import hexToRgb, { IColorRGB } from "./helpers/hexToRgb";

export class Camera {
  game: Game;

  bg: IColorRGB;
  pulse: number;
  viewport: {
    x: number;
    y: number;
    currentX: number;
    currentY: number;
  };
  position: {
    x: number;
    y: number;
    currentX: number;
    currentY: number;
  };
  zoom: number;
  smoothingFactor: number;
  constructor(game: Game) {
    this.game = game;

    this.bg = hexToRgb("#000") ?? { r: 0, g: 0, b: 0 };
    this.pulse = 255;
    this.viewport = {
      x: 0,
      y: 0,
      currentX: 0,
      currentY: 0,
    };
    this.position = {
      x: 0,
      y: 0,
      currentX: 0,
      currentY: 0,
    };
    this.zoom = 3;
    this.smoothingFactor = 10;

    window.addEventListener("mousemove", (e) => {
      this.game.mousePosition = { x: e.clientX, y: e.clientY };
      this.setViewportOffset(
        -Math.sin(
          (e.clientX - this.game.canvas.width / 2) / this.game.canvas.width
        ) * 150,
        -Math.sin(
          (e.clientY - this.game.canvas.height / 2) / this.game.canvas.height
        ) * 150
      );
    });
  }

  setViewportOffset(x: number, y: number) {
    this.viewport.x = x;
    this.viewport.y = y;
  }

  addViewportOffset(x: number, y: number) {
    this.viewport.x += x;
    this.viewport.y += y;
  }

  setPosition(x: number, y: number) {
    this.position.x = x;
    this.position.y = y;
  }

  addPosition(x: number, y: number) {
    this.position.x += x;
    this.position.y += y;
  }

  render() {
    this.game.ctx.fillStyle = `rgba(${this.bg.r + this.pulse}, ${
      this.bg.g + this.pulse
    }, ${this.bg.b + this.pulse}, 1)`;
    this.game.ctx.fillRect(
      0,
      0,
      this.game.canvas.width,
      this.game.canvas.height
    );

    this.game.ctx.fillStyle = "#fff";
    this.game.ctx.fillRect(
      this.game.canvas.width / 2,
      0,
      2,
      this.game.canvas.height
    );
    this.game.ctx.fillRect(
      0,
      this.game.canvas.height / 2,
      this.game.canvas.width,
      2
    );
    this.viewport.currentX +=
      (this.viewport.x - this.viewport.currentX) / this.smoothingFactor;
    this.viewport.currentY +=
      (this.viewport.y - this.viewport.currentY) / this.smoothingFactor;

    this.position.currentX +=
      (this.position.x - this.position.currentX) / this.smoothingFactor / 2;
    this.position.currentY +=
      (this.position.y - this.position.currentY) / this.smoothingFactor / 2;

    this.game.ctx.scale(this.zoom, this.zoom);

    this.zoom -= (1 - 1 / this.zoom) / 20;

    this.pulse -= this.pulse / 20;

    this.game.ctx.translate(
      this.position.currentX +
        this.viewport.currentX -
        (this.game.canvas.width / 2 / this.zoom) * (this.zoom - 1),
      this.position.currentY +
        this.viewport.currentY -
        (this.game.canvas.height / 2 / this.zoom) * (this.zoom - 1)
    );
  }
}
