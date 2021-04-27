import { createReducer } from '@reduxjs/toolkit';
import _ from 'lodash';
import {
  disableGoogleAuth,
  initializeGoogleClient,
  setGoogleAuthProfile,
  setGoogleClientInProgress,
} from './Actions';
import initialState from './InitialState';
import selectSlice from './Selector';
import { setPreferences, clearPreferences } from 'src/components/redux/slices/common/core';
import selectNamespace from 'src/components/redux/slices/map/Selector';

const loadingReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(disableGoogleAuth, (state) => {
      state.google.enabled = false;
    })
    .addCase(setGoogleAuthProfile, (state, action) => {
      state.google.profile = action.payload;
    })
    .addCase(initializeGoogleClient, (state) => {
      state.google.initialized = true;
    })
    .addCase(setGoogleClientInProgress, (state, action) => {
      state.google.inProgress = action.payload;
    })
    .addCase(setPreferences, (state, action) => {
      return selectSlice(selectNamespace(action.payload)) ?? state;
    })
    .addCase(clearPreferences, () => {
      return initialState;
    });
});

export default loadingReducer;
