import { createReducer } from '@reduxjs/toolkit';
import _ from 'lodash';
import { setShowHiddenAchievements } from './Actions';
import initialState from './InitialState';
import selectSlice from './Selector';
import selectNamespace from 'src/components/redux/slices/achievements/Selector';
import { setPreferences, clearPreferences } from 'src/components/redux/slices/common/core';

const optionsReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setShowHiddenAchievements, (state, action) => {
      state.showHiddenAchievements = action.payload;
    })
    .addCase(setPreferences, (state, action) => {
      return selectSlice(selectNamespace(action.payload)) ?? state;
    })
    .addCase(clearPreferences, () => {
      return initialState;
    });
});

export default optionsReducer;
