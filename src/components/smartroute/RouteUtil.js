/**
 * Represents a point in two dimensions. Used as the input for `solve`.
 * @class
 * @param {number} x abscissa
 * @param {number} y ordinate
 * @param {boolean} tp if true, distance to this point is 0.
 */
export class Point {
  constructor(x, y, tp = false) {
    this.x = x;
    this.y = y;
    this.tp = tp;
  }
}

/**
 * A simple distance function.
 * @param {Point} a
 * @param {Point} b
 * @returns {number} The Euclidean distance between p and q
 */
export const euclidean = (a, b) => {
  if (b.tp) return 0; // The destination is somewhere that can be teleported to.
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
};
