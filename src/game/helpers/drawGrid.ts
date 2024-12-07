import { Game } from "../Game";

export default function drawGrid(
  game: Game,
  gap: number,
  padding: number,
  width: number,
  color: string
) {
  game.ctx.fillStyle = color;
  for (let i = 0; i <= Math.abs(game.canvas.height + padding) / gap; i++) {
    game.ctx.fillRect(
      -game.camera.position.currentX,
      i * gap +
        -game.camera.position.currentY +
        (game.camera.position.currentY % gap),
      game.canvas.width + padding,
      width
    );
  }

  for (let i = 0; i <= Math.abs(game.canvas.width + padding) / gap; i++) {
    game.ctx.fillRect(
      i * gap +
        -game.camera.position.currentX +
        (game.camera.position.currentX % gap),
      -game.camera.position.currentY,
      width,
      game.canvas.height + padding
    );
  }
}
