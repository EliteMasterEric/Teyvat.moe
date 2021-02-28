/**
 * The file lists all the Map features, regions, routes, and categories.
 * It directs how they are rendered on the map, how they display in the filter list,
 * and where the data for them is loaded from.
 */

import _ from 'lodash';

import { listRouteFiles, loadRoute } from '~/components/data/RouteData';
import {
  MSFRouteGroupExtended,
  MSFRouteGroupKey,
  MSFRouteKey,
} from '~/components/data/ElementSchema';
import { MapCategory, MapRegion } from '~/components/Types';

import MapCategories from '~/data/core/categories.json';

/**
 * Metadata regarding the map features.
 * Imported directly by listing the files from the Features folder.
 */
export const MapRoutes: Record<MSFRouteKey, MSFRouteGroupExtended> = _.fromPairs(
  listRouteFiles()
    .map((relativePath) => {
      const [_dot, routeRegion, routeCategory, routeName] = relativePath.split('/');
      const baseRouteData = loadRoute(relativePath);
      if (baseRouteData == null) return null; // Validation failed.
      // crystal-chunk -> CrystalChunk
      const correctedName = routeName
        .split('.')[0] // Remove file extension.
        .split('-') // Break by words.
        .map((s) => s.charAt(0).toUpperCase() + s.substr(1)) // Convert to Title case.
        .join(''); // Rejoin.

      // CrystalChunk -> mondstadtCrystalChunk
      const fullName = `${routeRegion}${correctedName}` as MSFRouteGroupKey; // Prefix with region.

      const routeData: MSFRouteGroupExtended = {
        ...baseRouteData,
        key: fullName,
        region: <MapRegion>routeRegion,
        category: <MapCategory>routeCategory,
      };

      return [fullName, routeData];
    })
    .filter((value) => value) // Filter out nullable values
);

/**
 * For a given region, returns a map of a category key and a boolean value,
 * false if it contains at least one valid displayed route.
 * @param region
 */
export const getEmptyRouteCategories = (regionKey: MapRegion): Record<MapCategory, boolean> =>
  _.fromPairs(
    _.map(_.keys(MapCategories) as MapCategory[], (categoryKey) => {
      return [
        categoryKey,
        _.find(
          _.values(MapRoutes) as MSFRouteGroupExtended[],
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
  ) as Record<MapCategory, boolean>;

export const getRouteKeysByFilter = (region: string, category: string): string[] => {
  return Object.keys(MapRoutes).filter((key) => {
    const route = MapRoutes[key];
    return route?.region === region && route?.category === category && route?.enabled;
  });
};

export const sortRoutesByName = (data: string[]): string[] =>
  data.sort((a, b) => {
    // Sort the features alphabetically.
    const textA = MapRoutes?.[a]?.name;
    const textB = MapRoutes?.[b]?.name;

    if (textA < textB) return -1;
    return textA > textB ? 1 : 0;
  });

export const getRouteCount = (): number => {
  return Object.keys(MapRoutes).reduce((sum, key, _index) => {
    const route = MapRoutes[key];
    return sum + route.data.length;
  }, 0);
};
