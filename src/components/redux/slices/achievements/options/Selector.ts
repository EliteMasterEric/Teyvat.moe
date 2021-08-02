import _ from 'lodash';
import initialState from './InitialState';
import { OptionsState } from './Types';
import selectNamespace from 'src/components/redux/slices/achievements/Selector';
import { AchievementsState } from 'src/components/redux/slices/achievements/Types';
import { AppState } from 'src/components/redux/Types';

export const selectShowHiddenAchievements = (state: AppState): boolean =>
  selectSlice(selectNamespace(state))?.showHiddenAchievements;

const selectSlice = (state: AchievementsState | null): OptionsState => {
  return state?.options ?? initialState;
};
export default selectSlice;
