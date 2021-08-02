import { AnyAction } from '@reduxjs/toolkit';
import _ from 'lodash';
import { reducer as completedReducer, selectSliceCompleted } from './completed';
import { reducer as optionsReducer, selectSliceOptions } from './options';
import { AchievementsState } from './Types';

const achievementsReducer = (
  currentState: AchievementsState | null,
  action: AnyAction
): AchievementsState => ({
  completed: completedReducer(selectSliceCompleted(currentState), action),
  options: optionsReducer(selectSliceOptions(currentState), action),
});

export default achievementsReducer;
