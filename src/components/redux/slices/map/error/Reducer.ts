import { createReducer } from '@reduxjs/toolkit';
import _ from 'lodash';
import { setImportError, clearImportError, clearErrors } from './Actions';
import initialState from './InitialState';
import selectSlice from './Selector';
import { setPreferences, clearPreferences } from 'src/components/redux/slices/common/core';
import selectNamespace from 'src/components/redux/slices/map/Selector';

const displayedReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setImportError, (state, action) => {
      state.importError = action.payload;
    })
    .addCase(clearImportError, (state) => {
      state.importError = initialState.importError;
    })
    .addCase(clearErrors, () => {
      return initialState;
    })
    .addCase(setPreferences, (state, action) => {
      return selectSlice(selectNamespace(action.payload)) ?? state;
    })
    .addCase(clearPreferences, () => {
      return initialState;
    });
});

export default displayedReducer;
