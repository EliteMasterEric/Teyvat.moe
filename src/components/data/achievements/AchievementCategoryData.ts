import _ from 'lodash';
import { A } from 'ts-toolbelt';
import { getAchievementsByCategory } from 'src/components/data/achievements/AchievementData';
import { getRecord } from 'src/components/util';
import AchievementCategoryRawData from 'src/data/achievements/achievement-categories.json';

export type AchievementCategoryId = A.Type<string, 'AchievementCategoryId'>;

export type AchievementCategory = {
  id: AchievementCategoryId;
  order: number;
  title: { [key: string]: string };
  icon: string;
  childCount: number;
};

const AchievementCategoryMappedRawData = _.map(
  AchievementCategoryRawData,
  (item): [AchievementCategoryId, AchievementCategory] => {
    const categoryId = item.id.toString() as AchievementCategoryId;
    const children = getAchievementsByCategory(categoryId);

    return [
      categoryId,
      {
        ...item,
        id: categoryId,
        childCount: children.length,
      } as AchievementCategory,
    ];
  }
);

const AchievementCategories: Record<AchievementCategoryId, AchievementCategory> = _.fromPairs(
  AchievementCategoryMappedRawData
);
export const getAchievementCategory = (
  key: null | AchievementCategoryId
): AchievementCategory | null => {
  if (key == null) return null;

  const result = getRecord(AchievementCategories, key) ?? null;
  if (result == null) {
    console.warn(`Invalid achievement category key ${key}`);
  }
  return result;
};

const getAchievementCategoryOrder = (key: AchievementCategoryId): number => {
  return getAchievementCategory(key)?.order ?? 0;
};

export const AchievementCategoryIds = _.sortBy(
  _.keys(AchievementCategories),
  getAchievementCategoryOrder
) as AchievementCategoryId[];
export const isAchievementCategoryId = (value: string): value is AchievementCategoryId =>
  value in AchievementCategories;
