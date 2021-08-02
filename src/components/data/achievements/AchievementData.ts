import _ from 'lodash';
import { A } from 'ts-toolbelt';

import { AchievementCategoryId } from 'src/components/data/achievements/AchievementCategoryData';
import { getRecord } from 'src/components/util';
import AchievementRawData from 'src/data/achievements/achievements.json';

export type Achievement = {
  id: number;
  category: string;
  order: number;
  reward: number;
  title: { [key: string]: string };
  content: { [key: string]: string };
};

export type AchievementId = A.Type<string, 'AchievementId'>;

const AchievementMappedRawData = _.map(AchievementRawData, (item): [AchievementId, Achievement] => [
  item.id.toString() as AchievementId,
  {
    ...item,
    category: (item?.category ?? 0).toString(),
  } as Achievement,
]);

const Achievements: Record<AchievementId, Achievement> = _.fromPairs(AchievementMappedRawData);
export const getAchievement = (key: AchievementId): Achievement => {
  const result = getRecord(Achievements, key) ?? null;
  if (result == null) throw new Error(`Invalid achievement key ${key}`);
  return result;
};

const getAchievementOrder = (key: AchievementId): number => {
  return getAchievement(key).order;
};

export const getAchievementsByCategory = (key: AchievementCategoryId): Achievement[] => {
  return _.filter<Achievement>(_.values(Achievements), (a) => a.category == key);
};

export const AchievementIds = _.sortBy(
  _.keys(Achievements),
  getAchievementOrder
) as AchievementId[];
export const isAchievementId = (value: string): value is AchievementId => value in Achievements;
