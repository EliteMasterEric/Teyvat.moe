/**
 * Provides the control which displays placed routes
 * in the Editor tab of the map Controls.
 */

import { Box, Tooltip, IconButton, makeStyles, Typography } from '@material-ui/core';
import { Delete as DeleteIcon, GpsFixed as GpsFixedIcon } from '@material-ui/icons';
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';

import { f, t } from '~/components/i18n/Localization';
import MapControlsEditorImageUploader from '~/components/views/controls/editor/MapControlsEditorImageUploader';
import { removeElement, setElementProperty } from '~/redux/ducks/editor';
import { setEditorHighlight, setPositionAndZoom } from '~/redux/ducks/ui';

import { InputTextArea, InputTextField } from '~/components/interface/Input';

const useStyles = makeStyles((theme) => ({
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
    backgroundColor: theme.custom.button.bgColor.main,
    color: theme.custom.button.color.delete,
    '&:hover': {
      backgroundColor: theme.custom.button.bgColor.hover,
    },
  },
  locateButton: {
    margin: '0 8px 0 0',
    backgroundColor: theme.custom.button.bgColor.main,
    color: theme.custom.button.color.locate,
    '&:hover': {
      backgroundColor: theme.custom.button.bgColor.hover,
    },
  },
}));

const _MapControlsEditorRoute = ({
  routeId,
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

  return (
    <Box display="flex" flexDirection="column" className={classes.routeBox}>
      <Box display="flex" flexDirection="row" alignItems="center">
        <Tooltip title={t('editor-highlight-tooltip')}>
          <IconButton className={classes.locateButton} onClick={highlightRoute}>
            <GpsFixedIcon />
          </IconButton>
        </Tooltip>

        <Typography className={classes.routeLabel}>
          {f('editor-elements-route-id', { id: routeId.substring(0, 7) })}
        </Typography>

        <Tooltip title={t('editor-delete-tooltip')}>
          <IconButton className={classes.deleteButton} onClick={deleteRoute}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <InputTextField
        className={classes.textField}
        label={t('editor-title-label')}
        value={routeTitle}
        onChange={(value) => setRouteTitle(value)}
      />
      <InputTextArea
        className={classes.textField}
        label={t('editor-content-label')}
        value={routeContent}
        rows={3}
        onChange={(value) => setRouteContent(value)}
      />
      <MapControlsEditorImageUploader elementMedia={routeMedia} setElementMedia={setRouteMedia} />
    </Box>
  );
};

const mapStateToProps = (state, { route }) => ({
  highlighted: state.editorHighlight === route.id,
  routeId: route.id,
  routeTitle: route.popupTitle.en,
  routeContent: route.popupContent.en,
  routeMedia: route.popupMedia,
});
const mapDispatchToProps = (dispatch, { route }) => ({
  setRouteTitle: (value) => {
    dispatch(setElementProperty(route.id, 'popupTitle.en', value));
  },
  setRouteContent: (value) => {
    dispatch(setElementProperty(route.id, 'popupContent.en', value));
  },
  setRouteMedia: (value) => {
    dispatch(setElementProperty(route.id, 'popupMedia', value));
  },

  deleteRoute: () => dispatch(removeElement(route)),

  highlightRoute: () => {
    const HIGHLIGHT_ZOOM_LEVEL = 8;

    dispatch(setEditorHighlight(route.id));
    dispatch(
      setPositionAndZoom(
        {
          lat: route?.coordinates[0][0],
          lng: route?.coordinates[0][1],
        },
        HIGHLIGHT_ZOOM_LEVEL
      )
    );
  },
});
const MapControlsEditorRoute = connect(
  mapStateToProps,
  mapDispatchToProps
)(_MapControlsEditorRoute);

export default MapControlsEditorRoute;
