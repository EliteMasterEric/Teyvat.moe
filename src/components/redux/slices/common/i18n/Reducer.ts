import { createReducer } from '@reduxjs/toolkit';
import _ from 'lodash';
import { setLanguage } from './Actions';
import initialState from './InitialState';
import selectSlice from './Selector';
import { setPreferences, clearPreferences } from 'src/components/redux/slices/common/core';
import selectNamespace from 'src/components/redux/slices/common/Selector';

const i18nReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setLanguage, (state, action) => {
      state.currentLanguage = action.payload;
    })
    .addCase(setPreferences, (state, action) => {
      return selectSlice(selectNamespace(action.payload)) ?? state;
    })
    .addCase(clearPreferences, () => {
      return initialState;
    });
});

export default i18nReducer;
