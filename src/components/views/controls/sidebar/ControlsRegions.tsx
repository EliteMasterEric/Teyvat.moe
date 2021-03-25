/**
 * Provides the container for the region buttons, on the side of the Map controls.
 */

import { Box, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import _ from 'lodash';
import React, { FunctionComponent } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { getMapRegion, MapRegionKeys } from 'src/components/data/MapRegions';
import { selectIsTabDisplayed, selectOpen } from 'src/components/redux/slices/ui';
import { AppState } from 'src/components/redux/types';
import ControlsRegionBanner from 'src/components/views/controls/sidebar/ControlsRegionBanner';

const useStyles = makeStyles((theme) => ({
  main: {
    position: 'fixed',
    top: 192,
    right: 0,

    zIndex: -100,

    [theme.breakpoints.down('xs')]: {
      width: '100vw',
      margin: 0,
      height: '100vh',
      minHeight: 'auto',
      maxHeight: 'auto',
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      height: '100vh',
      minHeight: 'auto',
      maxHeight: 'auto',
    },
    [theme.breakpoints.up('sm')]: {
      right: 'calc(60vw - 64px)',
    },
    [theme.breakpoints.up('md')]: {
      right: 'calc(40vw - 64px)',
    },
    [theme.breakpoints.up('lg')]: {
      right: 'calc(30vw - 64px)',
    },
    [theme.breakpoints.up('xl')]: {
      right: 'calc(20vw - 64px)',
    },
  },
  show: {
    /* Set the speed of this animation. */
    '-webkit-transition': '0.5s',
    '-moz-transition': '0.5s',
    '-o-transition': '0.5s',
    transition: '0.5s',

    opacity: 1,
  },
  hide: {
    /* Set the speed of this animation. */
    '-webkit-transition': '0.5s',
    '-moz-transition': '0.5s',
    '-o-transition': '0.5s',
    transition: '0.5s',

    opacity: 0,
    /*
     * Can't use display: none since that disables the animations.
     * So we make clicks pass through.
     */
    pointerEvents: 'none',
  },
  closed: {
    right: '-40px !important',
  },
}));

interface ControlsRegionsBaseProps {
  shouldDisplay?: boolean;
}

const mapStateToProps = (state: AppState, { shouldDisplay = true }: ControlsRegionsBaseProps) => ({
  displayed:
    selectOpen(state) && selectIsTabDisplayed(state, ['features', 'routes']) && shouldDisplay,
  open: selectOpen(state),
});
const mapDispatchToProps = () => ({});
type ControlsRegionsStateProps = ReturnType<typeof mapStateToProps>;
type ControlsRegionsDispatchProps = ReturnType<typeof mapDispatchToProps>;
const connector = connect<
  ControlsRegionsStateProps,
  ControlsRegionsDispatchProps,
  ControlsRegionsBaseProps,
  AppState
>(mapStateToProps, mapDispatchToProps);

type ControlsRegionsProps = ConnectedProps<typeof connector> & ControlsRegionsBaseProps;

const _ControlsRegions: FunctionComponent<ControlsRegionsProps> = ({ displayed, open }) => {
  const classes = useStyles();

  return (
    <Box
      className={clsx(
        classes.main,
        displayed ? classes.show : classes.hide,
        open ? null : classes.closed
      )}
    >
      {MapRegionKeys.map((key) =>
        getMapRegion(key).enabled ? <ControlsRegionBanner key={key} regionKey={key} /> : null
      )}
    </Box>
  );
};

const ControlsRegions = connector(_ControlsRegions);

export default ControlsRegions;
