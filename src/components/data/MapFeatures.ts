/**
 * The file lists all the Map features, regions, routes, and categories.
 * It directs how they are rendered on the map, how they display in the filter list,
 * and where the data for them is loaded from.
 */

import _ from 'lodash';

import { isRegionKey, MapRegionKey } from 'src/components/data//MapRegions';
import { MSFFeatureExtended, MSFFeatureKey } from 'src/components/data/ElementSchema';
import { listFeatureFiles, loadFeature } from 'src/components/data/FeatureData';
import { isCategoryKey, MapCategoryKey, MapCategoryKeys } from 'src/components/data/MapCategories';
import { filterNotEmpty } from 'src/components/util';

/**
 * Metadata regarding the map features.
 * Imported directly by listing the files from the Features folder.
 */
const MapFeatures = _.fromPairs(
  listFeatureFiles()
    .map((relativePath) => {
      const baseFeatureData = loadFeature(relativePath);
      if (baseFeatureData == null) return null; // Validation failed.

      const [_dot, featureRegion, featureCategory, featureName] = relativePath.split('/');
      if (featureName == undefined) return null; // Invalid file name.
      if (featureRegion == undefined || !isRegionKey(featureRegion)) return null;
      if (featureCategory == undefined || !isCategoryKey(featureCategory)) return null;

      const splitFeatureName = featureName.split('.');
      if (splitFeatureName == undefined || splitFeatureName[0] == undefined) return null;

      const correctedName = splitFeatureName[0] // Remove file extension.
        .split('-') // Break by words.
        .map((s) => s.charAt(0).toUpperCase() + s.substr(1)) // Convert to Title case.
        .join(''); // Rejoin.

      // CrystalChunk -> mondstadtCrystalChunk
      const fullName = `${featureRegion}${correctedName}`; // Prefix with region.

      const featureData: MSFFeatureExtended = {
        ...baseFeatureData,
        key: fullName as MSFFeatureKey,
        region: featureRegion as MapRegionKey,
        category: featureCategory as MapCategoryKey,
      };

      const result: [string, MSFFeatureExtended] = [fullName, featureData];

      return result;
    })
    .filter(filterNotEmpty)
);
export const getMapFeature = (key: MSFFeatureKey): MSFFeatureExtended => {
  const result = MapFeatures[key] ?? null;
  if (result == null) throw Error(`Invalid map feature key ${key}`);
  return result;
};
export const MapFeatureKeys = _.keys(MapFeatures) as MSFFeatureKey[];

/**
 * For a given region, returns a map of a category key and a boolean value,
 * false if it contains at least one valid displayed route.
 * @param region
 */
export const getEmptyFeatureCategories = (
  regionKey: MapRegionKey
): Record<MapCategoryKey, boolean> => {
  const result = _.fromPairs(
    _.map(MapCategoryKeys, (categoryKey) => {
      return [
        categoryKey,
        _.find(_.values(MapFeatures) as MSFFeatureExtended[], (mapFeature: MSFFeatureExtended) => {
          return (
            mapFeature.category === categoryKey &&
            mapFeature.region == regionKey &&
            (mapFeature.enabled ?? true)
          );
        }) == undefined,
      ];
    })
  ) as Record<MapCategoryKey, boolean>;
  return result;
};

export const getFeatureKeysByFilter = (
  region: MapRegionKey,
  category: MapCategoryKey
): MSFFeatureKey[] => {
  return MapFeatureKeys.filter((key) => {
    const feature = getMapFeature(key);
    return feature.region === region && feature.category === category && feature.enabled;
  });
};

export const sortFeaturesByName = (data: MSFFeatureKey[]): MSFFeatureKey[] =>
  data.sort((a, b) => {
    // Sort the features alphabetically.
    const textA = getMapFeature(a).name;
    const textB = getMapFeature(b).name;

    if (textA < textB) return -1;
    return textA > textB ? 1 : 0;
  });

export const getMarkerCount = (): number => {
  return MapFeatureKeys.reduce((sum, key, _index) => {
    const feature = getMapFeature(key);
    return sum + feature.data.length;
  }, 0);
};
