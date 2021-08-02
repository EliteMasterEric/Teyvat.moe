import _ from 'lodash';
import { PREFERENCES_VERSION, TeyvatMoeAchievementPreferencesLatest } from './PreferencesSchema';
import { AchievementsState } from 'src/components/redux/slices/achievements/Types';
import { getUnixTimestamp } from 'src/components/util';

export const ACH_PREFERENCES_PERSISTENT_KEYS = ['completed', 'options'] as const;

export type SerializedAchievementsState = Omit<TeyvatMoeAchievementPreferencesLatest, 'notify'>;

export const buildAchievementsPreferencesForStorage = (
  state: AchievementsState
): SerializedAchievementsState => {
  const persistentState = _.pick(state, ACH_PREFERENCES_PERSISTENT_KEYS);
  return {
    ...persistentState,
    version: PREFERENCES_VERSION,
    timestamp: getUnixTimestamp(),
  };
};

export const serializeAchievementsState = (state: AchievementsState): string => {
  return JSON.stringify(buildAchievementsPreferencesForStorage(state));
};
