import { createReducer } from '@reduxjs/toolkit';
import _ from 'lodash';
import { setLoading } from './Actions';
import initialState from './InitialState';
import selectSlice from './Selector';
import { setPreferences, clearPreferences } from 'src/components/redux/slices/common/core';
import selectNamespace from 'src/components/redux/slices/map/Selector';

const loadingReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setLoading, (state, action) => {
      state[action.payload.loadingKey] = action.payload.newValue;
    })
    .addCase(setPreferences, (state, action) => {
      return selectSlice(selectNamespace(action.payload)) ?? state;
    })
    .addCase(clearPreferences, () => {
      return initialState;
    });
});

export default loadingReducer;
