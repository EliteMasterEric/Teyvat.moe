import { getMapFeatureKeys, getMapFeature } from 'src/components/data/MapFeatures';
import { getMapRouteGroupKeys, getMapRouteGroup } from 'src/components/data/MapRoutes';
import { setMapMarkerCount, setMapRouteCount } from '../slices/ui';
import { dispatchAction } from './base';

const performMapMarkersCount = (): number => {
  return getMapFeatureKeys().reduce((sum, key, _index) => {
    const feature = getMapFeature(key);
    return sum + feature.data.length;
  }, 0);
};

export const countMapMarkers = () => {
  console.warn('Counting map markers...');
  const count = performMapMarkersCount();
  console.warn(`Done! Found ${count}.`);
  dispatchAction(setMapMarkerCount(count));
};

const performMapRoutesCount = (): number => {
  return getMapRouteGroupKeys().reduce((sum, key, _index) => {
    const route = getMapRouteGroup(key);
    return sum + route.data.length;
  }, 0);
};

export const countMapRoutes = () => {
  console.warn('Counting map markers...');
  const count = performMapRoutesCount();
  console.warn(`Done! Found ${count}.`);
  dispatchAction(setMapRouteCount());
};
