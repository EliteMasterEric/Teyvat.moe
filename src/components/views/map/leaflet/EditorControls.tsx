/**
 * Provides the Leaflet controls at the top left of the map.
 */

import CancelIcon from '@material-ui/icons/Cancel';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import PlaceIcon from '@material-ui/icons/Place';
import TimelineIcon from '@material-ui/icons/Timeline';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import _ from 'lodash';
import React, { FunctionComponent } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { t } from 'src/components/i18n/Localization';
import { selectEditorEnabled } from 'src/components/redux/slices/map/interface/Selector';
import { AppState } from 'src/components/redux/Types';
import { Empty } from 'src/components/Types';
import MapCustomControl, {
  MapCustomControlButton,
} from 'src/components/views/map/leaflet/MapCustomControl';

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

const mapStateToProps = (state: AppState) => ({
  displayed: selectEditorEnabled(state),
});
type EditorControlsStoreProps = ReturnType<typeof mapStateToProps>;
const connector = connect<EditorControlsStoreProps, Empty, EditorControlsBaseProps, AppState>(
  mapStateToProps
);

type EditorControlsProps = ConnectedProps<typeof connector> & EditorControlsBaseProps;

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
            tooltip={t('map-ui:marker')}
          >
            <PlaceIcon />
          </MapCustomControlButton>
          <MapCustomControlButton
            onClick={onRouteClick}
            className={classes.button}
            tooltip={t('map-ui:route')}
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
