import { createReducer } from '@reduxjs/toolkit';
import _ from 'lodash';
import {
  setCompletedAlpha,
  setClusterMarkers,
  setWorldBorderEnabled,
  setRegionLabelsEnabled,
  setHideFeaturesInEditor,
  setHideRoutesInEditor,
  setShowHiddenFeaturesInSummary,
  setOverrideLang,
} from './Actions';
import initialState from './InitialState';
import selectSlice from './Selector';
import { setPreferences, clearPreferences } from 'src/components/redux/slices/common/core';
import selectNamespace from 'src/components/redux/slices/map/Selector';

const optionsReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setCompletedAlpha, (state, action) => {
      state.completedAlpha = action.payload;
    })
    .addCase(setClusterMarkers, (state, action) => {
      state.clusterMarkers = action.payload;
    })
    .addCase(setWorldBorderEnabled, (state, action) => {
      state.worldBorderEnabled = action.payload;
    })
    .addCase(setRegionLabelsEnabled, (state, action) => {
      state.regionLabelsEnabled = action.payload;
    })
    .addCase(setHideFeaturesInEditor, (state, action) => {
      state.hideFeaturesInEditor = action.payload;
    })
    .addCase(setHideRoutesInEditor, (state, action) => {
      state.hideRoutesInEditor = action.payload;
    })
    .addCase(setShowHiddenFeaturesInSummary, (state, action) => {
      state.showHiddenFeaturesInSummary = action.payload;
    })
    .addCase(setOverrideLang, (state, action) => {
      state.overrideLang = action.payload;
    })
    .addCase(setPreferences, (state, action) => {
      return selectSlice(selectNamespace(action.payload)) ?? state;
    })
    .addCase(clearPreferences, () => {
      return initialState;
    });
});

export default optionsReducer;
