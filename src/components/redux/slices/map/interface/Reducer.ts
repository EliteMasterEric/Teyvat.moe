import { createReducer } from '@reduxjs/toolkit';
import _ from 'lodash';
import {
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
  setMapMarkerCount,
  setMapRouteCount,
  setPermalinkId,
} from './Actions';
import initialState from './InitialState';
import selectSlice from './Selector';
import { setPreferences, clearPreferences } from 'src/components/redux/slices/common/core';
import selectNamespace from 'src/components/redux/slices/map/Selector';

const displayedReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setTab, (state, action) => {
      state.tab = action.payload;
    })
    .addCase(setMapCategory, (state, action) => {
      state.mapCategory = action.payload;
    })
    .addCase(setMapRegion, (state, action) => {
      state.mapRegion = action.payload;
    })
    .addCase(setOpen, (state, action) => {
      state.open = action.payload;
    })
    .addCase(toggleOpen, (state) => {
      state.open = !state.open;
    })
    .addCase(setMapHighlight, (state, action) => {
      state.mapHighlight = action.payload;
    })
    .addCase(clearMapHighlight, (state) => {
      state.mapHighlight = null;
    })
    .addCase(setMapPosition, (state, action) => {
      state.mapPosition = action.payload;
    })
    .addCase(setEditorEnabled, (state, action) => {
      state.editorEnabled = action.payload;
    })
    .addCase(toggleEditorEnabled, (state) => {
      state.editorEnabled = !state.editorEnabled;
    })
    .addCase(setEditorDebugEnabled, (state, action) => {
      state.editorDebugEnabled = action.payload;
    })
    .addCase(toggleEditorDebugEnabled, (state) => {
      state.editorDebugEnabled = !state.editorEnabled;
    })
    .addCase(setMapMarkerCount, (state, action) => {
      state.mapStats.markerCount = action.payload;
    })
    .addCase(setMapRouteCount, (state, action) => {
      state.mapStats.routeCount = action.payload;
    })
    .addCase(setPermalinkId, (state, action) => {
      state.permalinkId = action.payload;
    })
    .addCase(setPreferences, (state, action) => {
      return selectSlice(selectNamespace(action.payload)) ?? state;
    })
    .addCase(clearPreferences, () => {
      return initialState;
    });
});

export default displayedReducer;
