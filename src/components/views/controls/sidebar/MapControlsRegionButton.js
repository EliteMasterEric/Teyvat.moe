/**
 * Provides the region buttons which swap the current region
 * of the Features and Routes tabs, on the side of the Map controls.
 */

import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';

import { makeStyles, Box, Tooltip } from '@material-ui/core';
import MapRegions from '~/components/data/MapRegions';
import { t } from '~/components/i18n/Localization';
import { setControlsRegion } from '~/redux/ducks/ui';
import { VectorImage } from '~/components/interface/Image';
import { importFromContext } from '~/components/Util';

const controlsContext = require.context('../../../../images/controls', true);

const useStyles = makeStyles((_theme) => ({
  banner: {
    margin: '0 8px',

    height: 48,
    width: 48,
    boxShadow: '0 1px 5px rgba(0,0,0,0.65)',
    borderRadius: 8,

    display: 'flex',
    cursor: 'pointer',

    '-webkit-transition': 'all 0s, margin-left 0.3s',
    '-moz-transition': 'all 0s, margin-left 0.3s',
    '-o-transition': 'all 0s, margin-left 0.3s',
    transition: 'all 0s, margin-left 0.3s',
  },
  bannerImage: {
    width: 36,
    height: 36,
    margin: 'auto',
  },
  bannerImageInactive: {
    color: '#FFF',
    filter: 'invert(1)',
  },
  bannerImageActive: {
    color: '#000',
  },
}));

const _MapControlsRegionButton = ({ regionKey, active, enableRegion }) => {
  const classes = useStyles();

  const region = MapRegions[regionKey];

  const svgSrc = importFromContext(controlsContext, `./region-${regionKey}.svg`);
  const style = {
    backgroundColor: active ? '#fff' : region.color,
    border: active ? `4px solid ${region.color}` : '0px solid transparent',
  };

  return (
    <Tooltip title={t(region.nameKey)}>
      <Box
        className={clsx(classes.banner)}
        style={style}
        onClick={enableRegion}
        alignItems="center"
      >
        <VectorImage
          srcSVG={svgSrc}
          className={clsx(
            classes.bannerImage,
            active ? classes.bannerImageActive : classes.bannerImageInactive
          )}
        />
      </Box>
    </Tooltip>
  );
};

const mapStateToProps = (state, { regionKey }) => ({
  active: state.controlsRegion === regionKey,
});
const mapDispatchToProps = (dispatch, { regionKey }) => ({
  enableRegion: () => dispatch(setControlsRegion(regionKey)),
});
const MapControlsRegionButton = connect(
  mapStateToProps,
  mapDispatchToProps
)(_MapControlsRegionButton);

export default MapControlsRegionButton;
