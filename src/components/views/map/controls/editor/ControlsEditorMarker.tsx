/**
 * Provides the control which displays placed markers
 * in the Editor tab of the map Controls.
 */

import { Box, Tooltip, IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import GpsFixedIcon from '@material-ui/icons/GpsFixed';
import { makeStyles } from '@material-ui/styles';
import _ from 'lodash';
import React, { FunctionComponent, useCallback } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { LocalizedTypography, t } from 'src/components/i18n/Localization';
import { InputTextArea, InputTextField } from 'src/components/interface/Input';
import { EditorMarker } from 'src/components/preferences/map/EditorDataSchema';
import { AppDispatch } from 'src/components/redux';
import { editMarker, removeMarker } from 'src/components/redux/slices/map/editor/Actions';
import { setMapHighlight, setMapPosition } from 'src/components/redux/slices/map/interface/Actions';
import { selectIsMarkerHighlighted } from 'src/components/redux/slices/map/interface/Selector';
import { AppState } from 'src/components/redux/Types';
import ControlsEditorImageUploader from 'src/components/views/map/controls/editor/ControlsEditorImageUploader';

const useStyles = makeStyles((_theme) => ({
  markerBox: {
    border: '2px solid #d2c6bb',
    borderRadius: '12px 0 0 12px',
    padding: '8px 8px 8px 8px',
    margin: '4px 4px 4px 0px',
  },
  textField: {
    margin: '8px 0 0 0',
    width: '100%',
  },
  markerLabel: {
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

interface ControlsEditorMarkerBaseProps {
  marker: EditorMarker;
}

const mapStateToProps = (state: AppState, { marker }: ControlsEditorMarkerBaseProps) => ({
  highlighted: selectIsMarkerHighlighted(state, marker.id),
  markerID: marker.id,
  markerTitle: marker?.popupTitle?.en ?? '', // TODO: Currently the editor only allows English.
  markerContent: marker?.popupContent?.en ?? '', // TODO: Currently the editor only allows English.
  markerMedia: marker.popupMedia,
});
const mapDispatchToProps = (dispatch: AppDispatch, { marker }: ControlsEditorMarkerBaseProps) => ({
  setMarkerTitle: (value: string) => {
    if (marker?.popupTitle?.en ?? '' === value) return;
    dispatch(editMarker(marker.id, 'popupTitle.en', value));
  },
  setMarkerContent: (value: string) => {
    if (marker?.popupContent?.en ?? '' === value) return;
    dispatch(editMarker(marker.id, 'popupContent.en', value));
  },
  setMarkerMedia: (value: string) => {
    if (marker.popupMedia === value) return;
    dispatch(editMarker(marker.id, 'popupMedia', value));
  },

  deleteMarker: () => dispatch(removeMarker(marker.id)),

  highlightMarker: () => {
    const HIGHLIGHT_ZOOM_LEVEL = 8;

    dispatch(setMapHighlight(marker.id));
    dispatch(
      setMapPosition(
        {
          lat: marker.coordinates[0],
          lng: marker.coordinates[1],
        },
        HIGHLIGHT_ZOOM_LEVEL
      )
    );
  },
});
type ControlsEditorMarkerStateProps = ReturnType<typeof mapStateToProps>;
type ControlsEditorMarkerDispatchProps = ReturnType<typeof mapDispatchToProps>;
const connector = connect<
  ControlsEditorMarkerStateProps,
  ControlsEditorMarkerDispatchProps,
  ControlsEditorMarkerBaseProps,
  AppState
>(mapStateToProps, mapDispatchToProps);

type ControlsEditorMarkerProps = ConnectedProps<typeof connector> & ControlsEditorMarkerBaseProps;

const _ControlsEditorMarker: FunctionComponent<ControlsEditorMarkerProps> = ({
  markerID: markerId,
  markerTitle,
  markerContent,
  markerMedia,

  highlightMarker,
  setMarkerTitle,
  setMarkerContent,
  setMarkerMedia,
  deleteMarker,
}) => {
  const classes = useStyles();

  const setTitleValue = useCallback((value) => setMarkerTitle(value), [setMarkerTitle]);
  const setContentValue = useCallback((value) => setMarkerContent(value), [setMarkerContent]);

  return (
    <Box display="flex" flexDirection="column" className={classes.markerBox}>
      <Box display="flex" flexDirection="row" alignItems="center">
        <Tooltip title={t('map-ui:highlight')}>
          <IconButton className={classes.locateButton} onClick={highlightMarker}>
            <GpsFixedIcon />
          </IconButton>
        </Tooltip>

        <LocalizedTypography
          i18nKey="map-ui:marker-id-format"
          values={{ id: markerId.slice(0, 7) }}
          className={classes.markerLabel}
        />

        <Tooltip title={t('map-ui:delete')}>
          <IconButton className={classes.deleteButton} onClick={deleteMarker}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <InputTextField
        className={classes.textField}
        label={t('map-ui:popup-title')}
        value={markerTitle}
        onChange={setTitleValue}
      />
      <InputTextArea
        className={classes.textField}
        label={t('map-ui:popup-content')}
        value={markerContent}
        rows={3}
        onChange={setContentValue}
      />
      <ControlsEditorImageUploader
        elementMedia={markerMedia ?? ''}
        setElementMedia={setMarkerMedia}
      />
    </Box>
  );
};

const ControlsEditorMarker = connector(_ControlsEditorMarker);
export default ControlsEditorMarker;
