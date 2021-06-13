/**
 * Provides the control which displays placed routes
 * in the Editor tab of the map Controls.
 */

import { Box, Tooltip, IconButton, Typography } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import GpsFixedIcon from '@material-ui/icons/GpsFixed';
import { makeStyles } from '@material-ui/styles';
import _ from 'lodash';
import React, { FunctionComponent, useCallback } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { f, t } from 'src/components/i18n/Localization';
import { InputTextArea, InputTextField } from 'src/components/interface/Input';
import { EditorRoute } from 'src/components/preferences/map/EditorDataSchema';
import { AppDispatch } from 'src/components/redux';
import { editRoute, removeRoute } from 'src/components/redux/slices/map/editor/Actions';
import { setMapHighlight, setMapPosition } from 'src/components/redux/slices/map/interface/Actions';
import { selectIsRouteHighlighted } from 'src/components/redux/slices/map/interface/Selector';
import { AppState } from 'src/components/redux/Types';
import ControlsEditorImageUploader from 'src/components/views/map/controls/editor/ControlsEditorImageUploader';

const useStyles = makeStyles((_theme) => ({
  routeBox: {
    border: '2px solid #d2c6bb',
    borderRadius: '12px 0 0 12px',
    padding: '8px 8px 8px 8px',
    margin: '4px 4px 4px 0px',
  },
  textField: {
    width: '100%',
  },
  routeLabel: {
    flexGrow: 1,
  },
  deleteButton: {
    backgroundColor: '#313131',
    color: '#ff5d5a',
    '&:hover': {
      backgroundColor: '#616161',
    },
  },
  locateButton: {
    margin: '0 8px 0 0',
    backgroundColor: '#313131',
    color: '#ffca31',
    '&:hover': {
      backgroundColor: '#616161',
    },
  },
}));

interface ControlsEditorRouteBaseProps {
  route: EditorRoute;
}

const mapStateToProps = (state: AppState, { route }: ControlsEditorRouteBaseProps) => ({
  highlighted: selectIsRouteHighlighted(state, route.id),
  routeID: route.id,
  routeTitle: route?.popupTitle?.en ?? '', // TODO: Currently the editor only allows English.
  routeContent: route?.popupContent?.en ?? '', // TODO: Currently the editor only allows English.
  routeMedia: route.popupMedia,
});
const mapDispatchToProps = (dispatch: AppDispatch, { route }: ControlsEditorRouteBaseProps) => ({
  setRouteTitle: (value: string) => {
    dispatch(editRoute(route.id, 'popupTitle.en', value));
  },
  setRouteContent: (value: string) => {
    dispatch(editRoute(route.id, 'popupContent.en', value));
  },
  setRouteMedia: (value: string) => {
    dispatch(editRoute(route.id, 'popupMedia', value));
  },

  deleteRoute: () => dispatch(removeRoute(route.id)),

  highlightRoute: () => {
    const HIGHLIGHT_ZOOM_LEVEL = 8;

    const routeStartingMarker = route.coordinates[0];
    if (routeStartingMarker != null && routeStartingMarker.length >= 2) {
      dispatch(setMapHighlight(route.id));
      dispatch(
        setMapPosition(
          {
            lat: routeStartingMarker[0],
            lng: routeStartingMarker[1],
          },
          HIGHLIGHT_ZOOM_LEVEL
        )
      );
    }
  },
});
type ControlsEditorRouteStateProps = ReturnType<typeof mapStateToProps>;
type ControlsEditorRouteDispatchProps = ReturnType<typeof mapDispatchToProps>;
const connector = connect<
  ControlsEditorRouteStateProps,
  ControlsEditorRouteDispatchProps,
  ControlsEditorRouteBaseProps,
  AppState
>(mapStateToProps, mapDispatchToProps);

type ControlsEditorRouteProps = ConnectedProps<typeof connector> & ControlsEditorRouteBaseProps;

const _ControlsEditorRoute: FunctionComponent<ControlsEditorRouteProps> = ({
  routeID: routeId,
  routeTitle,
  routeContent,
  routeMedia,
  highlightRoute,
  setRouteTitle,
  setRouteContent,
  setRouteMedia,
  deleteRoute,
}) => {
  const classes = useStyles();

  const setTitleValue = useCallback((value) => setRouteTitle(value), [setRouteTitle]);
  const setTitleContent = useCallback((value) => setRouteContent(value), [setRouteContent]);

  return (
    <Box display="flex" flexDirection="column" className={classes.routeBox}>
      <Box display="flex" flexDirection="row" alignItems="center">
        <Tooltip title={t('map-ui:highlight')}>
          <IconButton className={classes.locateButton} onClick={highlightRoute}>
            <GpsFixedIcon />
          </IconButton>
        </Tooltip>

        <Typography className={classes.routeLabel}>
          {f('map-ui:route-id-format', { id: routeId.slice(0, 7) })}
        </Typography>

        <Tooltip title={t('map-ui:delete')}>
          <IconButton className={classes.deleteButton} onClick={deleteRoute}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <InputTextField
        className={classes.textField}
        label={t('map-ui:popup-title')}
        value={routeTitle}
        onChange={setTitleValue}
      />
      <InputTextArea
        className={classes.textField}
        label={t('map-ui:popup-content')}
        value={routeContent}
        rows={3}
        onChange={setTitleContent}
      />
      <ControlsEditorImageUploader
        elementMedia={routeMedia ?? ''}
        setElementMedia={setRouteMedia}
      />
    </Box>
  );
};

const ControlsEditorRoute = connector(_ControlsEditorRoute);
export default ControlsEditorRoute;
