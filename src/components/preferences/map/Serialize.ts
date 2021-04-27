import _ from 'lodash';
import { GenshinMapPreferencesLatest, PREFERENCES_VERSION } from './PreferencesSchema';
import { MapState } from 'src/components/redux/slices/map/Types';

export const MAP_PREFERENCES_PERSISTENT_KEYS = [
  'completed',
  'displayed',
  'editor',
  'options',
] as const;

export const buildMapPreferencesForStorage = (state: MapState): GenshinMapPreferencesLatest => {
  const persistentState = _.pick(state, MAP_PREFERENCES_PERSISTENT_KEYS);
  return {
    ...persistentState,
    version: PREFERENCES_VERSION,
    // TODO: Add current unix timestamp here.
  };
};

export const serializeMapState = (state: MapState): string => {
  return JSON.stringify(buildMapPreferencesForStorage(state));
};
