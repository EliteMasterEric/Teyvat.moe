import _ from 'lodash';
import { Middleware } from 'redux';

import {
  setMapMarkerCount,
  setMapRouteCount,
  setPermalinkId,
} from 'src/components/redux/slices/map/interface/Actions';
import {
  countMapMarkers,
  countMapRoutes,
} from 'src/components/redux/slices/map/interface/Dispatch';
import { selectPermalinkID } from 'src/components/redux/slices/map/interface/Selector';
import { setLoading } from 'src/components/redux/slices/map/loading/Actions';
import { selectLoading } from 'src/components/redux/slices/map/loading/Selector';
import { AppState } from 'src/components/redux/Types';
import { navigateToMarkerByID } from 'src/components/views/map/PermalinkHandler';

/**
 * Handle cases where one initialization step depends on another.
 */
const initializationMiddleware: Middleware<unknown, AppState> = ({ dispatch, getState }) => (
  next
) => (action) => {
  switch (action.type) {
    case setLoading.type: {
      const setLoadingAction: ReturnType<typeof setLoading> = action;
      const currentState = getState();

      if (
        setLoadingAction.payload.loadingKey != undefined &&
        setLoadingAction.payload.newValue === true
      ) {
        switch (setLoadingAction.payload.loadingKey) {
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
      }

      if (
        selectLoading(currentState, 'loadMapFeatures') === true &&
        selectLoading(currentState, 'loadMapRoutes') === true &&
        selectLoading(currentState, 'handlePermalinks') === false
      ) {
        const permalinkId = selectPermalinkID(currentState);
        if (permalinkId == null) {
          dispatch(setLoading('handlePermalinks', 'skip'));
        } else {
          navigateToMarkerByID(permalinkId);
        }
      }

      break;
    }
    case setMapMarkerCount.type: {
      dispatch(setLoading('countMapFeatures', true));

      break;
    }
    case setMapRouteCount.type: {
      dispatch(setLoading('countMapRoutes', true));

      break;
    }
    case setPermalinkId.type: {
      dispatch(setLoading('handlePermalinks', false));

      break;
    }
    // No default
  }

  // Pass on the action without replacing or modifying it.
  return next(action);
};

export default initializationMiddleware;
