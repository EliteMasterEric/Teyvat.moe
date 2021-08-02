import { AnyAction } from '@reduxjs/toolkit';
import _ from 'lodash';
import initialState from './InitialState';
import { AppState } from './Types';
import { selectNamespaceAchievements } from 'src/components/redux/slices/achievements';
import achievementsReducer from 'src/components/redux/slices/achievements/Reducer';
import {
  reducer as commonReducer,
  selectNamespaceCommon,
} from 'src/components/redux/slices/common';
import { reducer as mapReducer, selectNamespaceMap } from 'src/components/redux/slices/map';

const reducer = (currentState: AppState = initialState, action: AnyAction): AppState => ({
  common: commonReducer(selectNamespaceCommon(currentState), action),
  map: mapReducer(selectNamespaceMap(currentState), action),
  achievements: achievementsReducer(selectNamespaceAchievements(currentState), action),
});

export default reducer;
