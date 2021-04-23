import _ from 'lodash';
import { GenshinMapPreferencesLatest, PREFERENCES_VERSION } from './PreferencesSchema';
import { PREFERENCES_PERSISTENT_KEYS } from 'src/components/redux';
import { AppState } from 'src/components/redux/Types';

export const buildPreferencesForStorage = (state: AppState): GenshinMapPreferencesLatest => {
  const persistentState = _.pick(state, PREFERENCES_PERSISTENT_KEYS);
  return {
    ...persistentState,
    version: PREFERENCES_VERSION,
    // TODO: Add current unix timestamp here.
  };
};

export const serializeAppState = (state: AppState): string => {
  return JSON.stringify(buildPreferencesForStorage(state));
};
