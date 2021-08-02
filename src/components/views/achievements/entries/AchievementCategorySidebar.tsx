import { makeStyles } from '@material-ui/core';
import _ from 'lodash';
import React, { FunctionComponent, memo, useCallback } from 'react';
import AchievementCategorySidebarItem from './AchievementCategorySidebarItem';
import {
  AchievementCategoryId,
  AchievementCategoryIds,
  getAchievementCategory,
} from 'src/components/data/achievements/AchievementCategoryData';
import { localizeField } from 'src/components/i18n/map/FeatureLocalization';
import AchievementHeader from 'src/components/views/achievements/AchievementHeader';

const useStyles = makeStyles((_theme) => ({
  listRoot: {
    display: 'flex',
    maxHeight: '35vw',
    overflowY: 'scroll',
    flexWrap: 'nowrap',
    width: '35%',
    flexDirection: 'column',
  },
}));

type AchievementCategorySidebarProps = {
  selected: null | AchievementCategoryId;
  onClickCard?: (id: null | AchievementCategoryId) => void;
  onClickBack?: () => void;
  onClickOptions?: () => void;
};

const AchievementCategorySidebar: FunctionComponent<AchievementCategorySidebarProps> = memo(
  ({ selected, onClickCard, onClickOptions }) => {
    const classes = useStyles();

    const onClickBack = useCallback(() => {
      if (onClickCard) onClickCard(null);
    }, [onClickCard]);

    return (
      <div className={classes.listRoot}>
        <AchievementHeader
          current={56}
          total={312}
          onClickBack={onClickBack}
          onClickOptions={onClickOptions}
        />
        {_.map(AchievementCategoryIds, (categoryId) => {
          const category = getAchievementCategory(categoryId);
          if (category == null) return null;

          const clickHandler = () => {
            if (onClickCard) onClickCard(category.id);
          };

          return (
            <AchievementCategorySidebarItem
              key={category.id}
              title={localizeField(category.title)}
              icon={category.icon}
              current={1}
              onClick={clickHandler}
              total={category.childCount}
              selected={category.id == selected}
            />
          );
        })}
      </div>
    );
  }
);

export default AchievementCategorySidebar;
