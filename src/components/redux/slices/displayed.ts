/**
 * Handles the section of the state that stores the transient state
 * of the user interface, such as current tab or map position.
 */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';

import { MSFFeatureKey, MSFRouteGroupKey } from 'src/components/data/Element';
import { GenshinMapPreferencesLatest } from 'src/components/preferences/PreferencesSchema';
import { clearPreferences, setPreferences } from 'src/components/redux/actions';
import { AppState } from 'src/components/redux/types';
import { getRecord, setRecord } from 'src/components/util';

export type DisplayedState = GenshinMapPreferencesLatest['displayed'];

// Define the initial state
export const initialState: DisplayedState = {
  features: {
    // These features will be displayed to new users when they first open the site.
    mondstadtAnemoculus: true,
    mondstadtTeleporter: true,
    mondstadtStatue: true,
    mondstadtDomain: true,

    liyueGeoculus: true,
    liyueTeleporter: true,
    liyueStatue: true,
    liyueDomain: true,

    dragonspineCrimsonAgate: true,
    dragonspineTeleporter: true,
    dragonspineStatue: true,
    dragonspineDomain: true,
  },
  routes: {},
};

// Define a type using that initial state.

export const displayedSlice = createSlice({
  name: 'displayed',
  initialState,
  reducers: {
    // ImmerJS allows you to change the state by modifying state parameter object.
    // This provides automatic state merging.
    setFeatureDisplayed: (state, action: PayloadAction<MSFFeatureKey>) => {
      getRecord(state.features, action.payload);
    },
    clearFeatureDisplayed: (state, action: PayloadAction<MSFFeatureKey>) => {
      getRecord(state.features, action.payload);
    },
    toggleFeatureDisplayed: (state, action: PayloadAction<MSFFeatureKey>) => {
      setRecord(
        state.features,
        action.payload,
        !(getRecord(state.features, action.payload) ?? false)
      );
    },
    setRouteGroupDisplayed: (state, action: PayloadAction<MSFRouteGroupKey>) => {
      setRecord(state.routes, action.payload, true);
    },
    clearRouteGroupDisplayed: (state, action: PayloadAction<MSFRouteGroupKey>) => {
      setRecord(state.routes, action.payload, false);
    },
    toggleRouteGroupDisplayed: (state, action: PayloadAction<MSFRouteGroupKey>) => {
      setRecord(state.routes, action.payload, !(getRecord(state.routes, action.payload) ?? false));
    },
  },
  extraReducers: {
    [setPreferences.toString()]: (state, action: PayloadAction<Partial<AppState>>) => {
      return {
        ...state,
        ...action.payload.displayed,
      };
    },
    [clearPreferences.toString()]: () => {
      // Reset to the default state.
      return initialState;
    },
  },
});

export const {
  setFeatureDisplayed,
  clearFeatureDisplayed,
  toggleFeatureDisplayed,
  setRouteGroupDisplayed,
  clearRouteGroupDisplayed,
  toggleRouteGroupDisplayed,
} = displayedSlice.actions;

/**
 * Convenience function to retrieve a given value from the root state.
 * @param state
 */
export const selectDisplayedFeatures = (state: AppState): MSFFeatureKey[] =>
  _.keys(_.pickBy(state.displayed.features, (value) => value)) as MSFFeatureKey[];
export const selectDisplayedRouteGroups = (state: AppState): MSFRouteGroupKey[] =>
  _.keys(_.pickBy(state.displayed.routes, (value) => value)) as MSFRouteGroupKey[];
export const selectIsFeatureDisplayed = (state: AppState, featureKey: MSFFeatureKey): boolean =>
  getRecord(state.displayed.features, featureKey, false);
export const selectIsRouteGroupDisplayed = (
  state: AppState,
  routeKey: MSFRouteGroupKey
): boolean => {
  console.log(state.displayed.routes);
  console.log(routeKey);
  return getRecord(state.displayed.routes, routeKey, false);
};

export default displayedSlice.reducer;
