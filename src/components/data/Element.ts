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
import { MapFeatures } from '~/components/data/MapFeatures';
import { MapRoutes } from '~/components/data/MapRoutes';
import { MSFMarker, MSFRoute } from '~/components/data/ElementSchema';

export const getElementPathById = (id: string): string => {
  let result = null;

  // Search the features.
  Object.keys(MapFeatures).forEach((featureKey) => {
    const feature = MapFeatures[featureKey];
    const matchingMarkers = feature.data.filter((element) => element.id.startsWith(id));
    if (matchingMarkers.length >= 1) {
      result = `feature/${featureKey}/${matchingMarkers[0].id}`;
    }
  });
  if (result !== null) return result;

  // Search the routes.
  Object.keys(MapRoutes).forEach((routeKey) => {
    const routes = MapRoutes[routeKey];
    const matchingRoutes = routes.data.filter((element) => element.id.startsWith(id));
    if (matchingRoutes.length >= 1) {
      result = `route/${routeKey}/${matchingRoutes[0].id}`;
    }
  });
  if (result !== null) return result;

  // Couldn't find it.
  return null;
};

export const getElementByPath = (path: string): MSFMarker | MSFRoute => {
  const [type, name, id] = path.split('/');
  switch (type) {
    case 'feature':
      const feature = MapFeatures[name];
      const markers = feature.data.filter((m) => m.id === id);
      if (markers.length >= 1) return markers[0];
      break;
    case 'route':
      const route = MapRoutes[name];
      const routes = route.data.filter((r) => r.id === id);
      if (routes.length >= 1) return routes[0];
      break;
    default:
      console.error(`Unknown type ${type}.`);
      break;
  }
  return null;
};
