/**
 * Map control which display debug information to the user.
 */

import { Box, Typography, makeStyles } from '@material-ui/core';
import { Explore as ExploreIcon } from '@material-ui/icons';
import clsx from 'clsx';
import { LatLngLiteral } from 'leaflet';
import _ from 'lodash';
import React, { useState, FunctionComponent } from 'react';
import { useMapEvents } from 'react-leaflet';
import { connect, ConnectedProps } from 'react-redux';
import { t } from 'src/components/i18n/Localization';
import { InputTextField } from 'src/components/interface/Input';

import { AppDispatch } from 'src/components/redux';
import { selectEditorDebugEnabled } from 'src/components/redux/slices/ui';
import { AppState } from 'src/components/redux/types';
import { Empty } from 'src/components/Types';
import MapCustomControl from 'src/components/views/map/MapCustomControl';
import { navigateToMarkerByID } from 'src/components/views/PermalinkHandler';

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

const mapStateToProps = (state: AppState) => ({
  displayed: selectEditorDebugEnabled(state),
});
const mapDispatchToProps = (_dispatch: AppDispatch) => ({});
type DebugControlsStateProps = ReturnType<typeof mapStateToProps>;
type DebugControlsDispatchProps = ReturnType<typeof mapDispatchToProps>;
const connector = connect<DebugControlsStateProps, DebugControlsDispatchProps, Empty, AppState>(
  mapStateToProps,
  mapDispatchToProps
);

type DebugControlsProps = ConnectedProps<typeof connector>;

const _DebugControls: FunctionComponent<DebugControlsProps> = ({ displayed }) => {
  const classes = useStyles();

  const [mousePos, setMousePos] = useState<LatLngLiteral>({ lat: 0, lng: 0 });

  const _map = useMapEvents({
    mousemove: (event) => {
      setMousePos(event.latlng);
    },
  });

  const onNavigateToMarkerByID = (id: string) => {
    if (id === '' || id == null) return;

    navigateToMarkerByID(id);
  };

  return (
    <MapCustomControl
      position="bottomleft"
      className={clsx(displayed ? classes.show : classes.hide)}
    >
      <Box className={classes.container}>
        <Typography className={classes.titleText}>{t('debug')}</Typography>
        <Typography className={classes.positionText}>
          <ExploreIcon className={classes.positionIcon} />
          {mousePos.lat.toFixed(5)} X / {mousePos.lng.toFixed(5)} Y
        </Typography>
        <InputTextField label={t('navigate-to-marker-by-id')} onChange={onNavigateToMarkerByID} />
      </Box>
    </MapCustomControl>
  );
};

const DebugControls = connector(_DebugControls);

export default DebugControls;
