/**
 * Provides the view which displays the individual features
 * in the About > Summary tab of the map controls.
 */

import { Box, makeStyles, Typography, LinearProgress } from '@material-ui/core';
import clsx from 'clsx';
import _ from 'lodash';
import React, { FunctionComponent } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { MSFFeatureKey } from 'src/components/data/ElementSchema';
import { getFilterIconURL } from 'src/components/data/FeatureIcon';
import { getMapFeature } from 'src/components/data/MapFeatures';
import { localizeField } from 'src/components/i18n/FeatureLocalization';
import { Image } from 'src/components/interface/Image';
import { selectCompletedMarkersOfFeature } from 'src/components/redux/slices/completed';
import { selectIsFeatureDisplayed } from 'src/components/redux/slices/displayed';
import { selectShowHiddenFeaturesInSummary } from 'src/components/redux/slices/options';
import { AppState } from 'src/components/redux/types';
import ControlsSummaryFeatureMenu from 'src/components/views/controls/summary/ControlsSummaryFeatureMenu';

const ICON_BORDER_IMAGE = require('../../../../images/controls/filter_border.png').default;

interface StyleProps {
  bgImage: string;
}
const useStyles = makeStyles((_theme) => ({
  iconBorder: {
    position: 'absolute',
    top: -1,
    left: -37,
    width: 79,
    height: 79,
    /* This URL MUST start with a '/' to indicate it is an absolute URL. */
    background: ({ bgImage }: StyleProps) => `url(${bgImage}) no-repeat`,
    backgroundSize: '100% 100%',
  },
  icon: {
    position: 'absolute',
    width: 70,
    height: 70,
    top: 2,
    left: 2,
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
const mapDispatchToProps = () => ({});
type ControlsSummaryFeatureStateProps = ReturnType<typeof mapStateToProps>;
type ControlsSummaryFeatureDispatchProps = ReturnType<typeof mapDispatchToProps>;
const connector = connect<
  ControlsSummaryFeatureStateProps,
  ControlsSummaryFeatureDispatchProps,
  ControlsSummaryFeatureBaseProps,
  AppState
>(mapStateToProps, mapDispatchToProps);

type ControlsSummaryFeatureProps = ConnectedProps<typeof connector> &
  ControlsSummaryFeatureBaseProps;

const _ControlsSummaryFeature: FunctionComponent<ControlsSummaryFeatureProps> = ({
  featureKey,
  completedCount,
  displayed,
}) => {
  const classes = useStyles({ bgImage: ICON_BORDER_IMAGE });

  if (!displayed) return null; // Feature is not displayed.
  if (completedCount === 0) return null; // No markers have been completed.

  const mapFeature = getMapFeature(featureKey);
  if (!mapFeature) return null; // Feature is not valid (CHECK THE CONSOLE).

  // Total number of markers for this feature. Contrast with completedCount.
  const totalCount = Object.keys(mapFeature.data).length;

  return (
    <Box className={clsx(classes.featureRoot)}>
      <Box className={classes.iconBorder}>
        <Image
          className={classes.icon}
          srcPNG={getFilterIconURL(mapFeature.icons.filter, 'png')}
          srcWebP={getFilterIconURL(mapFeature.icons.filter, 'webp')}
        />
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
