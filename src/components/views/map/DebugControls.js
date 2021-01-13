/**
 * Map control which display debug information to the user.
 */

/* eslint-disable jsx-a11y/no-static-element-interactions */
import { makeStyles, Box, Typography } from '@material-ui/core';
import { Explore as ExploreIcon } from '@material-ui/icons';
import clsx from 'clsx';
import _ from 'lodash';
import React from 'react';
import { useMapEvents } from 'react-leaflet';
import { connect } from 'react-redux';
import { t } from '~/components/i18n/Localization';
import { InputTextField } from '~/components/interface/Input';

import MapCustomControl from '~/components/views/map/MapCustomControl';
import { setPositionAndZoom } from '~/redux/ducks/ui';
import { navigateToMarkerById } from '~/components/views/PermalinkHandler';

const useStyles = makeStyles((_theme) => ({
  show: {
    display: 'block',
  },
  hide: {
    display: 'none',
  },

  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 8,
    padding: 8,
  },

  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  positionText: {
    fontSize: 12,
    fontFamily: 'mono',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  positionIcon: {
    marginRight: 8,
  },
}));

/* eslint-disable no-shadow */
const _DebugControls = ({ displayed, setPositionAndZoom }) => {
  const classes = useStyles();

  const [mousePos, setMousePos] = React.useState({ lat: 0, lng: 0 });

  const _map = useMapEvents({
    mousemove: (event) => {
      setMousePos(event.latlng);
    },
  });

  const onNavigateToMarkerById = (id) => {
    if (id === '' || id == null) return;

    navigateToMarkerById(id, setPositionAndZoom);
  };

  return (
    <MapCustomControl
      position="bottomleft"
      className={clsx(displayed ? classes.show : classes.hide)}
    >
      <Box className={classes.container}>
        <Typography className={classes.titleText}>{t('debug-title')}</Typography>
        <Typography className={classes.positionText}>
          <ExploreIcon className={classes.positionIcon} />
          {mousePos.lat.toFixed(5)} X / {mousePos.lng.toFixed(5)} Y
        </Typography>
        <InputTextField label={t('debug-navigate-by-id')} onChange={onNavigateToMarkerById} />
      </Box>
    </MapCustomControl>
  );
};

const mapStateToProps = (state) => ({
  displayed: state.displayDebug,
});
const mapDispatchToProps = (dispatch) => ({
  setPositionAndZoom: (position, zoom) => dispatch(setPositionAndZoom(position, zoom)),
});
const DebugControls = connect(mapStateToProps, mapDispatchToProps)(_DebugControls);

export default DebugControls;
