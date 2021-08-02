import { makeStyles } from '@material-ui/core';
import _ from 'lodash';
import React, { FunctionComponent, memo } from 'react';
import {
  AchievementCategoryId,
  AchievementCategoryIds,
  getAchievementCategory,
} from 'src/components/data/achievements/AchievementCategoryData';
import { localizeField } from 'src/components/i18n/map/FeatureLocalization';
import AchievementCategoryCard from 'src/components/views/achievements/category/AchievementCategoryCard';

const useStyles = makeStyles((_theme) => ({
  listRoot: {
    display: 'flex',
    width: '100%',
    height: '100%',
    overflowY: 'scroll',
    flexWrap: 'wrap',
  },
}));

type AchievementCategoryCardGridProps = {
  onClickCard?: (id: AchievementCategoryId) => void;
  onClickOptions?: () => void;
};

const AchievementCategoryCardGrid: FunctionComponent<AchievementCategoryCardGridProps> = memo(
  ({ onClickCard }) => {
    const classes = useStyles();

    return (
      <div className={classes.listRoot}>
        {_.map(AchievementCategoryIds, (categoryId) => {
          const category = getAchievementCategory(categoryId);
          if (category == null) return null;

          return (
            <AchievementCategoryCard
              key={category.id}
              title={localizeField(category.title)}
              icon={category.icon}
              current={1}
              total={category.childCount}
              onClick={() => {
                if (onClickCard) onClickCard(category.id);
              }}
            />
          );
        })}
      </div>
    );
  }
);

export default AchievementCategoryCardGrid;
