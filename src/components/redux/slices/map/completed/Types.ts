import { MSFMarkerKey } from 'src/components/data/map/Element';
import { GenshinMapPreferencesLatest } from 'src/components/preferences/map/PreferencesSchema';

export type CompletedState = GenshinMapPreferencesLatest['completed'];

export type MarkerCompletedActionPayload = {
  key: MSFMarkerKey;
  timestamp: number;
};
export type MarkersCompletedActionPayload = {
  keys: MSFMarkerKey[];
  timestamp: number;
};
