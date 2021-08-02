import { setAchievementsCompleted } from './Actions';
import { AchievementId } from 'src/components/data/achievements/AchievementData';
import { dispatchAction } from 'src/components/redux/Dispatch';

export const dispatchSetAchievementsCompleted = (keys: AchievementId[]): void => {
  dispatchAction(setAchievementsCompleted(keys));
};
