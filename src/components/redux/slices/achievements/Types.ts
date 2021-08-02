import { CompletedState } from 'src/components/redux/slices/achievements/completed/Types';
import { OptionsState } from 'src/components/redux/slices/achievements/options/Types';

export type AchievementsState = {
  completed: CompletedState;
  options: OptionsState;
};
