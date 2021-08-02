import { Box, LinearProgress, makeStyles, Typography } from '@material-ui/core';
import React, { FunctionComponent, memo } from 'react';
import { AchievementCategoryId } from 'src/components/data/achievements/AchievementCategoryData';
import { getNextImageUrl, NextImage } from 'src/components/interface/Image';

const CARD_IMAGE = getNextImageUrl('/images/ui/achieve-card.png', 200, 300);

const LEFT_MARGIN = 7; // The little bookmark thing makes things off-center.
const TITLE_CHAR_MARGIN = 24;

const ACHIEVEMENT_BAR_COLOR = '#CFBE99';
const ACHIEVEMENT_BAR_BG = '#646B80';

const useStyles = makeStyles((_theme) => ({
  cardRoot: {
    position: 'relative',
    cursor: 'pointer', // Indicate user can click.
    width: 200,
    height: 300,
    zIndex: 0,
  },
  cardBgImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10,
  },
  cardContents: {
    width: 200 - LEFT_MARGIN,
    height: 250,
    position: 'absolute',
    top: 0,
    left: LEFT_MARGIN,
    zIndex: 100,
  },
  cardIconImage: {
    marginTop: 24,
    width: 150,
    height: 150,
    margin: 'auto',
  },
  cardTitle: {
    width: '80%',
    margin: '-8px auto 0 auto',
    lineHeight: '105%',
    textAlign: 'center',
    position: 'relative',
    zIndex: 100,

    fontFamily: 'Teyvat', // Cool.
  },

  progressBox: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
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
type AchievementCardProgressBarProps = {
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
const AchievementCardProgressBar: FunctionComponent<AchievementCardProgressBarProps> = memo(
  ({ current, total }) => {
    const classes = useStyles();

    // The percentage value.
    const value = Math.floor((current / total) * 100);

    return (
      <Box
        className={classes.progressBox}
        display="flex"
        alignItems="center"
        flexDirection="column"
      >
        <Box textAlign="center">
          <Typography
            variant="body2"
            className={classes.progressText}
          >{`${value}% (${current}/${total})`}</Typography>
        </Box>
        <Box width="70%">
          <LinearProgress
            className={classes.progressBar}
            variant="determinate"
            value={value}
            classes={{ root: classes.progressBarRoot, barColorPrimary: classes.progressBarPrimary }}
          />
        </Box>
      </Box>
    );
  }
);

export type AchievementCategoryCardClickHandler = (
  event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  key: AchievementCategoryId
) => void;

/**
 * The props passed to AchievementCategoryCard.
 */
type AchievementCategoryCardProps = {
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
};

/**
 * Renders an Achievement Category card, similar to the one seen in game.
 */
const AchievementCategoryCard: FunctionComponent<AchievementCategoryCardProps> = memo(
  ({ title, icon, current, total, onClick }) => {
    const classes = useStyles();

    const titleSize = 20 - Math.floor(title.length / TITLE_CHAR_MARGIN) * 4;

    return (
      <div className={classes.cardRoot} onClick={onClick}>
        <div className={classes.cardBgImage}>
          <NextImage src="/images/achievements/ui/achieve-card.png" width={200} height={300} />
        </div>
        <div className={classes.cardContents}>
          <div className={classes.cardIconImage}>
            <NextImage
              src={`/images/achievements/categories/full/${icon}.png`}
              width={150}
              height={150}
            />
          </div>
          <Typography className={classes.cardTitle} style={{ fontSize: titleSize }}>
            {title}
          </Typography>
          <AchievementCardProgressBar current={current} total={total} />
        </div>
      </div>
    );
  }
);

export default AchievementCategoryCard;
