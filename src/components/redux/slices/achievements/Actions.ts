import { CompletedAction } from 'src/components/redux/slices/achievements/completed/Actions';
import { OptionsAction } from 'src/components/redux/slices/achievements/options/Actions';

export type AchievementsAction = CompletedAction | OptionsAction;
