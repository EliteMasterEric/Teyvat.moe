import _ from 'lodash';
import initialState from './InitialState';
import { CompletedState } from './Types';
import { AchievementCategoryId } from 'src/components/data/achievements/AchievementCategoryData';
import { AchievementId, getAchievement } from 'src/components/data/achievements/AchievementData';
import { MSFFeatureKey } from 'src/components/data/map/Element';
import { getMapFeature } from 'src/components/data/map/MapFeatures';
import selectNamespace from 'src/components/redux/slices/achievements/Selector';
import { AchievementsState } from 'src/components/redux/slices/achievements/Types';
import { AppState } from 'src/components/redux/Types';
import { getPreviousMondayReset, getRecord, getUnixTimestamp } from 'src/components/util';

export const selectAchievementCompleted = (
  state: AppState,
  achievementKey: AchievementId
): number | null => {
  return getRecord(selectCompletedAchievements(state), achievementKey);
};

export const selectCompletedAchievements = (state: AppState): CompletedState['achievements'] =>
  selectSlice(selectNamespace(state))?.achievements;

export const selectCompletedMarkersOfCategory = (
  state: AppState,
  categoryKey: AchievementCategoryId
): CompletedState['achievements'] => {
  return _.pickBy(
    selectCompletedAchievements(state),
    (_value, key: AchievementId) => getAchievement(key).category == categoryKey
  );
};

export const selectExpiredMarkers = (state: AppState): CompletedState['achievements'] => {
  const currentTime = getUnixTimestamp();
  return _.pickBy(
    selectCompletedAchievements(state),
    (completedTime: number, markerKey: string) => {
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
    }
  );
};

const selectSlice = (state: AchievementsState | null): CompletedState => {
  return state?.completed ?? initialState;
};
export default selectSlice;
