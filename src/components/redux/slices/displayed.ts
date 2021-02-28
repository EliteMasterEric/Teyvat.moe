/**
 * Handles the section of the state that stores the transient state
 * of the user interface, such as current tab or map position.
 */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';

import { MSFFeatureKey, MSFRouteGroupKey } from '~/components/data/ElementSchema';
import { GenshinMapPreferencesLatest } from '~/components/preferences/PreferencesSchema';
import { CLEAR_PREFERENCES } from '~/components/redux/actions';
import { AppState } from '~/components/redux/types';

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
      state.features[action.payload] = true;
    },
    clearFeatureDisplayed: (state, action: PayloadAction<MSFFeatureKey>) => {
      state.features[action.payload] = false;
    },
    toggleFeatureDisplayed: (state, action: PayloadAction<MSFFeatureKey>) => {
      state.features[action.payload] =
        state.features[action.payload] === undefined ? true : !state.features[action.payload];
    },
    setRouteDisplayed: (state, action: PayloadAction<MSFRouteGroupKey>) => {
      state.routes[action.payload] = true;
    },
    clearRouteDisplayed: (state, action: PayloadAction<MSFRouteGroupKey>) => {
      state.routes[action.payload] = false;
    },
    toggleRouteDisplayed: (state, action: PayloadAction<MSFRouteGroupKey>) => {
      state.routes[action.payload] =
        state.routes[action.payload] === undefined ? true : !state.routes[action.payload];
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
  setFeatureDisplayed,
  clearFeatureDisplayed,
  toggleFeatureDisplayed,
  setRouteDisplayed,
  clearRouteDisplayed,
  toggleRouteDisplayed,
} = displayedSlice.actions;

/**
 * Convenience function to retrieve a given value from the root state.
 * @param state
 */
export const selectDisplayedFeatures = (state: AppState): string[] =>
  _.keys(_.pickBy(state.displayed.features, (value) => value));
export const selectDisplayedRouteGroups = (state: AppState): string[] =>
  _.keys(_.pickBy(state.displayed.routes, (value) => value));
export const selectIsFeatureDisplayed = (state: AppState, featureKey: MSFFeatureKey): boolean =>
  state.displayed.features?.[featureKey] ?? false;
export const selectIsRouteGroupDisplayed = (state: AppState, routeKey: MSFRouteGroupKey): boolean =>
  state.displayed.routes?.[routeKey] ?? false;

export default displayedSlice.reducer;
