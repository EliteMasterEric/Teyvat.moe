import { createReducer } from '@reduxjs/toolkit';
import _ from 'lodash';
import {
  setFeatureDisplayed,
  clearFeatureDisplayed,
  toggleFeatureDisplayed,
  setRouteGroupDisplayed,
  clearRouteGroupDisplayed,
  toggleRouteGroupDisplayed,
} from './Actions';
import initialState from './InitialState';
import selectSlice from './Selector';
import { setPreferences, clearPreferences } from 'src/components/redux/slices/common/core';
import selectNamespace from 'src/components/redux/slices/map/Selector';
import { getRecord, setRecord } from 'src/components/util';

const displayedReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setFeatureDisplayed, (state, action) => {
      setRecord(state.features, action.payload, true);
    })
    .addCase(clearFeatureDisplayed, (state, action) => {
      setRecord(state.features, action.payload, false);
    })
    .addCase(toggleFeatureDisplayed, (state, action) => {
      setRecord(
        state.features,
        action.payload,
        !(getRecord(state.features, action.payload) ?? false)
      );
    })
    .addCase(setRouteGroupDisplayed, (state, action) => {
      setRecord(state.routes, action.payload, true);
    })
    .addCase(clearRouteGroupDisplayed, (state, action) => {
      setRecord(state.routes, action.payload, false);
    })
    .addCase(toggleRouteGroupDisplayed, (state, action) => {
      setRecord(state.routes, action.payload, !(getRecord(state.routes, action.payload) ?? false));
    })
    .addCase(setPreferences, (state, action) => {
      return selectSlice(selectNamespace(action.payload)) ?? state;
    })
    .addCase(clearPreferences, () => {
      return initialState;
    });
});

export default displayedReducer;
