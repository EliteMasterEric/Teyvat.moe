import { createReducer } from '@reduxjs/toolkit';
import _ from 'lodash';
import {
  setMarkerCompleted,
  setMarkersCompleted,
  clearMarkerCompleted,
  clearMarkersCompleted,
  clearFeatureCompleted,
} from './Actions';
import initialState from './InitialState';
import selectSlice from './Selector';
import { clearPreferences, setPreferences } from 'src/components/redux/slices/common/core';
import selectNamespace from 'src/components/redux/slices/map/Selector';
import { deleteRecord, setRecord } from 'src/components/util';

const completedReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setMarkerCompleted, (state, action) => {
      setRecord(state.features, action.payload.key, action.payload.timestamp);
    })
    .addCase(setMarkersCompleted, (state, action) => {
      for (const key in action.payload.keys) {
        setRecord(state.features, key, action.payload.timestamp);
      }
    })
    .addCase(clearMarkerCompleted, (state, action) => {
      deleteRecord(state.features, action.payload);
    })
    .addCase(clearMarkersCompleted, (state, action) => {
      state.features = _.pickBy(state.features, (_value, key) => !_.includes(action.payload, key));
    })
    .addCase(clearFeatureCompleted, (state, action) => {
      state.features = _.pickBy(state.features, (_value, key) => _.startsWith(key, action.payload));
    })
    .addCase(setPreferences, (state, action) => {
      return selectSlice(selectNamespace(action.payload)) ?? state;
    })
    .addCase(clearPreferences, () => {
      return initialState;
    });
});

export default completedReducer;
