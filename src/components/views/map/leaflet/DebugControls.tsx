/**
 * Map control which display debug information to the user.
 */

import { Typography } from '@material-ui/core';
import ExploreIcon from '@material-ui/icons/Explore';
import { makeStyles } from '@material-ui/styles';
import { LatLngLiteral } from 'leaflet';
import _ from 'lodash';
import React, { useState, FunctionComponent, memo, useCallback } from 'react';
import { useMapEvents } from 'react-leaflet';
import { connect, ConnectedProps } from 'react-redux';
import { t } from 'src/components/i18n/Localization';
import { InputTextField } from 'src/components/interface/Input';
import { selectEditorDebugEnabled } from 'src/components/redux/slices/map/interface/Selector';
import { AppState } from 'src/components/redux/Types';
import { Empty } from 'src/components/Types';
import MapCustomControl from 'src/components/views/map/leaflet/MapCustomControl';
import { navigateToMarkerByID } from 'src/components/views/map/PermalinkHandler';

const useStyles = makeStyles((_theme) => ({
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
type DebugControlsStateProps = ReturnType<typeof mapStateToProps>;
const connector = connect<DebugControlsStateProps, Empty, Empty, AppState>(mapStateToProps);

type DebugControlsProps = ConnectedProps<typeof connector>;

/**
 * Display the map position at the cursor.
 * Requires one of the parent components to be a MapContainer to
 *
 * Should re-render if the mouse position changes.
 */
const DebugControlsMousePos = memo(() => {
  const classes = useStyles();

  const [mousePos, setMousePos] = useState<LatLngLiteral>({ lat: 0, lng: 0 });

  const _map = useMapEvents({
    mousemove: (event) => {
      setMousePos(event.latlng);
    },
  });

  return (
    <Typography className={classes.positionText}>
      <ExploreIcon className={classes.positionIcon} />
      {mousePos.lat.toFixed(5)} X / {mousePos.lng.toFixed(5)} Y
    </Typography>
  );
});

/**
 * Display a text field which navigates the user to the marker with the given ID.
 *
 * Should re-render never, since there is no state or props.
 */
const DebugControlsNavigateMarker = memo(() => {
  // Use a callback to prevent re-renders.
  const onNavigateToMarker = useCallback((id: string) => {
    if (id === '' || id == null) return;

    navigateToMarkerByID(id);
  }, []);

  return (
    <InputTextField label={t('map-ui:navigate-to-marker-by-id')} onChange={onNavigateToMarker} />
  );
});

/**
 * Display the debug controls, which includes a "Go to marker by ID" field and a "Map position at cursor" display.
 *
 * Should re-render if props change.
 */
const _DebugControls: FunctionComponent<DebugControlsProps> = memo(({ displayed }) => {
  const classes = useStyles();

  // Destroy the component completely if hidden.
  // We don't need to pre-render anything here, and having it on only triggers additional events.
  if (!displayed) return null;

  // Else, the component is enabled.
  return (
    <MapCustomControl position="bottomleft">
      <div className={classes.container}>
        <Typography className={classes.titleText}>{t('debug')}</Typography>
        <DebugControlsMousePos />
        <DebugControlsNavigateMarker />
      </div>
    </MapCustomControl>
  );
});

const DebugControls = connector(_DebugControls);

export default DebugControls;
