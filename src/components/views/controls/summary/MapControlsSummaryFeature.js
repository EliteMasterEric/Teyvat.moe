/**
 * Provides the view which displays the individual features
 * in the About > Summary tab of the map controls.
 */

import { Box, makeStyles, Typography, LinearProgress } from '@material-ui/core';
import clsx from 'clsx';
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';

import { MapFeatures } from '~/components/data/MapFeatures';
import { getFilterIconURL } from '~/components/data/MapFeaturesData';
import { localizeField } from '~/components/i18n/FeatureLocalization';
import { Image } from '~/components/interface/Image';
import MapControlSummaryFeatureMenu from '~/components/views/controls/summary/MapControlsSummaryFeatureMenu';

const ICON_BORDER_IMAGE = require('../../../../images/controls/filter_border.png').default;

const useStyles = makeStyles((_theme) => ({
  iconBorder: {
    position: 'absolute',
    top: -1,
    left: -37,
    width: 79,
    height: 79,
    /* This URL MUST start with a '/' to indicate it is an absolute URL. */
    background: ({ bgImage }) => `url(${bgImage}) no-repeat`,
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

const _MapControlSummaryFeature = ({ featureKey, completedCount, displayed }) => {
  const classes = useStyles({ bgImage: ICON_BORDER_IMAGE });

  if (!displayed) return null; // Feature is not displayed.
  if (completedCount === 0) return null; // No markers have been completed.

  const mapFeature = MapFeatures[featureKey];
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
      <MapControlSummaryFeatureMenu featureKey={featureKey} />
    </Box>
  );
};

const mapStateToProps = (state, { featureKey }) => {
  return {
    displayed: state.displayed.features[featureKey] || state.options.showHiddenFeatures,
    completedCount: _.filter(_.keys(state.completed.features), (key) => key.startsWith(featureKey))
      .length,
  };
};
const mapDispatchToProps = (_dispatch) => ({});
const MapControlSummaryFeature = connect(
  mapStateToProps,
  mapDispatchToProps
)(_MapControlSummaryFeature);

export default MapControlSummaryFeature;
