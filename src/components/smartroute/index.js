import _ from 'lodash';
import L from 'leaflet';
import { solve as simulatedAnnealingSolve } from './SimulatedAnnealing';
import { Point } from './RouteUtil';
import { linePropertiesSmart } from '../map/LayerConstants';

/**
 * @param {Number} quality A number like 1, 2, 3, 4, 5...
 * @returns A threshold value like 0.9, 0.99, 0.999, 0.9999, 0.99999, etc.
 */
const qualityToThreshold = (quality) => 1 - 1 / 10 ** quality;

// TODO: Add another method.
export const METHODS = {
  simulatedAnnealing: {
    solve: simulatedAnnealingSolve,
    key: 'smart-route-method-simulated-annealing',
  },
};
export const DEFAULT_METHOD = Object.keys(METHODS)[0];

/**
 * Given a list of points and the distances between each pair of points,
 * what is the shortest possible route that visits each point exactly once and returns to the origin point?
 *
 * Implementation provided by https://github.com/lovasoa/salesman.js.
 * @param {Point[]} points The points to visit.
 * @param {Number} quality Convergence speed. Higher values have exponentially higher thresholds.
 * @returns {Point[]} The input array, rearranged to be the order that efficiently visits all points.
 */
const calculateBestRouteFromPoints = (
  points,
  method = DEFAULT_METHOD,
  quality = 3,
  progressCb = null
) => {
  if (quality < 3) throw new Error('ERROR: Quality must be 3 or higher');

  // The accuracy threshold we are seeking.
  const threshold = qualityToThreshold(quality);

  let lT = 0; // Last percentage progressCb was called at.
  const frequency = 0.05; // Call progressCb every 5%.

  // Current solution starts at 15% but otherwise vaguely approximates progress.
  // TODO: Devise a better way to convert a value scaling from X down to 1e-6, to a percentage.
  const progressHandler = (_currentData, temp) => {
    // Called every iteration.
    const normalTemp = (1e-6 / temp) ** (1 / 10); // idk i just cobbled this part together.

    if (lT === 0 || normalTemp > lT + frequency) {
      if (progressCb) progressCb(normalTemp);
      lT = normalTemp;
    }
  };

  const solution = METHODS[method].solve(points, {
    callback: progressHandler,
    tempCoeff: threshold,
    // Euclidean distance.
  });
  console.log(solution);

  return _.map(solution, _.partial(_.nth, points));
};

/**
 * Converts a set of coordinates into a set of Point objects.
 * @param {Number[][]} coordArray An array of arrays, each containing two Numbers, for the X and Y position.
 * @returns {Point[]} A set of points matching the coordinate array.
 */
const buildPointsFromCoordinates = (coordinates) => {
  return coordinates.map((coord) => {
    return new Point(coord[0], coord[1]);
  });
};

/**
 * Converts a set of Point objects into a set of coordinates.
 * @param {Point[]} coordArray An array of arrays, each containing two Numbers, for the X and Y position.
 * @returns {Number[][]} A set of points matching the coordinate array.
 */
const buildCoordinatesFromPoints = (points) => {
  return points.map((point) => {
    return [point.x, point.y];
  });
};

/**
 * Converts a set of Feature objects into a set of coordinates.
 * @param {Feature[]} coordArray An array of GeoJSON Feature data elements. Points are assumed.
 * @returns {Number[][]} A set of points matching the coordinate array.
 */
const buildCoordinatesFromFeatures = (features) => {
  return features.map((feature) => {
    return feature.geometry.coordinates;
  });
};

/**
 * Plots a line that goes through a set of Points.
 * @param {Point[]} points An array of Point objects.
 * @param {Number} quality Convergence speed. Higher values have exponentially higher thresholds.
 * @param {Function} progressCb This function provides percentage progress.
 * @returns {Number[][]} A set of coordinates.
 */
export const buildCoordinateRouteFromPoints = (
  points,
  method = DEFAULT_METHOD,
  quality = 3,
  progressCb = null
) => {
  const routePoints = calculateBestRouteFromPoints(points, method, quality, progressCb);
  const routeCoordinates = buildCoordinatesFromPoints(routePoints);
  return routeCoordinates;
};

/**
 * Plots a line that goes through a set of coordinates.
 * @param {Number[][]} coords An array of arrays, each containing two Numbers, for the X and Y position.
 * @param {Number} quality Convergence speed. Higher values have exponentially higher thresholds.
 * @param {Function} progressCb This function provides percentage progress.
 * @returns {Number[][]} A set of coordinates.
 */
export const buildCoordinateRouteFromCoordinates = (
  coords,
  method = DEFAULT_METHOD,
  quality = 3,
  progressCb = null
) => {
  return buildCoordinateRouteFromPoints(
    buildPointsFromCoordinates(coords),
    method,
    quality,
    progressCb
  );
};

/**
 * Plots a line that goes through a set of GeoJSON features.
 * @param {Number[][]} coords An array of arrays, each containing two Numbers, for the X and Y position.
 * @param {Number} quality Convergence speed. Higher values have exponentially higher thresholds.
 * @param {Function} progressCb This function provides percentage progress.
 * @returns {Number[][]} A set of coordinates.
 */
export const buildCoordinateRouteFromFeatures = (
  features,
  method = DEFAULT_METHOD,
  quality = 3,
  progressCb = null
) => {
  return buildCoordinateRouteFromCoordinates(
    buildCoordinatesFromFeatures(features),
    method,
    quality,
    progressCb
  );
};

/**
 * Plots a line that goes through a set of Points.
 * @param {Point[]} coordArray An array of arrays, each containing two Numbers, for the X and Y position.
 * @param {Number} quality Convergence speed. Higher values have exponentially higher thresholds.
 * @param {Function} progressCb This function provides percentage progress.
 * @returns {Polyline} A Leaflet object.
 */
export const buildLeafletRouteFromPoints = (
  points,
  method = DEFAULT_METHOD,
  quality = 3,
  progressCb = null
) => {
  return L.polyline(
    buildCoordinateRouteFromPoints(points, method, quality, progressCb),
    linePropertiesSmart
  );
};

/**
 * Plots a line that goes through a set of coordinates.
 * @param {Number[][]} coordArray An array of arrays, each containing two Numbers, for the X and Y position.
 * @param {Number} quality Convergence speed. Higher values have exponentially higher thresholds.
 * @param {Function} progressCb This function provides percentage progress.
 * @returns {Polyline} A Leaflet object.
 */
export const buildLeafletRouteFromCoordinates = (
  coordinates,
  method = DEFAULT_METHOD,
  quality = 3,
  progressCb = null
) => {
  return buildLeafletRouteFromPoints(
    buildPointsFromCoordinates(coordinates),
    method,
    quality,
    progressCb
  );
};

/**
 * Plots a line that goes through a set of features.
 * @param {Object[]} features An array of features to map.
 * @param {Number} quality Convergence speed. Higher values have exponentially higher thresholds.
 * @param {Function} progressCb This function provides percentage progress.
 * @returns {Polyline} A Leaflet object.
 */
export const buildLeafletRouteFromFeatures = (
  features,
  method = DEFAULT_METHOD,
  quality = 3,
  progressCb = null
) => {
  buildLeafletRouteFromCoordinates(
    buildCoordinatesFromFeatures(features),
    method,
    quality,
    progressCb
  );
};
