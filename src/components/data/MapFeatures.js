/**
 * The file lists all the Map features, regions, routes, and categories.
 * It directs how they are rendered on the map, how they display in the filter list,
 * and where the data for them is loaded from.
 */

import _ from 'lodash';

import MapCategories from '~/components/data/MapCategories';

import {
  listFeatureKeys,
  listRouteKeys,
  loadFeature,
  loadRoute,
} from '~/components/data/MapFeaturesData';

/**
 * Metadata regarding the map features.
 * Imported directly by listing the files from the Features folder.
 */
export const MapFeatures = _.fromPairs(
  listFeatureKeys()
    .map((relativePath) => {
      const [_dot, featureRegion, featureCategory, featureName] = relativePath.split('/');
      const baseFeatureData = loadFeature(relativePath);
      if (baseFeatureData == null) return null; // Validation failed.

      // crystal-chunk -> CrystalChunk
      const correctedName = featureName
        .split('.')[0] // Remove file extension.
        .split('-') // Break by words.
        .map((s) => s.charAt(0).toUpperCase() + s.substr(1)) // Convert to Title case.
        .join(''); // Rejoin.

      // CrystalChunk -> mondstadtCrystalChunk
      const fullName = `${featureRegion}${correctedName}`; // Prefix with region.

      const featureData = {
        ...baseFeatureData,
        key: fullName,
        region: featureRegion,
        category: featureCategory,
      };

      return [fullName, featureData];
    })
    .filter((value) => value) // Filter out nullable values
);

/**
 * For a given region, returns a map of a category key and a boolean value,
 * false if it contains at least one valid displayed route.
 * @param {*} region
 */
export const getEmptyFeatureCategories = (region) =>
  _.fromPairs(
    _.keys(MapCategories).map((categoryKey) => {
      const firstMatching = _.find(MapFeatures, (mapFeature) => {
        return (
          mapFeature.category === categoryKey &&
          mapFeature.region === region &&
          (mapFeature.enabled ?? true)
        );
      });
      return [categoryKey, firstMatching === undefined];
    })
  );

export const getFeatureKeysByFilter = (region, category) => {
  return _.keys(MapFeatures).filter((key) => {
    const feature = MapFeatures[key];
    return feature?.region === region && feature?.category === category && feature?.enabled;
  });
};

export const sortByName = (data) =>
  data.sort((a, b) => {
    // Sort the features alphabetically.
    const textA = MapFeatures[a].name;
    const textB = MapFeatures[b].name;

    if (textA < textB) return -1;
    return textA > textB ? 1 : 0;
  });

/**
 * Metadata regarding the map features.
 * Imported directly by listing the files from the Features folder.
 */
export const MapRoutes = _.fromPairs(
  listRouteKeys()
    .map((relativePath) => {
      const [_dot, routeRegion, routeCategory, routeName] = relativePath.split('/');
      const baseRouteData = loadRoute(relativePath);
      if (baseRouteData == null) return null; // Validation failed.
      const routeData = {
        ...baseRouteData,
        region: routeRegion,
        category: routeCategory,
      };

      // crystal-chunk -> CrystalChunk
      const correctedName = routeName
        .split('.')[0] // Remove file extension.
        .split('-') // Break by words.
        .map((s) => s.charAt(0).toUpperCase() + s.substr(1)) // Convert to Title case.
        .join(''); // Rejoin.

      // CrystalChunk -> mondstadtCrystalChunk
      const fullName = `${routeRegion}${correctedName}`; // Prefix with region.
      return [fullName, routeData];
    })
    .filter((value) => value) // Filter out nullable values
);

/**
 * For a given region, returns a map of a category key and a boolean value,
 * false if it contains at least one valid displayed route.
 * @param {*} region
 */
export const getEmptyRouteCategories = (region) =>
  _.fromPairs(
    _.keys(MapCategories).map((categoryKey) => {
      const firstMatching = _.find(MapRoutes, (mapRoute) => {
        return (
          mapRoute.category === categoryKey &&
          mapRoute.region === region &&
          (mapRoute.enabled ?? true)
        );
      });
      return [categoryKey, firstMatching === undefined];
    })
  );

export const getRouteKeysByFilter = (region, category) => {
  return Object.keys(MapRoutes).filter((key) => {
    const route = MapRoutes[key];
    return route?.region === region && route?.category === category && route?.enabled;
  });
};
