import { AchievementsState } from './Types';
import { initialState as completedInitialState } from 'src/components/redux/slices/achievements/completed';
import { initialState as optionsInitialState } from 'src/components/redux/slices/achievements/options';

const initialState: AchievementsState = {
  completed: completedInitialState,
  options: optionsInitialState,
};

export default initialState;
