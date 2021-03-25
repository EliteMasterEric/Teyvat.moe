/**
 * Handles the section of the state that stores the transient state
 * of the user interface, such as current tab or map position.
 */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';

import { MSFMarkerID, MSFRouteID } from 'src/components/data/ElementSchema';
import { MapCategoryKey } from 'src/components/data/MapCategories';
import { MapRegionKey } from 'src/components/data/MapRegions';
import { EditorMarker, EditorRoute } from 'src/components/preferences/EditorDataSchema';
import { GenshinMapPreferencesLatest } from 'src/components/preferences/PreferencesSchema';
import { clearPreferences, setPreferences } from 'src/components/redux/actions';
import { AppState } from 'src/components/redux/types';

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

type MarkerReplaceAction = {
  existingId: MSFMarkerID;
  newMarker: EditorMarker;
};
type MarkerEditAction = {
  existingId: MSFMarkerID;
  markerProperty: string; // TODO: Validate this?;
  propertyValue: any;
};

type RouteReplaceAction = {
  existingId: MSFRouteID;
  newRoute: EditorRoute;
};
type RouteEditAction = {
  existingId: MSFRouteID;
  routeProperty: string; // TODO: Validate this?
  propertyValue: any;
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
    setFeatureCategory: (state, action: PayloadAction<MapCategoryKey>) => {
      state.feature.category = action.payload;
    },
    setFeatureRegion: (state, action: PayloadAction<MapRegionKey>) => {
      state.feature.region = action.payload;
    },
    clearElements: (state) => {
      state.feature.data = [];
    },
    replaceMarker: {
      prepare: (id, marker) => {
        return { payload: { existingId: id, newMarker: marker } };
      },
      reducer: (state, action: PayloadAction<MarkerReplaceAction>) => {
        state.feature.data = state.feature.data.map((marker) =>
          marker.id === action.payload.existingId ? action.payload.newMarker : marker
        );
      },
    },
    editMarker: {
      prepare: (id: MSFMarkerID, property: string, value) => {
        return { payload: { existingId: id, markerProperty: property, propertyValue: value } };
      },
      reducer: (state, action: PayloadAction<MarkerEditAction>) => {
        _.forEach(state.feature.data, (marker) => {
          if (marker.id === action.payload.existingId) {
            _.set(marker, action.payload.markerProperty, action.payload.propertyValue);
          }
        });
      },
    },
    replaceRoute: {
      prepare: (id: MSFRouteID, route: EditorRoute) => {
        return { payload: { existingId: id, newRoute: route } };
      },
      reducer: (state, action: PayloadAction<RouteReplaceAction>) => {
        state.feature.data = state.feature.data.map((route) =>
          route.id === action.payload.existingId ? action.payload.newRoute : route
        );
      },
    },
    editRoute: {
      prepare: (id: MSFRouteID, property: string, value) => {
        return { payload: { existingId: id, routeProperty: property, propertyValue: value } };
      },
      reducer: (state, action: PayloadAction<RouteEditAction>) => {
        _.forEach(state.feature.data, (route) => {
          if (route.id === action.payload.existingId) {
            _.set(route, action.payload.routeProperty, action.payload.propertyValue);
          }
        });
      },
    },
    removeMarker: (state, action: PayloadAction<MSFMarkerID>) => {
      state.feature.data = _.filter(state.feature.data, (element) => element.id !== action.payload);
    },
    removeRoute: (state, action: PayloadAction<MSFRouteID>) => {
      state.feature.data = _.filter(state.feature.data, (element) => element.id !== action.payload);
    },
    appendMarker: (state, action: PayloadAction<EditorMarker>) => {
      state.feature.data.push(action.payload);
    },
    appendRoute: (state, action: PayloadAction<EditorRoute>) => {
      state.feature.data.push(action.payload);
    },
  },
  extraReducers: {
    [setPreferences.toString()]: (state, action: PayloadAction<Partial<AppState>>) => {
      return {
        ...state,
        ...action.payload.editor,
      };
    },
    [clearPreferences.toString()]: () => {
      // Reset to the default state.
      return initialState;
    },
  },
});

export const {
  setFeatureName,
  setFeatureCategory,
  setFeatureRegion,
  clearElements,
  replaceMarker,
  replaceRoute,
  removeMarker,
  removeRoute,
  appendMarker,
  appendRoute,
  editMarker,
  editRoute,
} = editorSlice.actions;

/**
 * Convenience function to retrieve a given value from the root state.
 * @param state
 */
export const selectEditorFeatureName = (state: AppState): string => state.editor.feature.name;
export const selectEditorFeatureCategory = (state: AppState): MapCategoryKey =>
  state.editor.feature.category;
export const selectEditorFeatureRegion = (state: AppState): MapRegionKey =>
  state.editor.feature.region;
export const selectEditorFeatureData = (state: AppState): (EditorMarker | EditorRoute)[] =>
  state.editor.feature.data;

export default editorSlice.reducer;
