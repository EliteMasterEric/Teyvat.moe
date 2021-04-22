import { PayloadAction } from '@reduxjs/toolkit';
import _ from 'lodash';
import { Middleware } from 'redux';

import { countMapMarkers, countMapRoutes } from 'src/components/redux/dispatch';
import {
  selectLoading,
  selectPermalinkID,
  setLoading,
  SetLoadingAction,
} from 'src/components/redux/slices/Interface';
import { AppState } from 'src/components/redux/Types';
import { getKeys } from 'src/components/util';
import { navigateToMarkerByID } from 'src/components/views/PermalinkHandler';

let handledPermalinks = false;
const handlePermalinks = (id: string | null) => {
  if (handledPermalinks || id == null) return;
  handledPermalinks = true;

  navigateToMarkerByID(id);
};

/**
 * Handle cases where one initialization step depends on another.
 */
const initializationMiddleware: Middleware<unknown, AppState> = ({ getState }) => (next) => (
  action
) => {
  if (action.type === setLoading.type) {
    const setLoadingAction: PayloadAction<SetLoadingAction> = action;
    const currentState = getState();
    const loadingKey: keyof AppState['ui']['loading'] | null =
      getKeys(setLoadingAction.payload)?.[0] ?? null;

    switch (loadingKey) {
      case 'initializedLoading':
        // Ignore.
        break;
      case 'loadMapFeatures':
        // Start counting the map features.
        countMapMarkers();
        break;
      case 'loadMapRoutes':
        countMapRoutes();
        break;
      case null:
        console.warn('Unknown loading state!');
        console.warn(setLoadingAction);
        break;
      default:
        // Pass on the action without replacing or modifying it.
        break;
    }
    if (
      selectLoading(currentState, 'loadMapFeatures') &&
      selectLoading(currentState, 'loadMapRoutes') &&
      !selectLoading(currentState, 'handlePermalinks')
    ) {
      handlePermalinks(selectPermalinkID(currentState));
    }
  }

  // Pass on the action without replacing or modifying it.
  return next(action);
};

export default initializationMiddleware;
