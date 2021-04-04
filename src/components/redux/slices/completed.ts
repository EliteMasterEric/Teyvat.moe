/**
 * Handles the section of the state that stores the transient state
 * of the user interface, such as current tab or map position.
 */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';

import { MSFFeatureKey, MSFMarkerKey } from 'src/components/data/ElementSchema';
import { getMapFeature } from 'src/components/data/MapFeatures';
import { GenshinMapPreferencesLatest } from 'src/components/preferences/PreferencesSchema';
import { clearPreferences, setPreferences } from 'src/components/redux/actions';
import { AppState } from 'src/components/redux/types';
import {
  deleteRecord,
  getPreviousMondayReset,
  getUnixTimestamp,
  getRecord,
  setRecord,
} from 'src/components/util';

export type CompletedState = GenshinMapPreferencesLatest['completed'];

// Define the initial state
export const initialState: CompletedState = {
  features: {},
};

type MarkerCompletedAction = {
  key: MSFMarkerKey;
  timestamp: number;
};
type MarkersCompletedAction = {
  keys: MSFMarkerKey[];
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
        setRecord(state.features, action.payload.key, action.payload.timestamp);
      },
    },
    setMarkersCompleted: {
      prepare: (keys: MSFMarkerKey[]) => {
        return { payload: { keys, timestamp: getUnixTimestamp() } };
      },

      reducer: (state, action: PayloadAction<MarkersCompletedAction>) => {
        _.forEach(action.payload.keys, (key: MSFMarkerKey) => {
          setRecord(state.features, key, action.payload.timestamp);
        });
      },
    },
    clearMarkerCompleted: (state, action: PayloadAction<MSFMarkerKey>) => {
      deleteRecord(state.features, action.payload);
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
    [setPreferences.toString()]: (state, action: PayloadAction<Partial<AppState>>) => {
      return {
        ...state,
        ...action.payload.completed,
      };
    },
    [clearPreferences.toString()]: () => {
      // Reset to the default state.
      return initialState;
    },
  },
});

export const {
  setMarkerCompleted,
  setMarkersCompleted,
  clearMarkerCompleted,
  clearMarkersCompleted,
  clearFeatureCompleted,
} = completedSlice.actions;

/*
 * Convenience functions to retrieve a given value from the root state.
 */

export const selectMarkerCompleted = (state: AppState, markerKey: MSFMarkerKey): number | null =>
  getRecord(state.completed.features, markerKey);
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
    if (featureKey == null) return false;

    const feature = getMapFeature(featureKey as MSFFeatureKey);
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
