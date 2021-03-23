/**
 * Provides the region buttons which swap the current region
 * of the Features and Routes tabs, on the side of the Map controls.
 */

import { makeStyles, Box, Tooltip } from '@material-ui/core';
import clsx from 'clsx';
import React, { FunctionComponent } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { MapRegionKey, getMapRegion } from 'src/components/data/MapRegions';
import { t } from 'src/components/i18n/Localization';
import { VectorImage } from 'src/components/interface/Image';
import { AppDispatch } from 'src/components/redux';
import { selectIsRegionDisplayed, setMapRegion } from 'src/components/redux/slices/ui';
import { AppState } from 'src/components/redux/types';
import { importFromContext } from 'src/components/util';

const controlsContext = require.context('../../../../images/controls', true);

const useStyles = makeStyles((_theme) => ({
  banner: {
    margin: '0 0 12px 64px',

    height: 48,
    width: 120,
    boxShadow: '0 1px 5px rgba(0,0,0,0.65)',
    borderRadius: 8,

    display: 'flex',
    cursor: 'pointer',

    '-webkit-transition': 'all 0s, margin-left 0.3s',
    '-moz-transition': 'all 0s, margin-left 0.3s',
    '-o-transition': 'all 0s, margin-left 0.3s',
    transition: 'all 0s, margin-left 0.3s',
  },
  bannerActive: {
    marginLeft: 40,
  },
  bannerInactive: {
    marginLeft: 64,
  },
  bannerImage: {
    width: 36,
    height: 36,
    marginLeft: 8,
  },
  bannerImageInactive: {
    color: '#FFF',
    filter: 'invert(1)',
  },
  bannerImageActive: {
    color: '#000',
  },
}));

interface ControlsRegionBannerBaseProps {
  regionKey: MapRegionKey;
}

const mapStateToProps = (state: AppState, { regionKey }: ControlsRegionBannerBaseProps) => ({
  active: selectIsRegionDisplayed(state, regionKey),
});
const mapDispatchToProps = (
  dispatch: AppDispatch,
  { regionKey }: ControlsRegionBannerBaseProps
) => ({
  enableRegion: () => dispatch(setMapRegion(regionKey)),
});
type ControlsRegionBannerStateProps = ReturnType<typeof mapStateToProps>;
type ControlsRegionBannerDispatchProps = ReturnType<typeof mapDispatchToProps>;
const connector = connect<
  ControlsRegionBannerStateProps,
  ControlsRegionBannerDispatchProps,
  ControlsRegionBannerBaseProps,
  AppState
>(mapStateToProps, mapDispatchToProps);

type ControlsRegionBannerProps = ConnectedProps<typeof connector> & ControlsRegionBannerBaseProps;

const _ControlsRegionBanner: FunctionComponent<ControlsRegionBannerProps> = ({
  regionKey,
  active,
  enableRegion,
}) => {
  const classes = useStyles();

  const region = getMapRegion(regionKey);

  const svgSrc = importFromContext(controlsContext, `./region-${regionKey}.svg`);
  const style = {
    backgroundColor: active ? '#fff' : region.color,
    borderLeft: active ? `8px solid ${region.color}` : '0px solid transparent',
  };

  return (
    <Tooltip title={t(region.nameKey)}>
      <Box
        className={clsx(classes.banner, active ? classes.bannerActive : classes.bannerInactive)}
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

const ControlsRegionBanner = connector(_ControlsRegionBanner);

export default ControlsRegionBanner;
