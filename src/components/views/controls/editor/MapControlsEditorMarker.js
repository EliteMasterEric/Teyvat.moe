/**
 * Provides the control which displays placed markers
 * in the Editor tab of the map Controls.
 */

import { Box, Tooltip, IconButton, makeStyles, Typography } from '@material-ui/core';
import { Delete as DeleteIcon, GpsFixed as GpsFixedIcon } from '@material-ui/icons';
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';

import { f, t } from '~/components/i18n/Localization';
import { InputTextArea, InputTextField } from '~/components/interface/Input';
import MapControlsEditorImageUploader from '~/components/views/controls/editor/MapControlsEditorImageUploader';
import { removeElement, setElementProperty } from '~/redux/ducks/editor';
import { setEditorHighlight, setPositionAndZoom } from '~/redux/ducks/ui';

const useStyles = makeStyles((theme) => ({
  markerBox: {
    border: '2px solid #d2c6bb',
    borderRadius: '12px 0 0 12px',
    padding: '8px 8px 8px 8px',
    margin: '4px 4px 4px 0px',
  },
  textField: {
    width: '100%',
  },
  markerLabel: {
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

const _MapControlsEditorMarker = ({
  marker,
  highlightMarker,
  setMarkerTitle,
  setMarkerContent,
  setMarkerMedia,
  deleteMarker,
}) => {
  const classes = useStyles();

  const markerId = marker?.id ?? '';
  const markerTitle = marker?.popupTitle?.en ?? '';
  const markerContent = marker?.popupContent?.en ?? '';
  const markerMedia = marker?.popupMedia ?? '';

  return (
    <Box display="flex" flexDirection="column" className={classes.markerBox}>
      <Box display="flex" flexDirection="row" alignItems="center">
        <Tooltip title={t('editor-highlight-tooltip')}>
          <IconButton className={classes.locateButton} onClick={highlightMarker}>
            <GpsFixedIcon />
          </IconButton>
        </Tooltip>

        <Typography className={classes.markerLabel}>
          {f('editor-elements-marker-id', { id: markerId.substring(0, 7) })}
        </Typography>

        <Tooltip title={t('editor-delete-tooltip')}>
          <IconButton className={classes.deleteButton} onClick={deleteMarker}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <InputTextField
        className={classes.textField}
        label={t('editor-title-label')}
        value={markerTitle}
        onChange={(value) => setMarkerTitle(value)}
      />
      <InputTextArea
        className={classes.textField}
        label={t('editor-content-label')}
        value={markerContent}
        rows={3}
        onChange={(value) => setMarkerContent(value)}
      />
      <MapControlsEditorImageUploader elementMedia={markerMedia} setElementMedia={setMarkerMedia} />
    </Box>
  );
};

const mapStateToProps = (state, { marker }) => ({
  highlighted: state.editorHighlight === marker.id,
});
const mapDispatchToProps = (dispatch, { marker }) => ({
  setMarkerTitle: (value) => {
    if (value !== _.get(marker, 'popupTitle.en')) {
      dispatch(setElementProperty(marker.id, 'popupTitle.en', value));
    }
  },
  setMarkerContent: (value) => {
    if (value !== _.get(marker, 'popupContent.en')) {
      dispatch(setElementProperty(marker.id, 'popupContent.en', value));
    }
  },
  setMarkerMedia: (value) => {
    if (value !== _.get(marker, 'popupMedia')) {
      dispatch(setElementProperty(marker.id, 'popupMedia', value));
    }
  },

  deleteMarker: () => dispatch(removeElement(marker)),

  highlightMarker: () => {
    const HIGHLIGHT_ZOOM_LEVEL = 8;

    dispatch(setEditorHighlight(marker.id));
    dispatch(
      setPositionAndZoom(
        {
          lat: marker?.coordinates[0],
          lng: marker?.coordinates[1],
        },
        HIGHLIGHT_ZOOM_LEVEL
      )
    );
  },
});
const MapControlsEditorMarker = connect(
  mapStateToProps,
  mapDispatchToProps
)(_MapControlsEditorMarker);

export default MapControlsEditorMarker;
