import { Box, LinearProgress, makeStyles, Typography } from '@material-ui/core';
import _ from 'lodash';
import React, { FunctionComponent, memo } from 'react';
import { NextImage } from 'src/components/interface/Image';

const ACHIEVEMENT_BAR_COLOR = '#CFBE99';
const ACHIEVEMENT_BAR_BG = '#646B80';

const useStyles = makeStyles((_theme) => ({
  backButton: {
    cursor: 'pointer',
    marginRight: 'auto',
  },
  optionsButton: {
    cursor: 'pointer',
    marginLeft: 'auto',
  },
  headerBox: {
    width: '100%',
    padding: 4,
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
type AchievementHeaderProps = {
  /**
   * The current number of achievements completed in this category.
   */
  current: number;
  /**
   * The total number of achievements in this category.
   */
  total: number;
  /**
   * Function to call when the Back button is clicked.
   */
  onClickBack?: () => void;
  /**
   * Function to call when the Options button is clicked.
   */
  onClickOptions?: () => void;
  /**
   * Whether to show the back button. Defaults to true.
   */
  showBack?: boolean;
  /**
   * Whether to show the options button. Defaults to true.
   */
  showOptions?: boolean;
};

/**
 * Displays a stylized progress bar with a percentage and numerical values.
 * This component is memoized; the rendered output will only change if the props change.
 */
const AchievementHeader: FunctionComponent<AchievementHeaderProps> = memo(
  ({ current, total, showBack = true, showOptions = true, onClickBack, onClickOptions }) => {
    const classes = useStyles();

    // The percentage value.
    const value = Math.floor((current / total) * 100);

    return (
      <Box className={classes.headerBox} display="flex" alignItems="center" flexDirection="row">
        <Box marginRight="auto">
          {showBack ? (
            <NextImage
              src="/images/achievements/ui/circle-button-back.png"
              width={48}
              height={48}
              className={classes.backButton}
              onClick={onClickBack}
            />
          ) : // Empty div to correct spacing.
          null}
        </Box>

        <Box width="60%" textAlign="center" display="flex" flexDirection="row" alignItems="center">
          <Box textAlign="center" marginRight={2}>
            <Typography
              variant="body2"
              className={classes.progressText}
            >{`${value}% (${current}/${total})`}</Typography>
          </Box>

          <Box flexGrow="1">
            <LinearProgress
              className={classes.progressBar}
              variant="determinate"
              value={value}
              classes={{
                root: classes.progressBarRoot,
                barColorPrimary: classes.progressBarPrimary,
              }}
            />
          </Box>
        </Box>

        <Box marginLeft="auto">
          {showOptions ? (
            <NextImage
              src="/images/achievements/ui/circle-button-options.png"
              width={48}
              height={48}
              className={classes.optionsButton}
              onClick={onClickOptions}
            />
          ) : null}
        </Box>
      </Box>
    );
  }
);

export default AchievementHeader;
