/**
 * The file lists all the Map features, regions, routes, and categories.
 * It directs how they are rendered on the map, how they display in the filter list,
 * and where the data for them is loaded from.
 */

import _ from 'lodash';

import { MSFFeatureExtended, MSFFeatureKey } from './Element';
import { listFeatureFiles, loadFeature } from './FeatureData';
import { isCategoryKey, MapCategoryKey, MapCategoryKeys } from './MapCategories';
import { isRegionKey, MapRegionKey } from './MapRegions';
import { dispatchSetLoading } from 'src/components/redux/slices/map/loading/Dispatch';

/**
 * Metadata regarding the map features.
 */
const MapFeatures: { [key: string]: MSFFeatureExtended } = {};

/**
 * Load one map feature and perform some preprocessing...
 */
const initializeMapFeature = async (
  featureFilePath: string
): Promise<[string, MSFFeatureExtended] | null> => {
  const baseFeatureData = await loadFeature(featureFilePath);
  if (baseFeatureData == null) return null; // Validation failed.

  const [_dot, featureRegion, featureCategory, featureName] = _.split(featureFilePath, '/');
  if (featureName == undefined) return null; // Invalid file name.
  if (featureRegion == undefined || !isRegionKey(featureRegion)) return null;
  if (featureCategory == undefined || !isCategoryKey(featureCategory)) return null;

  const splitFeatureName = _.split(featureName, '.');
  if (splitFeatureName == undefined || splitFeatureName[0] == undefined) return null;

  const correctedName = _.map(
    _.split(splitFeatureName[0], '-'),
    (s) => _.toUpper(s.charAt(0)) + s.slice(1)
  ) // Convert to Title case.
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
};
export const initializeAllMapFeatures = (): void => {
  dispatchSetLoading('loadMapFeatures', 'progress');
  const loaderPromises = _.map(listFeatureFiles(), async (featureFilePath) => {
    const result = await initializeMapFeature(featureFilePath);
    if (result != null) {
      MapFeatures[result[0]] = result[1];
    }
  });
  Promise.all(loaderPromises).then(() => {
    dispatchSetLoading('loadMapFeatures', true);
  });
};
export const getMapFeature = (key: MSFFeatureKey): MSFFeatureExtended => {
  const result = MapFeatures[key] ?? null;
  if (result == null) throw new Error(`Invalid map feature key ${key}`);
  return result;
};
export const getMapFeatureKeys = (): MSFFeatureKey[] => _.keys(MapFeatures) as MSFFeatureKey[];

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
  return _.filter(getMapFeatureKeys(), (key: MSFFeatureKey) => {
    const feature = getMapFeature(key);
    return feature.region === region && feature.category === category && feature.enabled;
  }) as MSFFeatureKey[]; // IDK what's wrong with Lodash, why do I need this cast?
};

export const sortFeaturesByName = (data: MSFFeatureKey[]): MSFFeatureKey[] =>
  _.sortBy(data, (a) => getMapFeature(a).name);
