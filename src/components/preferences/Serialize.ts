import _ from 'lodash';
import { PREFERENCES_PERSISTENT_KEYS } from '../redux';
import { AppState } from '../redux/types';
import { PREFERENCES_VERSION } from './PreferencesSchema';

export const buildPreferencesForStorage = (state: AppState) => {
  return {
    ..._.pick(state, PREFERENCES_PERSISTENT_KEYS),
    version: PREFERENCES_VERSION,
  };
};

export const serializeAppState = (state: AppState): string => {
  return JSON.stringify(buildPreferencesForStorage(state));
};
