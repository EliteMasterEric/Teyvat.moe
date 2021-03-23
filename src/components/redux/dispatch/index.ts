import { MSFFeatureKey, MSFMarkerKey, MSFRouteGroupKey } from 'src/components/data/ElementSchema';
import { store } from 'src/components/redux';
import { AppAction } from 'src/components/redux/actions';
import { setMarkersCompleted } from 'src/components/redux/slices/completed';
import { setFeatureDisplayed, setRouteGroupDisplayed } from 'src/components/redux/slices/displayed';
import { setImportError } from 'src/components/redux/slices/error';
import {
  buildNotification,
  enqueueNotification,
  Notification,
} from 'src/components/redux/slices/notify';
import { setMapPosition } from 'src/components/redux/slices/ui';
import { LocalizedString, MapPosition } from 'src/components/Types';

const dispatchAction = (action: AppAction): void => {
  store.dispatch(action);
};

export const sendNotification = (
  message: LocalizedString,
  options?: Partial<Notification['options']>
): void => {
  dispatchAction(enqueueNotification(buildNotification(message, options)));
};

export const displayImportError = (message: LocalizedString): void => {
  dispatchAction(setImportError(message));
};

export const markMarkersCompleted = (markerKeys: MSFMarkerKey[]): void => {
  dispatchAction(setMarkersCompleted(markerKeys));
};

export const showFeature = (key: MSFFeatureKey): void => {
  dispatchAction(setFeatureDisplayed(key));
};

export const showRouteGroup = (key: MSFRouteGroupKey): void => {
  dispatchAction(setRouteGroupDisplayed(key));
};

export const moveToMapPosition = (pos: MapPosition['latlng'], zoom: MapPosition['zoom']): void => {
  dispatchAction(setMapPosition(pos, zoom));
};
