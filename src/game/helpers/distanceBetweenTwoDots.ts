export default function distanceBetweenTwoDots(
  x1: number,
  x2: number,
  y1: number,
  y2: number
) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}
