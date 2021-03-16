/**
 * Provides the Leaflet controls at the top left of the map.
 */

import { makeStyles } from '@material-ui/core';
import {
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  Place as PlaceIcon,
  Timeline as TimelineIcon,
} from '@material-ui/icons';
import clsx from 'clsx';
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { t } from '~/components/i18n/Localization';

import MapCustomControl, { MapCustomControlButton } from '~/components/views/map/MapCustomControl';

const useStyles = makeStyles((_theme) => ({
  toolbar: {},
  show: {
    display: 'block',
  },
  hide: {
    display: 'none',
  },
  button: {
    '&:first-child': {
      borderTopLeftRadius: 4,
      borderTopRightRadius: 4,
    },
    '&:last-child': {
      borderBottomLeftRadius: 4,
      borderBottomRightRadius: 4,
    },
    color: '#555',
    display: 'flex',
    justifyContent: 'center',
    padding: 4,
    backgroundColor: '#fff',
    borderBottom: '1px solid #ccc',
    '& > svg': {
      width: 20,
      height: 20,
    },
  },
}));

const _EditorControls = ({
  startEditorMarker,
  startEditorRoute,
  cancelEditor,
  commitEditor,
  displayed,
  showCancel,
  showDone,
}) => {
  const classes = useStyles();

  const onMarkerClick = (event) => {
    startEditorMarker(event);
  };

  const onRouteClick = (event) => {
    startEditorRoute(event);
  };

  const onDoneClick = (event) => {
    commitEditor(event);
  };

  const onCancelClick = (event) => {
    cancelEditor(event);
  };

  return (
    <MapCustomControl
      position="topleft"
      className={clsx(displayed ? classes.show : classes.hide)}
      containerClass={classes.toolbar}
    >
      {showCancel || showDone ? (
        // DRAWING ACTIVE.
        // Display cancel button.
        <>
          {showDone ? (
            <MapCustomControlButton
              onClick={onDoneClick}
              className={classes.button}
              tooltip={t('done')}
            >
              <CheckCircleIcon />
            </MapCustomControlButton>
          ) : null}
          {showCancel ? (
            <MapCustomControlButton
              onClick={onCancelClick}
              className={classes.button}
              tooltip={t('cancel')}
            >
              <CancelIcon />
            </MapCustomControlButton>
          ) : null}
        </>
      ) : (
        // DRAWING INACTIVE.
        // Ready to place another marker.
        <>
          <MapCustomControlButton
            onClick={onMarkerClick}
            className={classes.button}
            tooltip={t('marker')}
          >
            <PlaceIcon />
          </MapCustomControlButton>
          <MapCustomControlButton
            onClick={onRouteClick}
            className={classes.button}
            tooltip={t('route')}
          >
            <TimelineIcon />
          </MapCustomControlButton>
        </>
      )}
    </MapCustomControl>
  );
};

const mapStateToProps = (state) => ({
  displayed: state.editorEnabled,
});
const mapDispatchToProps = () => ({});
const EditorControls = connect(mapStateToProps, mapDispatchToProps)(_EditorControls);

export default EditorControls;
