import _ from 'lodash';

import {
  MSFRouteColor,
  MSFRouteGroupExtended,
  MSFRouteGroupKey,
  MSFRouteText,
} from 'src/components/data/ElementSchema';
import { isCategoryKey, MapCategoryKey, MapCategoryKeys } from 'src/components/data/MapCategories';
import { isRegionKey, MapRegionKey } from 'src/components/data/MapRegions';
import { listRouteFiles, loadRoute } from 'src/components/data/RouteData';
import { filterNotEmpty } from 'src/components/util';

export const DEFAULT_ROUTE_TEXT = '  ►  ' as MSFRouteText;
export const DEFAULT_ROUTE_COLOR = '#d32f2f' as MSFRouteColor;

/**
 * Metadata regarding the map routes.
 * Imported directly by listing the files from the routes folder.
 */
const MapRouteGroups = _.fromPairs(
  listRouteFiles()
    .map((relativePath) => {
      const baseRouteData = loadRoute(relativePath);
      if (baseRouteData == null) return null; // Validation failed.

      const [_dot, routeRegion, routeCategory, routeName] = relativePath.split('/');
      if (routeName == undefined) return null; // Invalid file name.
      if (routeRegion == undefined || !isRegionKey(routeRegion)) return null;
      if (routeCategory == undefined || !isCategoryKey(routeCategory)) return null;

      const splitRouteName = routeName.split('.');
      if (splitRouteName == undefined || splitRouteName[0] == undefined) return null;

      const correctedName = splitRouteName[0] // Remove file extension.
        .split('-') // Break by words.
        .map((s) => s.charAt(0).toUpperCase() + s.substr(1)) // Convert to Title case.
        .join(''); // Rejoin.

      // CrystalChunk -> mondstadtCrystalChunk
      const fullName = `${routeRegion}${correctedName}`; // Prefix with region.

      const routeData: MSFRouteGroupExtended = {
        ...baseRouteData,
        key: fullName as MSFRouteGroupKey,
        region: routeRegion as MapRegionKey,
        category: routeCategory as MapCategoryKey,
      };

      const result: [string, MSFRouteGroupExtended] = [fullName, routeData];

      return result;
    })
    .filter(filterNotEmpty)
);
export const getMapRouteGroup = (key: MSFRouteGroupKey): MSFRouteGroupExtended => {
  const result = MapRouteGroups[key] ?? null;
  if (result == null) throw Error(`Invalid map route group key ${key}`);
  return result;
};
export const MapRouteGroupKeys = _.keys(MapRouteGroups) as MSFRouteGroupKey[];

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
  return MapRouteGroupKeys.filter((key) => {
    const route = getMapRouteGroup(key);
    return route.region === region && route.category === category && route.enabled;
  });
};

export const sortRoutesByName = (data: MSFRouteGroupKey[]): MSFRouteGroupKey[] =>
  data.sort((a, b) => {
    // Sort the features alphabetically.
    const textA = getMapRouteGroup(a).name;
    const textB = getMapRouteGroup(b).name;

    if (textA < textB) return -1;
    return textA > textB ? 1 : 0;
  });

export const getRouteCount = (): number => {
  return MapRouteGroupKeys.reduce((sum, key, _index) => {
    const route = getMapRouteGroup(key);
    return sum + route.data.length;
  }, 0);
};
