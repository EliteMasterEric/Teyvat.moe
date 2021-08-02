import { createReducer } from '@reduxjs/toolkit';
import _ from 'lodash';
import {
  setAchievementCompleted,
  setAchievementsCompleted,
  clearAchievementCompleted,
  clearAchievementsCompleted,
  clearAchievementCategoryCompleted,
} from './Actions';
import initialState from './InitialState';
import selectSlice from './Selector';
import { AchievementId, getAchievement } from 'src/components/data/achievements/AchievementData';
import selectNamespace from 'src/components/redux/slices/achievements/Selector';
import { clearPreferences, setPreferences } from 'src/components/redux/slices/common/core';
import { deleteRecord, setRecord } from 'src/components/util';

const completedReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setAchievementCompleted, (state, action) => {
      setRecord(state.achievements, action.payload.key, action.payload.timestamp);
    })
    .addCase(setAchievementsCompleted, (state, action) => {
      for (const key in action.payload.keys) {
        setRecord(state.achievements, key, action.payload.timestamp);
      }
    })
    .addCase(clearAchievementCompleted, (state, action) => {
      deleteRecord(state.achievements, action.payload);
    })
    .addCase(clearAchievementsCompleted, (state, action) => {
      state.achievements = _.pickBy(
        state.achievements,
        (_value, key) => !_.includes(action.payload, key)
      );
    })
    .addCase(clearAchievementCategoryCompleted, (state, action) => {
      state.achievements = _.pickBy(
        state.achievements,
        (_value, key: AchievementId) => getAchievement(key).category == action.payload
      );
    })
    .addCase(setPreferences, (state, action) => {
      return selectSlice(selectNamespace(action.payload)) ?? state;
    })
    .addCase(clearPreferences, () => {
      return initialState;
    });
});

export default completedReducer;
