/**
 * Handles the section of the state that stores the user's preferences,
 * as selected in the options menu.
 */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { GenshinMapPreferencesLatest } from '~/components/preferences/PreferencesSchema';
import { CLEAR_PREFERENCES } from '~/components/redux/actions';
import { AppState } from '~/components/redux/types';

// Define a type for the slice state
export type OptionsState = GenshinMapPreferencesLatest['options'];

// Define the initial state using that type
export const initialState: OptionsState = {
  completedAlpha: 0.5, // Make 'Done' markers transparent.
  clusterMarkers: true, // Cluster nearby markers.
  worldBorderEnabled: true, // Display a red border on the area outside the playable space.
  regionLabelsEnabled: true, // Display text over notable regions.
  hideFeaturesInEditor: false, // Remove clutter while editing.
  hideRoutesInEditor: false, // Remove clutter while editing.
  overrideLang: '', // Override the current language.
};

export const optionsSlice = createSlice({
  name: 'options',
  initialState,
  reducers: {
    // ImmerJS allows you to change the state by modifying state parameter object.
    // This provides automatic state merging.
    setCompletedAlpha: (state, action: PayloadAction<number>) => {
      state.completedAlpha = action.payload;
    },
    setClusterMarkers: (state, action: PayloadAction<boolean>) => {
      state.clusterMarkers = action.payload;
    },
    setWorldBorderEnabled: (state, action: PayloadAction<boolean>) => {
      state.worldBorderEnabled = action.payload;
    },
    setRegionLabelsEnabled: (state, action: PayloadAction<boolean>) => {
      state.regionLabelsEnabled = action.payload;
    },
    setHideFeaturesInEditor: (state, action: PayloadAction<boolean>) => {
      state.hideFeaturesInEditor = action.payload;
    },
    setHideRoutesInEditor: (state, action: PayloadAction<boolean>) => {
      state.hideRoutesInEditor = action.payload;
    },
    setOverrideLang: (state, action: PayloadAction<string>) => {
      state.overrideLang = action.payload;
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
  setCompletedAlpha,
  setClusterMarkers,
  setWorldBorderEnabled,
  setRegionLabelsEnabled,
  setHideFeaturesInEditor,
  setHideRoutesInEditor,
  setOverrideLang,
} = optionsSlice.actions;

/**
 * Convenience function to retrieve a given value from the root state.
 * @param state
 */
export const selectCompletedAlpha = (state: AppState): number => state.options.completedAlpha;
export const selectClusterMarkers = (state: AppState): boolean => state.options.clusterMarkers;
export const selectWorldBorderEnabled = (state: AppState): boolean =>
  state.options.worldBorderEnabled;
export const selectRegionLabelsEnabled = (state: AppState): boolean =>
  state.options.regionLabelsEnabled;
export const selectHideFeaturesInEditor = (state: AppState): boolean =>
  state.options.hideFeaturesInEditor;
export const selectHideRoutesInEditor = (state: AppState): boolean =>
  state.options.hideRoutesInEditor;
export const selectOverrideLang = (state: AppState): string => state.options.overrideLang;

export default optionsSlice.reducer;
