import _ from 'lodash';
import initialState from './InitialState';
import { CompletedState } from './Types';
import { MSFFeatureKey, MSFMarkerKey } from 'src/components/data/map/Element';
import { getMapFeature } from 'src/components/data/map/MapFeatures';
import selectNamespace from 'src/components/redux/slices/map/Selector';
import { MapState } from 'src/components/redux/slices/map/Types';
import { AppState } from 'src/components/redux/Types';
import { getPreviousMondayReset, getRecord, getUnixTimestamp } from 'src/components/util';

export const selectMarkerCompleted = (state: AppState, markerKey: MSFMarkerKey): number | null => {
  return getRecord(selectCompletedMarkers(state), markerKey);
};

export const selectCompletedMarkers = (state: AppState): CompletedState['features'] =>
  selectSlice(selectNamespace(state))?.features;

export const selectCompletedMarkersOfFeature = (
  state: AppState,
  featureKey: MSFFeatureKey
): CompletedState['features'] => {
  return _.pickBy(selectCompletedMarkers(state), (_value, key) => _.startsWith(key, featureKey));
};

export const selectExpiredMarkers = (state: AppState): CompletedState['features'] => {
  const currentTime = getUnixTimestamp();
  return _.pickBy(selectCompletedMarkers(state), (completedTime: number, markerKey: string) => {
    const [featureKey, _markerID] = _.split(markerKey, '/');
    if (featureKey == null) return false;

    const feature = getMapFeature(featureKey as MSFFeatureKey);
    switch (feature.respawn) {
      case 'off':
        // Doesn't respawn, thus doesn't expire.
        return false;
      case 'boss':
        // Respawns every monday.
        const lastRespawn = getPreviousMondayReset().getTime() / 1000;
        return lastRespawn > completedTime;
      default:
        const respawnTimer = <number>feature.respawn;
        const respawnTimestamp = completedTime + respawnTimer;

        return respawnTimestamp > currentTime;
    }
  });
};

const selectSlice = (state: MapState | null): CompletedState => {
  return state?.completed ?? initialState;
};
export default selectSlice;
