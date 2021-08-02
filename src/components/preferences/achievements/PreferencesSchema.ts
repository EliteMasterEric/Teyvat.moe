import { AchievementId } from 'src/components/data/achievements/AchievementData';

export const PREFERENCES_VERSION = 'ACH_001';

export interface ACH_001 {
  version: 'ACH_001';
  timestamp: number; // Value saved is in seconds.
  options: {
    showHiddenAchievements: boolean;
  };
  completed: {
    achievements: Record<AchievementId, number>; // Number is the timestamp. If record is absent, return null.
  };
  // Optional, used during loading to queue notifications to display,
  // indicating the success of data import.
  notify: { notifications: Notification[] };
}

export type TeyvatMoeAchievementPreferences = ACH_001;
export type TeyvatMoeAchievementPreferencesLatest = ACH_001;

export type TeyvatMoeAchievementPreferencesVersion = TeyvatMoeAchievementPreferences['version'];
