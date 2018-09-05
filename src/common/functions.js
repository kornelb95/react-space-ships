export function distancePoint(point, center, angle) {
  return {
    x:
      (point.x - center.x) * Math.cos(angle) -
      (point.y - center.y) * Math.sin(angle) +
      center.x,
    y:
      (point.x - center.x) * Math.sin(angle) +
      (point.y - center.y) * Math.cos(angle) +
      center.y
  };
}
export function randomNumberBetween(min, max) {
  return Math.random() * (max - min + 1) + min;
}
export function randomNumberBetweenConstraint(
  min,
  max,
  constraintMin,
  constraintMax
) {
  let number = randomNumberBetween(min, max);
  while (number > constraintMin && number < constraintMax) {
    number = Math.random() * (max - min + 1) + min;
  }
  return number;
}
