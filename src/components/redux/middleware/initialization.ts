import { PayloadAction } from '@reduxjs/toolkit';
import _ from 'lodash';
import { Middleware } from 'redux';

import { MapCategoryKey } from 'src/components/data/MapCategories';
import { getEmptyFeatureCategories } from 'src/components/data/MapFeatures';
import { getEmptyRouteCategories } from 'src/components/data/MapRoutes';
import {
  selectLoading,
  selectPermalinkID,
  setLoading,
  SetLoadingAction,
  setMapCategory,
  setTab,
} from 'src/components/redux/slices/ui';
import { AppState } from 'src/components/redux/types';
import { UIControlsTab } from 'src/components/Types';
import { navigateToMarkerByID } from 'src/components/views/PermalinkHandler';
import { countMapMarkers, countMapRoutes } from '../dispatch';

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
  switch (action.type) {
    case [setLoading]:
      console.warn('MIDDLWARE: setLoading');
      const setLoadingAction: PayloadAction<SetLoadingAction> = action;
      const currentState = getState();
      const loadingKey: keyof AppState['ui']['loading'] | 'null' =
        (Object.keys(setLoadingAction.payload)?.[0] as keyof AppState['ui']['loading'] | null) ??
        'null';
      console.log(setLoadingAction);
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
        case 'null':
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
      return next(action);
    default:
      // Pass on the action without replacing or modifying it.
      return next(action);
  }
};

export default initializationMiddleware;
