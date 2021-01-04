/**
 * Provides the container for the region buttons, on the side of the Map controls.
 */

import { Box, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';

import MapRegions from '~/components/data/MapRegions';
import MapControlsRegionBanner from '~/components/views/controls/sidebar/MapControlsRegionBanner';

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

const _MapControlsRegions = ({ displayed, open }) => {
  const classes = useStyles();

  return (
    <Box
      className={clsx(
        classes.main,
        displayed ? classes.show : classes.hide,
        open ? null : classes.closed
      )}
    >
      {_.keys(MapRegions).map((key) =>
        MapRegions[key]?.enabled ? <MapControlsRegionBanner key={key} regionKey={key} /> : null
      )}
    </Box>
  );
};

const mapStateToProps = (state, { shouldDisplay = true }) => ({
  displayed:
    state.controlsOpen && ['features', 'routes'].includes(state.controlsTab) && shouldDisplay,
  open: state.controlsOpen,
});
const mapDispatchToProps = (_dispatch) => ({});
const MapControlsRegions = connect(mapStateToProps, mapDispatchToProps)(_MapControlsRegions);

export default MapControlsRegions;
