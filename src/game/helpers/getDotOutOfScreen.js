export default function getDotOutOfScreen(canvas, camera, padding) {
  let side = null;
  let random = Math.random();
  if (random > 0) {
    side = "left";
  }
  if (random > 0.25) {
    side = "right";
  }
  if (random > 0.5) {
    side = "top";
  }
  if (random > 0.75) {
    side = "bottom";
  }
  if (side == "left") {
    return {
      x: -camera.position.currentX - padding,
      y: canvas.height * Math.random() - camera.position.currentY,
    };
  }
  if (side == "right") {
    return {
      x: canvas.width + -camera.position.currentX + padding,
      y: canvas.height * Math.random() - camera.position.currentY,
    };
  }
  if (side == "bottom") {
    return {
      x: canvas.width * Math.random() - camera.position.currentX,
      y: canvas.height + -camera.position.currentY + padding,
    };
  }
  if (side == "top") {
    return {
      x: canvas.width * Math.random() - camera.position.currentX,
      y: -camera.position.currentY - padding,
    };
  }
}
