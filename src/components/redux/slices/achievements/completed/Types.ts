import { AchievementId } from 'src/components/data/achievements/AchievementData';
import { TeyvatMoeAchievementPreferencesLatest } from 'src/components/preferences/achievements/PreferencesSchema';

export type CompletedState = TeyvatMoeAchievementPreferencesLatest['completed'];

export type AchievementCompletedActionPayload = {
  key: AchievementId;
  timestamp: number;
};
export type AchievementsCompletedActionPayload = {
  keys: AchievementId[];
  timestamp: number;
};
