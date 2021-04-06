/**
 * Handles the section of the state that stores the transient state
 * of the user interface, such as current tab or map position.
 */
import _ from 'lodash';
import { PayloadAction, createSlice, Slice } from '@reduxjs/toolkit';

import { MSFMarkerID, MSFRouteID } from 'src/components/data/Element';
import { MapCategoryKey } from 'src/components/data/MapCategories';
import { DEFAULT_ZOOM, MAP_CENTER } from 'src/components/data/MapConstants';
import { MapRegionKey } from 'src/components/data/MapRegions';
import { clearPreferences, setPreferences } from 'src/components/redux/actions';
import { AppState } from 'src/components/redux/types';
import { MapPosition, UIControlsTab } from 'src/components/Types';

export type UIState = {
  tab: UIControlsTab;
  mapCategory: MapCategoryKey;
  mapRegion: MapRegionKey;

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

  mapStats: {
    markerCount: number | null;
    routeCount: number | null;
  };

  permalinkId: string | null;

  /**
   * The status of different parts of the UI.
   */
  loading: {
    initializedLoading: boolean;

    loadMapFeatures: boolean;
    loadMapRoutes: boolean;
    loadLeafletTiles: boolean;
    countMapFeatures: boolean;
    countMapRoutes: boolean;
    handlePermalinks: boolean;
  };
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

  mapStats: {
    markerCount: null,
    routeCount: null,
  },

  permalinkId: null,

  loading: {
    initializedLoading: false,

    loadMapFeatures: false,
    loadMapRoutes: false,
    loadLeafletTiles: false,
    countMapFeatures: false,
    countMapRoutes: false,
    handlePermalinks: true, // Set to false later.
  },
};

export type SetLoadingAction = Partial<UIState['loading']>;

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
    setMapCategory: (state, action: PayloadAction<MapCategoryKey>) => {
      state.mapCategory = action.payload;
    },
    setMapRegion: (state, action: PayloadAction<MapRegionKey>) => {
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
    setMapPosition: {
      prepare: (latlng: MapPosition['latlng'], zoom: MapPosition['zoom']) => {
        return { payload: { latlng, zoom } };
      },
      reducer: (state, action: PayloadAction<MapPosition>) => {
        state.mapPosition = action.payload;
      },
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
    setLoading: {
      prepare: (key: keyof UIState['loading'], status: boolean) => {
        const payload = { [key]: status };
        return { payload };
      },
      reducer: (state, action: PayloadAction<SetLoadingAction>) => {
        state.loading = {
          ...state.loading,
          ...action.payload,
        };
      },
    },
    setMapMarkerCount: (state, action: PayloadAction<number>) => {
      state.mapStats.markerCount = action.payload;
      state.loading.countMapFeatures = true;
    },
    setMapRouteCount: (state, action: PayloadAction<number>) => {
      state.mapStats.routeCount = action.payload;
      state.loading.countMapRoutes = true;
    },
    setPermalinkId: (state, action: PayloadAction<string>) => {
      state.permalinkId = action.payload;
      state.loading.handlePermalinks = false;
    },
  },
  extraReducers: {
    [setPreferences.toString()]: (state, action: PayloadAction<Partial<AppState>>) => {
      return {
        ...state,
        ...action.payload.ui,
      };
    },
    [clearPreferences.toString()]: () => {
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
  setEditorEnabled,
  toggleEditorEnabled,
  setEditorDebugEnabled,
  toggleEditorDebugEnabled,
  setLoading,
  setMapMarkerCount,
  setMapRouteCount,
  setPermalinkId,
} = uiSlice.actions;

/**
 * Convenience functions to retrieve a given value from the root state.
 */
export const selectTab = (state: AppState): UIControlsTab => state.ui.tab;
export const selectIsTabDisplayed = (
  state: AppState,
  tab: UIControlsTab | UIControlsTab[]
): boolean => {
  return Array.isArray(tab) ? tab.includes(selectTab(state)) : selectTab(state) === tab;
};
export const selectMapCategory = (state: AppState): MapCategoryKey => state.ui.mapCategory;
export const selectIsCategoryDisplayed = (state: AppState, category: MapCategoryKey): boolean =>
  selectMapCategory(state) === category;
export const selectMapRegion = (state: AppState): MapRegionKey => state.ui.mapRegion;
export const selectIsRegionDisplayed = (state: AppState, region: MapRegionKey): boolean =>
  selectMapRegion(state) === region;
export const selectOpen = (state: AppState): boolean => state.ui.open;
export const selectMapHighlight = (state: AppState): UIState['mapHighlight'] =>
  state.ui.mapHighlight;
export const selectIsMarkerHighlighted = (state: AppState, markerID: MSFMarkerID): boolean =>
  selectMapHighlight(state) == markerID;
export const selectIsRouteHighlighted = (state: AppState, routeID: MSFRouteID): boolean =>
  selectMapHighlight(state) == routeID;
export const selectMapPosition = (state: AppState): MapPosition => state.ui.mapPosition;
export const selectEditorEnabled = (state: AppState): boolean => state.ui.editorEnabled;
export const selectEditorDebugEnabled = (state: AppState): boolean => state.ui.editorDebugEnabled;
export const selectLoading = (state: AppState, key: keyof UIState['loading']): boolean =>
  state.ui.loading?.[key] ?? true;
/**
 * Returns true if NONE of the ui.loading values are false.
 * @returns
 */
export const selectFullyLoaded = (state: AppState): boolean =>
  _.values(state.ui.loading).every((v) => v);
export const selectMapMarkerCount = (state: AppState): number | null =>
  state.ui.mapStats.markerCount;
export const selectMapRouteCount = (state: AppState): number | null => state.ui.mapStats.routeCount;
export const selectPermalinkID = (state: AppState): string | null => state.ui.permalinkId;

export default uiSlice.reducer;
