import { createAction, PrepareAction } from '@reduxjs/toolkit';
import { REDUX_SLICE_COMPLETED } from './Matcher';
import { AchievementCompletedActionPayload, AchievementsCompletedActionPayload } from './Types';
import { AchievementCategoryId } from 'src/components/data/achievements/AchievementCategoryData';
import { AchievementId } from 'src/components/data/achievements/AchievementData';
import { getUnixTimestamp } from 'src/components/util';

/*
 * When performing additional logic to customize the creation of the action payload,
 * use a prepare callback.
 */
const prepareSetAchievementCompleted: PrepareAction<AchievementCompletedActionPayload> = (
  key: AchievementId
) => {
  return { payload: { key, timestamp: getUnixTimestamp() } };
};
const prepareSetAchievementsCompleted: PrepareAction<AchievementsCompletedActionPayload> = (
  keys: AchievementId[]
) => {
  return { payload: { keys, timestamp: getUnixTimestamp() } };
};

/*
 * Create the set of actions.
 * Action names are of the format `teyvatmoe/<namespace>/<slice>/<action>`
 * Set the action type with type generics. Take multiple arguments using a prepare function.
 */
export const setAchievementCompleted = createAction(
  `${REDUX_SLICE_COMPLETED}/setAchievementCompleted`,
  prepareSetAchievementCompleted
);
export const setAchievementsCompleted = createAction(
  `${REDUX_SLICE_COMPLETED}/setAchievementsCompleted`,
  prepareSetAchievementsCompleted
);
export const clearAchievementCompleted = createAction<AchievementId>(
  `${REDUX_SLICE_COMPLETED}/clearMarkerCompleted`
);
export const clearAchievementsCompleted = createAction<AchievementId[]>(
  `${REDUX_SLICE_COMPLETED}/clearMarkersCompleted`
);
export const clearAchievementCategoryCompleted = createAction<AchievementCategoryId>(
  `${REDUX_SLICE_COMPLETED}/clearFeatureCompleted`
);

export type CompletedAction =
  | ReturnType<typeof setAchievementCompleted>
  | ReturnType<typeof setAchievementsCompleted>
  | ReturnType<typeof clearAchievementCompleted>
  | ReturnType<typeof clearAchievementsCompleted>
  | ReturnType<typeof clearAchievementCategoryCompleted>;
