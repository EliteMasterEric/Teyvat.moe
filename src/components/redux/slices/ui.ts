/**
 * Handles the section of the state that stores the transient state
 * of the user interface, such as current tab or map position.
 */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { MSFMarkerID, MSFRouteID } from '~/components/data/ElementSchema';
import { CLEAR_PREFERENCES } from '~/components/redux/actions';
import { AppState } from '~/components/redux/types';
import { MapCategory, MapPosition, MapRegion, UIControlsTab } from '~/components/Types';
import { DEFAULT_ZOOM, MAP_CENTER } from '~/components/views/map/LayerConstants';

export type UIState = {
  tab: UIControlsTab;
  mapCategory: MapCategory;
  mapRegion: MapRegion;

  /**
   * Whether the map controls are open or collapsed.
   */
  open: boolean;
  /**
   * The marker or route with this ID will have a different color.
   */
  mapHighlight: MSFMarkerID | MSFRouteID | null;
  // When the user moves on the map, this value should be updated.
  // Likewise, when this value updates, smoothly move the user on the map.
  // Allows for repositioning on the map by updating the state.
  mapPosition: MapPosition;
  /**
   * Whether to show the editor tools.
   */
  editorEnabled: boolean;
  /**
   * Whether to show the editor debug window.
   */
  editorDebugEnabled: boolean;
};

// Define the initial state
export const initialState: UIState = {
  tab: 'help',
  mapCategory: 'special',
  mapRegion: 'mondstadt',

  open: true,
  mapHighlight: null,
  mapPosition: {
    latlng: {
      lat: MAP_CENTER[0],
      lng: MAP_CENTER[1],
    },
    zoom: DEFAULT_ZOOM,
  },
  editorEnabled: false,
  editorDebugEnabled: false,
};

// Define a type using that initial state.

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // ImmerJS allows you to change the state by modifying state parameter object.
    // This provides automatic state merging.
    setTab: (state, action: PayloadAction<UIControlsTab>) => {
      state.tab = action.payload;
    },
    setMapCategory: (state, action: PayloadAction<MapCategory>) => {
      state.mapCategory = action.payload;
    },
    setMapRegion: (state, action: PayloadAction<MapRegion>) => {
      state.mapRegion = action.payload;
    },
    setOpen: (state, action: PayloadAction<boolean>) => {
      state.open = action.payload;
    },
    toggleOpen: (state) => {
      state.open = !state.open;
    },
    setMapHighlight: (state, action: PayloadAction<MSFMarkerID | MSFRouteID>) => {
      state.mapHighlight = action.payload;
    },
    clearMapHighlight: (state) => {
      state.mapHighlight = null;
    },
    setMapPosition: (state, action: PayloadAction<MapPosition>) => {
      state.mapPosition = action.payload;
    },
    setEditorEnabled: (state, action: PayloadAction<boolean>) => {
      state.editorEnabled = action.payload;
    },
    toggleEditorEnabled: (state) => {
      state.editorEnabled = !state.editorEnabled;
    },
    setEditorDebugEnabled: (state, action: PayloadAction<boolean>) => {
      state.editorDebugEnabled = action.payload;
    },
    toggleEditorDebugEnabled: (state) => {
      state.editorDebugEnabled = !state.editorEnabled;
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
  setTab,
  setMapCategory,
  setMapRegion,
  setOpen,
  toggleOpen,
  setMapHighlight,
  clearMapHighlight,
  setMapPosition,
} = uiSlice.actions;

/**
 * Convenience functions to retrieve a given value from the root state.
 */
export const selectTab = (state: AppState): UIControlsTab => state.ui.tab;
export const selectMapCategory = (state: AppState): MapCategory => state.ui.mapCategory;
export const selectMapRegion = (state: AppState): MapRegion => state.ui.mapRegion;
export const selectOpen = (state: AppState): boolean => state.ui.open;
export const selectMapHighlight = (state: AppState): UIState['mapHighlight'] =>
  state.ui.mapHighlight;
export const selectMapPosition = (state: AppState): MapPosition => state.ui.mapPosition;
export const selectEditorEnabled = (state: AppState): boolean => state.ui.editorEnabled;
export const selectEditorDebugEnabled = (state: AppState): boolean => state.ui.editorDebugEnabled;

export default uiSlice.reducer;
