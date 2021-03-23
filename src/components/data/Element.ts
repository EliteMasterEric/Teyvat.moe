/**
 * markerId: ABCD123456
 * markerKey: mondstadtAnemoculus/ABCD123456
 * markerPath: feature/mondstadtAnemoculus/ABCD123456
 *
 * featureKey: mondstadtAnemoculus
 *
 * routeId: ABCD123456
 * routeKey: mondstadtCecilia/ABCD123456
 * routePath: route/mondstadtCecilia/ABCD123456
 */
import {
  MSFFeatureKey,
  MSFMarker,
  MSFRoute,
  MSFRouteGroupKey,
} from 'src/components/data/ElementSchema';
import { MapFeatureKeys, getMapFeature } from 'src/components/data/MapFeatures';
import { MapRouteGroupKeys, getMapRouteGroup } from 'src/components/data/MapRoutes';

export const getElementPathById = (id: string): string | null => {
  let result = null;

  // Search the features.
  MapFeatureKeys.forEach((featureKey: MSFFeatureKey) => {
    const feature = getMapFeature(featureKey);
    const matchingMarkers = feature.data.filter((element) => element.id.startsWith(id));
    if (matchingMarkers[0] !== undefined) {
      result = `feature/${featureKey}/${matchingMarkers[0].id}`;
    }
  });
  if (result !== null) return result;

  // Search the routes.
  MapRouteGroupKeys.forEach((routeKey) => {
    const routes = getMapRouteGroup(routeKey);
    const matchingRoutes = routes.data.filter((element) => element.id.startsWith(id));
    if (matchingRoutes[0] !== undefined) {
      result = `route/${routeKey}/${matchingRoutes[0].id}`;
    }
  });
  if (result !== null) return result;

  // Couldn't find it.
  return null;
};

export const getElementByPath = (path: string): MSFMarker | MSFRoute | null => {
  const [type, name, id] = path.split('/');
  switch (type) {
    case 'feature':
      const featureKey = name as MSFFeatureKey;
      const feature = getMapFeature(featureKey);
      const markers = feature.data.filter((m) => m.id === id);
      if (markers[0] !== undefined) return markers[0];
      break;
    case 'route':
      const routeGroupKey = name as MSFRouteGroupKey;
      const route = getMapRouteGroup(routeGroupKey);
      const routes = route.data.filter((r) => r.id === id);
      if (routes[0] !== undefined) return routes[0];
      break;
    default:
      console.error(`Unknown type ${type}.`);
      break;
  }
  return null;
};
