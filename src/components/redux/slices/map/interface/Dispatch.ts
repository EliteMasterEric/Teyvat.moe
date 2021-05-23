import { setMapMarkerCount, setMapPosition, setMapRouteCount, setPermalinkId } from './Actions';
import { getMapFeatureKeys, getMapFeature } from 'src/components/data/map/MapFeatures';
import { getMapRouteGroupKeys, getMapRouteGroup } from 'src/components/data/map/MapRoutes';
import { dispatchAction } from 'src/components/redux/Dispatch';
import { MapPosition } from 'src/components/Types';

const performMapMarkersCount = (): number => {
  if (!getMapFeatureKeys) {
    return 0;
  }
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

export const dispatchSetMapPosition = (
  latlng: MapPosition['latlng'],
  zoom: MapPosition['zoom']
): void => {
  dispatchAction(setMapPosition(latlng, zoom));
};

export const dispatchSetPermalinkId = (permalinkId: string): void => {
  dispatchAction(setPermalinkId(permalinkId));
};
