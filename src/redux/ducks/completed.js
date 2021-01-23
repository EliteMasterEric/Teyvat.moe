// List action types.
import _ from 'lodash';

import { getUnixTimestamp } from '~/components/Util';

/**
 * This action sets a single marker as completed at the given time.
 */
export const SET_FEATURE_MARKER_COMPLETED = 'genshinmap/completed/SET_FEATURE_MARKER_COMPLETED';
/**
 * This action sets multiple marker as completed at the given time.
 */
export const SET_FEATURE_MARKERS_COMPLETED = 'genshinmap/completed/SET_FEATURE_MARKERS_COMPLETED';
/**
 * This action sets a single marker in a single feature as uncompleted.
 */
export const CLEAR_FEATURE_MARKER_COMPLETED = 'genshinmap/completed/CLEAR_FEATURE_MARKER_COMPLETED';
/**
 * This action sets multiple markers in a single feature as uncompleted.
 */
export const CLEAR_FEATURE_MARKERS_COMPLETED =
  'genshinmap/completed/CLEAR_FEATURE_MARKERS_COMPLETED';

/**
 * This action sets multiple feature markers as completed at the given time.
 */
export const SET_FEATURES_COMPLETED = 'genshinmap/completed/SET_FEATURES_COMPLETED';
/**
 * This action clears the completion status of all markers of a feature.
 */
export const CLEAR_FEATURE_COMPLETED = 'genshinmap/completed/CLEAR_FEATURE_COMPLETED';

/**
 * The reducer.
 * @param {*} state The current state.
 * @param {*} action An action to perform.
 * @returns {*} The modified state.
 */
const completedReducer = (state, action) => {
  switch (action.type) {
    case SET_FEATURE_MARKERS_COMPLETED:
      // Set whether a given set of feature markers is completed.
      return {
        ...state,
        completed: {
          ...state.completed,
          ..._.fromPairs(_.map(action.payload.features, (id) => [id, action.payload.timestamp])),
        },
      };
    case SET_FEATURE_MARKER_COMPLETED:
      // Set whether a given feature marker is completed.
      return {
        ...state,
        completed: {
          ...state.completed,
          features: {
            ...state.completed.features,
            [action.payload.marker]: action.payload.timestamp,
          },
        },
      };
    case CLEAR_FEATURE_COMPLETED:
      // Clear completion of all markers of a given feature.
      const newFeatures = _.omit(
        state.completed.features,
        _.keys(state.completed.features).filter((key) => key.startsWith(action.payload.key))
      );
      return {
        ...state,
        completed: {
          ...state.completed,
          features: newFeatures,
        },
      };
    case CLEAR_FEATURE_MARKERS_COMPLETED:
      // Clear completion of all specified markers.
      const newMarkerFeatureData = _.omit(state.completed.features, action.payload.markers);
      // Set whether a given route is visible.
      return {
        ...state,
        completed: {
          ...state.completed,
          features: {
            ...state.completed.features,
            ...newMarkerFeatureData,
          },
        },
      };
    case CLEAR_FEATURE_MARKER_COMPLETED:
      // Clear completion of a single marker.
      const clearedFeatures = _.omit(state.completed.features, [action.payload.marker]);

      return {
        ...state,
        completed: {
          ...state.completed,
          features: clearedFeatures,
        },
      };

    default:
      console.error(`COMPLETED REDUCER ERROR: Unknown action '${action.type}'`);
  }
  return state;
};

// Export the reducer as default.
export default completedReducer;

// The action creators.
/**
 * Set an array of markers as completed.
 * @param {*} markers The markers to set the state of.
 * @param {*} timestamp The timestamp the marker was completed at.
 * @returns An action to be dispatched.
 */
export const setFeatureMarkersCompleted = (markers, timestamp = getUnixTimestamp()) => {
  return {
    type: SET_FEATURE_MARKERS_COMPLETED,
    payload: {
      markers,
      timestamp,
    },
  };
};
/**
 * Set a single marker as completed.
 * @param {*} markerKey The marker to set the state of.
 * @param {*} timestamp The timestamp the marker was completed at.
 * @returns An action to be dispatched.
 */
export const setFeatureMarkerCompleted = (marker, timestamp = getUnixTimestamp()) => {
  return {
    type: SET_FEATURE_MARKER_COMPLETED,
    payload: {
      marker,
      timestamp,
    },
  };
};
/**
 * Unset multiple markers as completed.
 * @param {*} markers The markers to clear.
 */
export const clearFeatureMarkersCompleted = (markers) => {
  return {
    type: CLEAR_FEATURE_MARKERS_COMPLETED,
    payload: {
      markers,
    },
  };
};
/**
 * Unset a single marker as completed.
 * @param {*} marker The marker to clear.
 */
export const clearFeatureMarkerCompleted = (marker) => {
  return {
    type: CLEAR_FEATURE_MARKER_COMPLETED,
    payload: {
      marker,
    },
  };
};
/**
 * Clear completion of all markers of a feature.
 * @param {*} featureKey The key of the feature to clear.
 * @returns An action to be dispatched.
 */
export const clearFeatureCompleted = (featureKey) => {
  return {
    type: CLEAR_FEATURE_COMPLETED,
    payload: {
      key: featureKey,
    },
  };
};
