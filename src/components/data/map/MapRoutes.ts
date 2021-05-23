import _ from 'lodash';

import { MSFRouteColor, MSFRouteGroupExtended, MSFRouteGroupKey, MSFRouteText } from './Element';
import { isCategoryKey, MapCategoryKey, MapCategoryKeys } from './MapCategories';
import { isRegionKey, MapRegionKey } from './MapRegions';
import { listRouteFiles, loadRoute } from './RouteData';
import { dispatchSetLoading } from 'src/components/redux/slices/map/loading/Dispatch';
import { getRecord, setRecord } from 'src/components/util';

export const DEFAULT_ROUTE_TEXT = '  ►  ' as MSFRouteText;
export const DEFAULT_ROUTE_COLOR = '#d32f2f' as MSFRouteColor;

/**
 * Metadata regarding the map routes.
 * Imported directly by listing the files from the routes folder.
 */
const MapRouteGroups: Record<MSFRouteGroupKey, MSFRouteGroupExtended> = {};

const initializeMapRouteGroup = async (
  routeGroupFilePath: string
): Promise<[MSFRouteGroupKey, MSFRouteGroupExtended] | null> => {
  const baseRouteData = await loadRoute(routeGroupFilePath);
  if (baseRouteData == null) return null; // Validation failed.

  const [_dot, routeRegion, routeCategory, routeName] = _.split(routeGroupFilePath, '/');
  if (routeName == undefined) return null; // Invalid file name.
  if (routeRegion == undefined || !isRegionKey(routeRegion)) return null;
  if (routeCategory == undefined || !isCategoryKey(routeCategory)) return null;

  const splitRouteName = _.split(routeName, '.');
  if (splitRouteName == undefined || splitRouteName[0] == undefined) return null;

  const correctedName = _.map(
    // Break by words.
    _.split(splitRouteName[0], '-'),
    (s) => _.toUpper(s.charAt(0)) + s.slice(1)
  ) // Convert to Title case.
    .join(''); // Rejoin.

  // CrystalChunk -> mondstadtCrystalChunk
  const fullName = `${routeRegion}${correctedName}` as MSFRouteGroupKey; // Prefix with region.

  const routeData: MSFRouteGroupExtended = {
    ...baseRouteData,
    key: fullName,
    region: routeRegion as MapRegionKey,
    category: routeCategory as MapCategoryKey,
  };

  const result: [MSFRouteGroupKey, MSFRouteGroupExtended] = [fullName, routeData];

  return result;
};
export const initializeAllMapRouteGroups = (): void => {
  if (dispatchSetLoading) {
    dispatchSetLoading('loadMapRoutes', 'progress');
  }
  const loaderPromises = _.map(listRouteFiles(), async (routeFilePath) => {
    const result = await initializeMapRouteGroup(routeFilePath);
    if (result != null) {
      setRecord(MapRouteGroups, result[0], result[1]);
    }
  });
  Promise.all(loaderPromises)
    .then(() => {
      dispatchSetLoading('loadMapRoutes', true);
    })
    .catch((error) => {
      dispatchSetLoading('loadMapRoutes', 'error');
      console.error('Caught error initializing route groups.');
      console.error(error);
    });
};
export const getMapRouteGroup = (key: MSFRouteGroupKey): MSFRouteGroupExtended => {
  const result = getRecord(MapRouteGroups, key);
  if (result == null) throw new Error(`Invalid map route group key ${key}`);
  return result;
};
export const getMapRouteGroupKeys = (): MSFRouteGroupKey[] =>
  _.keys(MapRouteGroups) as MSFRouteGroupKey[];

/**
 * For a given region, returns a map of a category key and a boolean value,
 * false if it contains at least one valid displayed route.
 * @param region
 */
export const getEmptyRouteCategories = (regionKey: MapRegionKey): Record<MapCategoryKey, boolean> =>
  _.fromPairs(
    _.map(MapCategoryKeys, (categoryKey) => {
      return [
        categoryKey,
        _.find(
          _.values(MapRouteGroups) as MSFRouteGroupExtended[],
          (mapRoute: MSFRouteGroupExtended) => {
            return (
              mapRoute.category === categoryKey &&
              mapRoute.region == regionKey &&
              (mapRoute.enabled ?? true)
            );
          }
        ) == undefined,
      ];
    })
  ) as Record<MapCategoryKey, boolean>;

export const getRouteKeysByFilter = (region: string, category: string): MSFRouteGroupKey[] => {
  return _.filter(getMapRouteGroupKeys(), (key) => {
    const route = getMapRouteGroup(key);
    return route.region === region && route.category === category && route.enabled;
  }) as MSFRouteGroupKey[]; // IDK why this needs a cast.
};

export const sortRoutesByName = (data: MSFRouteGroupKey[]): MSFRouteGroupKey[] =>
  _.sortBy(data, (a) => getMapRouteGroup(a).name);
