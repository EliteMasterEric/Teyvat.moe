import { MSFMarkerKey, MSFFeatureKey, MSFRouteGroupKey } from 'src/components/data/Element';
import { store } from 'src/components/redux';
import { AppAction } from 'src/components/redux/Actions';
import { setMarkersCompleted } from 'src/components/redux/slices/Completed';
import { setFeatureDisplayed, setRouteGroupDisplayed } from 'src/components/redux/slices/Displayed';
import { setImportError } from 'src/components/redux/slices/Error';
import { setMapPosition } from 'src/components/redux/slices/Interface';
import {
  enqueueNotification,
  buildNotification,
  Notification,
} from 'src/components/redux/slices/Notify';
import { LocalizedString, MapPosition } from 'src/components/Types';

export const dispatchAction = (action: AppAction): void => {
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
