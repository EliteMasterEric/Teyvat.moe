/**
 * Provides the region buttons which swap the current region
 * of the Features and Routes tabs.
 *
 * This button variant is used by the Mobile navigation view.
 */

import { Box, Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import React, { FunctionComponent } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { MapRegionKey, getMapRegion } from 'src/components/data/map/MapRegions';
import { localizeField } from 'src/components/i18n/map/FeatureLocalization';
import { AppDispatch } from 'src/components/redux';
import { setMapRegion } from 'src/components/redux/slices/map/interface/Actions';
import { selectIsRegionDisplayed } from 'src/components/redux/slices/map/interface/Selector';
import { AppState } from 'src/components/redux/Types';

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

interface ControlsRegionButtonBaseProps {
  regionKey: MapRegionKey;
}
const mapStateToProps = (state: AppState, { regionKey }: ControlsRegionButtonBaseProps) => ({
  active: selectIsRegionDisplayed(state, regionKey),
});
const mapDispatchToProps = (
  dispatch: AppDispatch,
  { regionKey }: ControlsRegionButtonBaseProps
) => ({
  enableRegion: () => dispatch(setMapRegion(regionKey)),
});
type ControlsRegionButtonStateProps = ReturnType<typeof mapStateToProps>;
type ControlsRegionButtonDispatchProps = ReturnType<typeof mapDispatchToProps>;
const connector = connect<
  ControlsRegionButtonStateProps,
  ControlsRegionButtonDispatchProps,
  ControlsRegionButtonBaseProps,
  AppState
>(mapStateToProps, mapDispatchToProps);

type ControlsRegionButtonProps = ConnectedProps<typeof connector> & ControlsRegionButtonBaseProps;

const _ControlsRegionButton: FunctionComponent<ControlsRegionButtonProps> = ({
  regionKey,
  active,
  enableRegion,
}) => {
  const classes = useStyles();

  const region = getMapRegion(regionKey);

  const svgSource = `/images/controls/region-${regionKey}.svg`;
  const style = {
    backgroundColor: active ? '#fff' : region.color,
    border: active ? `4px solid ${region.color}` : '0px solid transparent',
  };

  return (
    <Tooltip title={localizeField(region.name)}>
      <Box
        className={clsx(classes.banner)}
        style={style}
        onClick={enableRegion}
        alignItems="center"
      >
        <img
          src={svgSource}
          className={clsx(
            classes.bannerImage,
            active ? classes.bannerImageActive : classes.bannerImageInactive
          )}
        />
      </Box>
    </Tooltip>
  );
};

const ControlsRegionButton = connector(_ControlsRegionButton);

export default ControlsRegionButton;
