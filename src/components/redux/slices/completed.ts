/**
 * Handles the section of the state that stores the transient state
 * of the user interface, such as current tab or map position.
 */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';

import { MapFeatures } from '~/components/data/MapFeatures';
import { MSFFeatureKey, MSFMarkerKey } from '~/components/data/ElementSchema';
import { GenshinMapPreferencesLatest } from '~/components/preferences/PreferencesSchema';
import { CLEAR_PREFERENCES } from '~/components/redux/actions';
import { AppState } from '~/components/redux/types';
import { getPreviousMondayReset, getUnixTimestamp } from '~/components/Util';

export type CompletedState = GenshinMapPreferencesLatest['completed'];

// Define the initial state
export const initialState: CompletedState = {
  features: {},
};

// Define a type using that initial state.

type MarkerCompletedAction = {
  key: MSFMarkerKey;
  timestamp: number;
};

export const completedSlice = createSlice({
  name: 'completed',
  initialState,
  reducers: {
    // ImmerJS allows you to change the state by modifying state parameter object.
    // This provides automatic state merging.
    setMarkerCompleted: {
      prepare: (key: MSFMarkerKey) => {
        return { payload: { key, timestamp: getUnixTimestamp() } };
      },

      reducer: (state, action: PayloadAction<MarkerCompletedAction>) => {
        state.features[action.payload.key] = action.payload.timestamp;
      },
    },
    clearMarkerCompleted: (state, action: PayloadAction<MSFMarkerKey>) => {
      delete state.features[action.payload];
    },
    clearMarkersCompleted: (state, action: PayloadAction<MSFMarkerKey[]>) => {
      state.features = _.pickBy(
        state.features,
        (_value, key) => !action.payload.includes(<MSFMarkerKey>key)
      );
    },
    clearFeatureCompleted: (state, action: PayloadAction<MSFFeatureKey>) => {
      state.features = _.pickBy(state.features, (_value, key) => key.startsWith(action.payload));
    },
  },
  extraReducers: {
    [CLEAR_PREFERENCES.toString()]: () => {
      // Reset to the default state.
      return initialState;
    },
  },
});

export const {
  setMarkerCompleted,
  clearMarkerCompleted,
  clearMarkersCompleted,
  clearFeatureCompleted,
} = completedSlice.actions;

/**
 * Convenience function to retrieve a given value from the root state.
 * @param state
 */
export const selectCompletedMarkers = (state: AppState): CompletedState['features'] =>
  state.completed.features;
export const selectCompletedMarkersOfFeature = (
  state: AppState,
  featureKey: MSFFeatureKey
): CompletedState['features'] =>
  _.pickBy(state.completed.features, (_value, key) => key.startsWith(featureKey));
export const selectExpiredMarkers = (state: AppState): CompletedState['features'] => {
  const currentTime = getUnixTimestamp();
  return _.pickBy(state.completed.features, (completedTime: number, markerKey: MSFMarkerKey) => {
    const [featureKey, _markerID] = markerKey.split('/');

    const feature = MapFeatures[featureKey];
    switch (feature.respawn) {
      case 'off':
        // Doesn't respawn, thus doesn't expire.
        return false;
      case 'boss':
        // Respawns every monday.
        const lastRespawn = getPreviousMondayReset().getTime() / 1000;
        return lastRespawn > completedTime;
      default:
        const respawnTimer = <number>feature.respawn;
        const respawnTimestamp = completedTime + respawnTimer;

        return respawnTimestamp > currentTime;
    }
  });
};
export const selectExpiredMarkersOfFeature = (
  state: AppState,
  featureKey: MSFFeatureKey
): CompletedState['features'] =>
  _.pickBy(selectExpiredMarkers(state), (value, key) => key.startsWith(featureKey));

export default completedSlice.reducer;
