// List action types.
import _ from 'lodash';

import { getUnixTimestamp } from '../../components/Util';

/**
 * This action sets a single marker in a single feature as completed at the given time.
 */
export const SET_FEATURE_MARKER_COMPLETED = 'genshinmap/completed/SET_FEATURE_MARKER_COMPLETED';
/**
 * This action sets a single marker in a single feature as uncompleted.
 */
export const CLEAR_FEATURE_MARKER_COMPLETED = 'genshinmap/completed/CLEAR_FEATURE_MARKER_COMPLETED';
/**
 * This action sets multiple markers in a single feature as uncompleted.
 */
export const CLEAR_FEATURE_MARKERS_COMPLETED =
  'genshinmap/completed/CLEAR_FEATURE_MARKER_COMPLETED';
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
    case SET_FEATURES_COMPLETED:
      // Set whether a given feature marker is completed.
      return {
        ...state,
        completed: {
          ...state.completed,
          features: {
            ...state.completed.features,
            // Translate each feature into its old data, plus the new IDs with the new timestamp as the completion date.
            ...Object.keys(action.payload.features).map((featureKey) => ({
              ...state.completed.features[featureKey],
              ...action.payload.features[featureKey].map((id) => ({
                [id]: action.payload.timestamp,
              })),
            })),
          },
        },
      };
    case CLEAR_FEATURE_COMPLETED:
      // Clear completion of all markers of a given feature.
      return {
        ...state,
        completed: {
          ...state.completed,
          features: {
            ...state.completed.features,
            // Set to blank, all false.
            [action.payload.key]: {},
          },
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
            [action.payload.key]: {
              ...state.completed.features[action.payload.key],
              [action.payload.id]: action.payload.timestamp,
            },
          },
        },
      };
    case CLEAR_FEATURE_MARKER_COMPLETED:
      const { [action.payload.id]: _clearedMarker, ...newFeatureData } = state.completed.features[
        action.payload.key
      ];
      // Set whether a given route is visible.
      return {
        ...state,
        completed: {
          ...state.completed,
          features: {
            ...state.completed.features,
            [action.payload.key]: {
              // Drop the cleared marker while including everything else.
              ...newFeatureData,
            },
          },
        },
      };
    case CLEAR_FEATURE_MARKERS_COMPLETED:
      const newMarkerFeatureData = _.pickBy(
        state.completed.features[action.payload.key],
        (_value, key) => action.payload.ids.includes(key)
      );
      // Set whether a given route is visible.
      return {
        ...state,
        completed: {
          ...state.completed,
          features: {
            ...state.completed.features,
            [action.payload.key]: {
              // Drop the cleared marker while including everything else.
              ...newMarkerFeatureData,
            },
          },
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
 * Set a single marker as completed.
 * @param {*} featureKey The feature to set the state of.
 * @param {*} markerId The ID of the marker to set the state of.
 * @param {*} displayed The new state of the feature's visibility.
 * @returns An action to be dispatched.
 */
export const setFeatureMarkerCompleted = (featureKey, markerId, timestamp = getUnixTimestamp()) => {
  return {
    type: SET_FEATURE_MARKER_COMPLETED,
    payload: {
      key: featureKey,
      id: markerId,
      timestamp,
    },
  };
};
export const clearFeatureMarkersCompleted = (featureKey, markerIds) => {
  return {
    type: CLEAR_FEATURE_MARKER_COMPLETED,
    payload: {
      key: featureKey,
      ids: markerIds,
    },
  };
};
export const clearFeatureMarkerCompleted = (featureKey, markerId) => {
  return {
    type: CLEAR_FEATURE_MARKER_COMPLETED,
    payload: {
      key: featureKey,
      id: markerId,
    },
  };
};
/**
 * Set whether a given route is enabled.
 * @param {*} features A map of features: {[featureKey]: [featureIds]}
 * @param {*} timestamp The timestamp to mark them as completed on.
 * @returns An action to be dispatched.
 */
export const setFeaturesCompleted = (features, timestamp = getUnixTimestamp()) => {
  return {
    type: SET_FEATURES_COMPLETED,
    payload: {
      features,
      timestamp,
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
