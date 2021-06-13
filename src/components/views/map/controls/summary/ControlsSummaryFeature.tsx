/**
 * Provides the view which displays the individual features
 * in the About > Summary tab of the map controls.
 */

import { Box, Typography, LinearProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import _ from 'lodash';
import React, { FunctionComponent } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { MSFFeatureKey } from 'src/components/data/map/Element';
import { getMapFeature } from 'src/components/data/map/MapFeatures';
import { localizeField } from 'src/components/i18n/map/FeatureLocalization';
import { getNextImageUrl, NextImage } from 'src/components/interface/Image';
import { selectCompletedMarkersOfFeature } from 'src/components/redux/slices/map/completed/Selector';
import { selectIsFeatureDisplayed } from 'src/components/redux/slices/map/displayed/Selector';
import { selectShowHiddenFeaturesInSummary } from 'src/components/redux/slices/map/options/Selector';
import { AppState } from 'src/components/redux/Types';
import { Empty } from 'src/components/Types';
import ControlsSummaryFeatureMenu from 'src/components/views/map/controls/summary/ControlsSummaryFeatureMenu';

interface StyleProps {
  bgImage: string;
}
const useStyles = makeStyles((_theme) => ({
  iconBorder: {
    position: 'absolute',
    top: -1,
    left: -37,
    width: 80,
    height: 80,
    /* This URL MUST start with a '/' to indicate it is an absolute URL. */
    background: ({ bgImage }: StyleProps) => `url(${bgImage}) no-repeat`,
    backgroundSize: '100% 100%',
  },
  icon: {
    position: 'absolute',
    top: '2px !important',
    left: '2px !important',
  },
  label: {
    textAlign: 'center',
    fontSize: 14,
  },
  featureRoot: {
    // Position relative so the frame image can be positioned absolutely.
    position: 'relative',
    // Make space for the image.
    margin: '0 0 10px 37px',
    width: 'calc(100% - 43px)',
    height: 74,
    // Prevent the box getting squished.
    flexShrink: 0,

    border: '1px solid #d2c6bb',
    color: '#78583d',

    background: 'linear-gradient(270deg, #ffffff -95.11%, rgba(255, 255, 255, 0) 100%), #f0e9e2',

    // Align the text.
    padding: '0 8px 0 48px',

    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',

    fontSize: 18,
    boxSizing: 'border-box',
  },

  progressRoot: {
    height: 12,
    borderRadius: 6,
  },
  progressBar: {
    borderRadius: 6,
  },
}));

interface ControlsSummaryFeatureBaseProps {
  featureKey: MSFFeatureKey;
}

const mapStateToProps = (state: AppState, { featureKey }: ControlsSummaryFeatureBaseProps) => {
  return {
    displayed:
      selectIsFeatureDisplayed(state, featureKey) || selectShowHiddenFeaturesInSummary(state),
    completedCount: _.keys(selectCompletedMarkersOfFeature(state, featureKey)).length,
  };
};
type ControlsSummaryFeatureStateProps = ReturnType<typeof mapStateToProps>;
const connector = connect<
  ControlsSummaryFeatureStateProps,
  Empty,
  ControlsSummaryFeatureBaseProps,
  AppState
>(mapStateToProps);

type ControlsSummaryFeatureProps = ConnectedProps<typeof connector> &
  ControlsSummaryFeatureBaseProps;

const _ControlsSummaryFeature: FunctionComponent<ControlsSummaryFeatureProps> = ({
  featureKey,
  completedCount,
  displayed,
}) => {
  const classes = useStyles({
    bgImage: getNextImageUrl('/images/controls/filter_border.png', 80, 80),
  });

  if (!displayed) return null; // Feature is not displayed.
  if (completedCount === 0) return null; // No markers have been completed.

  const mapFeature = getMapFeature(featureKey);
  if (!mapFeature) return null; // Feature is not valid (CHECK THE CONSOLE).

  // Total number of markers for this feature. Contrast with completedCount.
  const totalCount = _.keys(mapFeature.data).length;

  return (
    <Box className={clsx(classes.featureRoot)}>
      <Box className={classes.iconBorder}>
        <div className={classes.icon}>
          <NextImage
            src={`/images/icons/filter/${mapFeature.icons.filter}.png`}
            width={70}
            height={70}
          />
        </div>
      </Box>
      <Box flexDirection="column" display="flex" flexGrow={1} marginRight={2}>
        <Typography className={classes.label}>{localizeField(mapFeature.name)}</Typography>
        <LinearProgress
          classes={{
            root: classes.progressRoot,
            bar: classes.progressBar,
          }}
          variant="determinate"
          value={(completedCount / totalCount) * 100}
        />
        <Typography className={classes.label}>
          {completedCount} / {totalCount}
        </Typography>
      </Box>
      <ControlsSummaryFeatureMenu featureKey={featureKey} />
    </Box>
  );
};

const ControlsSummaryFeature = connector(_ControlsSummaryFeature);

export default ControlsSummaryFeature;
