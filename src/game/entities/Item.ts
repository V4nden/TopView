import { Game } from "../Game";
import { GameObject } from "../GameObject";
import distanceBetweenTwoDots from "../helpers/distanceBetweenTwoDots";
import hexToRgb, { IColorRGB } from "../helpers/hexToRgb";
import { Marker } from "./Marker";

export class Item extends GameObject {
  size: number;
  color: IColorRGB;
  live: number;
  sprite: { sprite: HTMLImageElement; loaded: boolean };
  hexColor: string;
  marker!: Marker;
  curLive: number;
  callback: (item: Item) => void;
  constructor(
    game: Game,
    x: number,
    y: number,
    size: number,
    color: string,
    live: number,
    sprite: string,
    callback: (item: Item) => void
  ) {
    super(game, x, y);

    this.live = live;

    this.color = hexToRgb(color) ?? { r: 0, g: 0, b: 0 };

    this.hexColor = color;
    this.sprite = { sprite: new Image(24, 24), loaded: false };
    this.sprite.sprite.src = "assets/" + sprite;
    this.sprite.sprite.onload = () => {
      console.log("loaded");
      this.sprite.loaded = true;

      this.marker = new Marker(
        this.game,
        x + this.size / 2 - 16,
        y + this.size / 2 - 16,
        32,
        color,
        this.sprite.sprite,
        0
      );
      this.game.entities.markers.push(this.marker);
    };
    this.size = size;

    this.curLive = live;
    this.callback = callback;
  }

  applyCheck() {
    if (
      distanceBetweenTwoDots(
        this.position.x + this.size / 2,
        this.game.player.currentX,
        this.position.y + this.size / 2,
        this.game.player.currentY
      ) < this.size
    ) {
      this.game.entities.items.splice(
        this.game.entities.items.indexOf(this),
        1
      );
      this.game.entities.markers.splice(
        this.game.entities.markers.indexOf(this.marker),
        1
      );
      this.callback(this);
    }
  }

  render() {
    if (!this.sprite.loaded) return;
    this.curLive -= 1;
    const fillcolor = `rgba(${this.color.r}, ${this.color.g}, ${
      this.color.b
    }, ${this.curLive / this.live})`;
    this.game.ctx.fillStyle = fillcolor;

    const pulseSize =
      this.size + Math.abs(Math.sin(this.game.frames / 60)) * 30;

    this.game.ctx.drawImage(
      this.sprite.sprite,
      this.position.x - Math.abs(Math.sin(this.game.frames / 60)) * 15,
      this.position.y - Math.abs(Math.sin(this.game.frames / 60)) * 15,
      pulseSize,
      pulseSize
    );

    this.game.ctx.shadowColor = fillcolor;
    this.game.ctx.shadowBlur = 16 + Math.sin(this.game.frames / 30) * 3;
    if (this.curLive <= 1) {
      this.game.entities.items.splice(
        this.game.entities.items.indexOf(this),
        1
      );
      this.game.entities.markers.splice(
        this.game.entities.markers.indexOf(this.marker),
        1
      );
    }
    this.applyCheck();
  }
}
