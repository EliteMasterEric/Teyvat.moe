/**
 * The file lists all the Map features, regions, routes, and categories.
 * It directs how they are rendered on the map, how they display in the filter list,
 * and where the data for them is loaded from.
 */

import _ from 'lodash';

import { MSFFeatureExtended, MSFFeatureKey } from '~/components/data/ElementSchema';
import { listFeatureFiles, loadFeature } from '~/components/data/FeatureData';
import { MapCategory, MapRegion } from '~/components/Types';

import MapCategories from '~/data/core/categories.json';

/**
 * Metadata regarding the map features.
 * Imported directly by listing the files from the Features folder.
 */
export const MapFeatures: Record<MSFFeatureKey, MSFFeatureExtended> = _.fromPairs(
  listFeatureFiles()
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
export const getEmptyFeatureCategories = (regionKey: MapRegion): Record<MapCategory, boolean> =>
  _.fromPairs(
    _.map(_.keys(MapCategories) as MapCategory[], (categoryKey) => {
      return [
        categoryKey,
        _.find(_.values(MapFeatures) as MSFFeatureExtended[], (mapFeature: MSFFeatureExtended) => {
          return (
            mapFeature.category === categoryKey &&
            mapFeature.region == regionKey &&
            (mapFeature?.enabled ?? true)
          );
        }) == undefined,
      ];
    })
  ) as Record<MapCategory, boolean>;

export const getFeatureKeysByFilter = (region: MapRegion, category: MapCategory): string[] => {
  return _.keys(MapFeatures).filter((key) => {
    const feature = MapFeatures[key];
    return feature?.region === region && feature?.category === category && feature?.enabled;
  });
};

export const sortFeaturesByName = (data: string[]): string[] =>
  data.sort((a, b) => {
    // Sort the features alphabetically.
    const textA = MapFeatures?.[a]?.name;
    const textB = MapFeatures?.[b]?.name;

    if (textA < textB) return -1;
    return textA > textB ? 1 : 0;
  });

export const getMarkerCount = (): number => {
  return Object.keys(MapFeatures).reduce((sum, key, _index) => {
    const feature = MapFeatures[key];
    return sum + feature.data.length;
  }, 0);
};
