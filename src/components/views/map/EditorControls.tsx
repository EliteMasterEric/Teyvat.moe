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
import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { t } from 'src/components/i18n/Localization';
import { selectEditorEnabled } from 'src/components/redux/slices/ui';
import { AppState } from 'src/components/redux/types';

import MapCustomControl, {
  MapCustomControlButton,
} from 'src/components/views/map/MapCustomControl';

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

type EditorControlsBaseProps = {
  startEditorMarker: React.MouseEventHandler<HTMLDivElement>;
  startEditorRoute: React.MouseEventHandler<HTMLDivElement>;
  cancelEditor: React.MouseEventHandler<HTMLDivElement>;
  commitEditor: React.MouseEventHandler<HTMLDivElement>;
  showCancel: boolean;
  showDone: boolean;
};

const mapStateToProps = (state: AppState, _props: EditorControlsBaseProps) => ({
  displayed: selectEditorEnabled(state),
});
const mapDispatchToProps = () => ({});
type EditorControlsStoreProps = ReturnType<typeof mapStateToProps>;
type EditorControlsDispatchProps = ReturnType<typeof mapDispatchToProps>;
const connector = connect<
  EditorControlsStoreProps,
  EditorControlsDispatchProps,
  EditorControlsBaseProps,
  AppState
>(mapStateToProps, mapDispatchToProps);

type EditorControlsProps = EditorControlsBaseProps &
  EditorControlsStoreProps &
  EditorControlsDispatchProps;

const _EditorControls: FunctionComponent<EditorControlsProps> = ({
  displayed,
  startEditorMarker,
  startEditorRoute,
  cancelEditor,
  commitEditor,
  showCancel,
  showDone,
}) => {
  const classes = useStyles();

  const onMarkerClick: React.MouseEventHandler<HTMLDivElement> = (event) => {
    startEditorMarker(event);
  };

  const onRouteClick: React.MouseEventHandler<HTMLDivElement> = (event) => {
    startEditorRoute(event);
  };

  const onDoneClick: React.MouseEventHandler<HTMLDivElement> = (event) => {
    commitEditor(event);
  };

  const onCancelClick: React.MouseEventHandler<HTMLDivElement> = (event) => {
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

const EditorControls = connector(_EditorControls);

export default EditorControls;
