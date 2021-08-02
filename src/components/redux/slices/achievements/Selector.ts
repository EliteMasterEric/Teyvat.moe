import { AchievementsState } from './Types';
import initialAppState from 'src/components/redux/InitialState';
import { AppState } from 'src/components/redux/Types';

const selectNamespace = (state: AppState | Partial<AppState> | null): AchievementsState => {
  return state?.achievements ?? initialAppState.achievements;
};
export default selectNamespace;
