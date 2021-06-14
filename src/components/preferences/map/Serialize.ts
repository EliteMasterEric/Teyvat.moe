import _ from 'lodash';
import { GenshinMapPreferencesLatest, PREFERENCES_VERSION } from './PreferencesSchema';
import { MapState } from 'src/components/redux/slices/map/Types';
import { getUnixTimestamp } from 'src/components/util';

export const MAP_PREFERENCES_PERSISTENT_KEYS = [
  'completed',
  'displayed',
  'editor',
  'options',
] as const;

export type SerializedMapState = Omit<GenshinMapPreferencesLatest, 'notify'>;

export const buildMapPreferencesForStorage = (state: MapState): SerializedMapState => {
  const persistentState = _.pick(state, MAP_PREFERENCES_PERSISTENT_KEYS);
  return {
    ...persistentState,
    version: PREFERENCES_VERSION,
    timestamp: getUnixTimestamp(),
  };
};

export const serializeMapState = (state: MapState): string => {
  return JSON.stringify(buildMapPreferencesForStorage(state));
};
