/**
 * Handles the section of the state that stores the transient state
 * of the user interface, such as current tab or map position.
 */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';

import { MSFMarkerID, MSFRouteID } from '~/components/data/ElementSchema';
import { EditorMarker, EditorRoute } from '~/components/preferences/EditorDataSchema';
import { GenshinMapPreferencesLatest } from '~/components/preferences/PreferencesSchema';
import { CLEAR_PREFERENCES } from '~/components/redux/actions';
import { AppState } from '~/components/redux/types';
import { MapCategory, MapRegion } from '~/components/Types';

export type EditorState = GenshinMapPreferencesLatest['editor'];

// Define the initial state
export const initialState: EditorState = {
  feature: {
    name: '',
    category: 'special',
    region: 'mondstadt',
    data: [],
  },
};

// Define a type using that initial state.

type MarkerEditAction = {
  existingId: MSFMarkerID;
  newMarker: EditorMarker;
};

type RouteEditAction = {
  existingId: MSFRouteID;
  newRoute: EditorRoute;
};

export const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    // ImmerJS allows you to change the state by modifying state parameter object.
    // This provides automatic state merging.
    setFeatureName: (state, action: PayloadAction<string>) => {
      state.feature.name = action.payload;
    },
    setFeatureCategory: (state, action: PayloadAction<MapCategory>) => {
      state.feature.category = action.payload;
    },
    setFeatureRegion: (state, action: PayloadAction<MapRegion>) => {
      state.feature.region = action.payload;
    },
    clearElements: (state) => {
      state.feature.data = [];
    },
    editMarker: {
      prepare: (key, marker) => {
        return { payload: { existingId: key, newMarker: marker } };
      },
      reducer: (state, action: PayloadAction<MarkerEditAction>) => {
        state.feature.data = state.feature.data.map((marker) =>
          marker.id === action.payload.existingId ? action.payload.newMarker : marker
        );
      },
    },
    editRoute: {
      prepare: (key, route) => {
        return { payload: { existingId: key, newRoute: route } };
      },
      reducer: (state, action: PayloadAction<RouteEditAction>) => {
        state.feature.data = state.feature.data.map((route) =>
          route.id === action.payload.existingId ? action.payload.newRoute : route
        );
      },
    },
    appendMarker: (state, action: PayloadAction<EditorMarker>) => {
      state.feature.data.push(action.payload);
    },
    appendRoute: (state, action: PayloadAction<EditorRoute>) => {
      state.feature.data.push(action.payload);
    },
  },
  extraReducers: {
    [CLEAR_PREFERENCES.toString()]: () => {
      // Reset to the default state.
      return initialState;
    },
  },
});

export const { setFeatureName, setFeatureCategory, setFeatureRegion } = editorSlice.actions;

/**
 * Convenience function to retrieve a given value from the root state.
 * @param state
 */
export const selectFeatureName = (state: AppState): string => state.editor.feature.name;
export const selectFeatureCategory = (state: AppState): MapCategory =>
  state.editor.feature.category;
export const selectFeatureRegion = (state: AppState): MapRegion => state.editor.feature.region;
export const selectFeatureData = (state: AppState): (EditorMarker | EditorRoute)[] =>
  state.editor.feature.data;

export default editorSlice.reducer;
