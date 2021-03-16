import _ from 'lodash';

import {
  MSFRouteGroupExtended,
  MSFRouteGroupKey,
  MSFRouteKey,
} from '~/components/data/ElementSchema';
import { isCategoryKey, MapCategoryKey, MapCategoryKeys } from '~/components/data/MapCategories';
import { isRegionKey, MapRegionKey } from '~/components/data/MapRegions';
import { listRouteFiles, loadRoute } from '~/components/data/RouteData';
import { filterNotEmpty } from '../util';

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
        key: fullName as MSFRouteKey,
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
              (mapRoute?.enabled ?? true)
            );
          }
        ) == undefined,
      ];
    })
  ) as Record<MapCategoryKey, boolean>;

export const getRouteKeysByFilter = (region: string, category: string): MSFRouteGroupKey[] => {
  return MapRouteKeys.filter((key) => {
    const route = MapRouteGroups[key];
    return route?.region === region && route?.category === category && route?.enabled;
  });
};

export const sortRoutesByName = (data: MSFRouteGroupKey[]): MSFRouteGroupKey[] =>
  data.sort((a, b) => {
    // Sort the features alphabetically.
    const textA = MapRouteGroups?.[a]?.name;
    const textB = MapRouteGroups?.[b]?.name;

    if (textA < textB) return -1;
    return textA > textB ? 1 : 0;
  });

export const getRouteCount = (): number => {
  return MapRouteGroupKeys.reduce((sum, key, _index) => {
    const route = MapRouteGroups[key];
    return sum + route.data.length;
  }, 0);
};
