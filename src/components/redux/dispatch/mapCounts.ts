import { dispatchAction } from './Base';
import { getMapFeatureKeys, getMapFeature } from 'src/components/data/MapFeatures';
import { getMapRouteGroupKeys, getMapRouteGroup } from 'src/components/data/MapRoutes';
import { setMapMarkerCount, setMapRouteCount } from 'src/components/redux/slices/Interface';

const performMapMarkersCount = (): number => {
  let result = 0;
  for (const key of getMapFeatureKeys()) {
    const feature = getMapFeature(key);
    result += feature.data.length;
  }
  return result;
};

export const countMapMarkers = (): void => {
  const count = performMapMarkersCount();
  dispatchAction(setMapMarkerCount(count));
};

const performMapRoutesCount = (): number => {
  let result = 0;
  for (const key of getMapRouteGroupKeys()) {
    const route = getMapRouteGroup(key);
    result += route.data.length;
  }
  return result;
};

export const countMapRoutes = (): void => {
  const count = performMapRoutesCount();
  dispatchAction(setMapRouteCount(count));
};
