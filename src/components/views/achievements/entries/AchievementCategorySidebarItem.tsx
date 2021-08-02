import { Box, LinearProgress, makeStyles, Typography } from '@material-ui/core';
import clsx from 'clsx';
import React, { FunctionComponent, memo } from 'react';
import { NextImage } from 'src/components/interface/Image';

const ACHIEVEMENT_BAR_COLOR = '#CFBE99';
const ACHIEVEMENT_BAR_BG = '#646B80';

const useStyles = makeStyles((_theme) => ({
  sidebarItemRoot: {
    position: 'relative',
    cursor: 'pointer', // Indicate user can click.
    zIndex: 0,

    outline: '2px solid #3D4B5C',
    outlineOffset: -4,
    borderRadius: 0,

    margin: 2,
    marginRight: 2 + 4,
    padding: 8,
  },

  sidebarItemRootUnselected: {
    width: '96.5%',
    marginLeft: 2 + 5,
    backgroundColor: '#374653',
    color: '#EBE3D8',
  },
  sidebarItemRootSelected: {
    width: '98%',
    backgroundColor: '#EBE3D8',
    color: '#374653',
  },

  sidebarContents: {},
  sidebarRowTitle: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  sidebarRowProgress: {
    marginLeft: 32,
  },
  sidebarTitleText: {
    marginLeft: 8,
    fontSize: 20,
    fontFamily: 'Teyvat',
  },

  progressBox: {
    width: '100%',
  },
  progressText: {
    color: ACHIEVEMENT_BAR_COLOR,
    fontFamily: 'Teyvat', // Cool.

    marginBottom: 2,
  },
  progressBar: {
    marginTop: 'auto',
    height: 6,
    borderRadius: 4,
  },
  progressBarRoot: {
    backgroundColor: ACHIEVEMENT_BAR_BG,
  },
  progressBarPrimary: {
    backgroundColor: ACHIEVEMENT_BAR_COLOR,
  },
}));

/**
 * The props passed to AchievementProgressBar.
 */
type AchievementSidebarItemProgressBarProps = {
  /**
   * The current number of achievements completed in this category.
   */
  current: number;
  /**
   * The total number of achievements in this category.
   */
  total: number;
};

/**
 * Displays a stylized progress bar with a percentage and numerical values.
 * This component is memoized; the rendered output will only change if the props change.
 */
const AchievementSidebarItemProgressBar: FunctionComponent<AchievementSidebarItemProgressBarProps> =
  memo(({ current, total }) => {
    const classes = useStyles();

    // The percentage value.
    const value = Math.floor((current / total) * 100);

    return (
      <Box className={classes.progressBox} display="flex" alignItems="center" flexDirection="row">
        <Box width="20%" textAlign="center">
          <Typography
            variant="body2"
            className={classes.progressText}
          >{`${value}% (${current}/${total})`}</Typography>
        </Box>
        <Box width="40%">
          <LinearProgress
            className={classes.progressBar}
            variant="determinate"
            value={value}
            classes={{ root: classes.progressBarRoot, barColorPrimary: classes.progressBarPrimary }}
          />
        </Box>
      </Box>
    );
  });

/**
 * The props passed to AchievementCategoryCard.
 */
type AchievementCategorySidebarItemProps = {
  /**
   * The title of the category. Should already be localized before it's passed.
   */
  title: string;
  /**
   * The file name for the icon used for this category.
   */
  icon: string;
  /**
   * The current number of achievements completed in this category.
   */
  current: number;
  /**
   * The total number of achievements in this category.
   */
  total: number;

  /**
   * Called when the card is clicked.
   */
  onClick?: React.MouseEventHandler<HTMLDivElement>;

  /**
   * Is this the currently selected category?
   */
  selected: boolean;
};

/**
 * Renders an Achievement Category card, similar to the one seen in game.
 */
const AchievementCategorySidebarItem: FunctionComponent<AchievementCategorySidebarItemProps> = memo(
  ({ title, icon, current, total, onClick, selected }) => {
    const classes = useStyles();

    return (
      <div
        className={clsx(
          classes.sidebarItemRoot,
          selected ? classes.sidebarItemRootSelected : classes.sidebarItemRootUnselected
        )}
        onClick={onClick}
      >
        <div className={classes.sidebarContents}>
          <div className={classes.sidebarRowTitle}>
            <NextImage
              src={`/images/achievements/categories/thumb/${icon}.png`}
              width={32}
              height={32}
            />
            <Typography className={classes.sidebarTitleText}>{title}</Typography>
          </div>
          <div className={classes.sidebarRowProgress}>
            <AchievementSidebarItemProgressBar current={current} total={total} />
          </div>
        </div>
      </div>
    );
  }
);

export default AchievementCategorySidebarItem;
