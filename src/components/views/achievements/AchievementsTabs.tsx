import { Box, makeStyles } from '@material-ui/core';
import React, { FunctionComponent, memo } from 'react';
import AchievementHeader from './AchievementHeader';
import {
  AchievementCategoryId,
  getAchievementCategory,
} from 'src/components/data/achievements/AchievementCategoryData';
import { t } from 'src/components/i18n/Localization';
import { localizeField } from 'src/components/i18n/map/FeatureLocalization';
import AchievementCategoryCardGrid from 'src/components/views/achievements/category/AchievementCategoryCardGrid';
import AchievementCategorySidebar from 'src/components/views/achievements/entries/AchievementCategorySidebar';

const useStyles = makeStyles((_theme) => ({
  achievementBox: {
    backgroundColor: '#455a64',
    outline: '4px solid #CFBE99',
    outlineOffset: -8,
    borderRadius: 16,
    padding: 12,

    width: 1456, // Fits 7 columns.
    height: '72vh',
  },
}));

type AchievementsTabProps = {
  displayed: boolean;

  handleClickOptions?: () => void;
  handleClickBack?: () => void;
  handleClickCard?: (id: null | AchievementCategoryId) => void;
  selectedCategory?: null | AchievementCategoryId;
};

export const AchievementsTabCategories: FunctionComponent<AchievementsTabProps> = memo(
  ({ handleClickCard, handleClickOptions, displayed }) => {
    const classes = useStyles();
    return (
      <Box
        display={displayed ? 'flex' : 'none'}
        className={classes.achievementBox}
        flexDirection="column"
      >
        <AchievementHeader
          current={56}
          total={312}
          showBack={false}
          onClickOptions={handleClickOptions}
        />
        <AchievementCategoryCardGrid onClickCard={handleClickCard} />
      </Box>
    );
  }
);

export const AchievementsTabList: FunctionComponent<AchievementsTabProps> = memo(
  ({
    handleClickCard,
    handleClickBack,
    handleClickOptions,
    selectedCategory = null,
    displayed,
  }) => {
    const classes = useStyles();
    if (selectedCategory == null && displayed) {
      return <div>{t('achievements:error-no-category')}</div>;
    }

    return (
      <Box
        style={{ display: displayed ? 'flex' : 'none' }}
        className={classes.achievementBox}
        flexDirection="row"
      >
        <AchievementCategorySidebar
          selected={selectedCategory}
          onClickCard={handleClickCard}
          onClickBack={handleClickBack}
          onClickOptions={handleClickOptions}
        />
        <div>{localizeField(getAchievementCategory(selectedCategory)?.title)}</div>
      </Box>
    );
  }
);

export const AchievementsTabOptions: FunctionComponent<AchievementsTabProps> = memo(
  ({ displayed, handleClickBack }) => {
    const classes = useStyles();
    return (
      <Box
        style={{ display: displayed ? 'flex' : 'none' }}
        className={classes.achievementBox}
        flexDirection="column"
      >
        <AchievementHeader
          current={56}
          total={312}
          showOptions={false}
          onClickBack={handleClickBack}
        />
        Options
      </Box>
    );
  }
);
