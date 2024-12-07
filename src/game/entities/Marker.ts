import { Game } from "../Game";
import { GameObject } from "../GameObject";
import distanceBetweenTwoDots from "../helpers/distanceBetweenTwoDots";
import hexToRgb, { IColorRGB } from "../helpers/hexToRgb";

export class Marker extends GameObject {
  size: number;
  color: IColorRGB;
  sprite: HTMLImageElement;
  padding: number;
  constructor(
    game: Game,
    x: number,
    y: number,
    size: number,
    color: string,
    sprite: HTMLImageElement,
    padding: number
  ) {
    super(game, x, y);
    this.size = size;
    this.color = hexToRgb(color) ?? { r: 0, g: 0, b: 0 };
    this.sprite = sprite;
    this.padding = padding;
  }
  render() {
    const out = {
      right:
        this.position.x + this.size >
        this.game.canvas.width -
          this.game.camera.position.currentX -
          this.game.camera.viewport.currentX,
      left:
        this.position.x <
        -(
          this.game.camera.position.currentX +
          this.game.camera.viewport.currentX
        ),
      top:
        this.position.y <
        -(
          this.game.camera.position.currentY +
          this.game.camera.viewport.currentY
        ),
      bottom:
        this.position.y + this.size >
        this.game.canvas.height -
          this.game.camera.position.currentY -
          this.game.camera.viewport.currentY,
    };

    const stickPositions = {
      left:
        -this.game.camera.position.currentX -
        this.game.camera.viewport.currentX,
      right:
        this.game.canvas.width +
        -this.game.camera.position.currentX -
        this.game.camera.viewport.currentX -
        this.size,
      top:
        -this.game.camera.position.currentY -
        this.game.camera.viewport.currentY,
      bottom:
        this.game.canvas.height +
        -this.game.camera.position.currentY -
        this.game.camera.viewport.currentY -
        this.size,
    };

    if (out.bottom || out.left || out.right || out.top) {
      this.game.ctx.globalAlpha =
        distanceBetweenTwoDots(
          this.game.player.currentX,
          this.position.x,
          this.game.player.currentY,
          this.position.y
        ) / this.game.canvas.width;

      this.game.ctx.drawImage(
        this.sprite,
        out.left
          ? stickPositions.left
          : out.right
          ? stickPositions.right
          : this.position.x,
        out.top
          ? stickPositions.top
          : out.bottom
          ? stickPositions.bottom
          : this.position.y,
        this.size,
        this.size
      );
      this.game.ctx.globalAlpha = 1;
    }
  }
}
