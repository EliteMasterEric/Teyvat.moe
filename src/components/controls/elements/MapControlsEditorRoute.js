import _ from 'lodash';
import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';

import Tooltip from 'react-tooltip';

import './MapControlsEditor.css';
import { removeElement, setElementProperty } from '../../../redux/ducks/editor';
import { setEditorHighlight, setPositionAndZoom } from '../../../redux/ducks/ui';
import { f, t } from '../../Localization';
import MapControlsEditorImageUploader from './MapControlsEditorImageUploader';

const _MapControlsEditorRoute = ({
  routeId,
  routeTitle,
  routeContent,
  routeMedia,
  highlighted,
  highlightRoute,
  setRouteTitle,
  setRouteContent,
  setRouteMedia,
  deleteRoute,
}) => {
  return (
    <div className={clsx('map-controls-editor-element')}>
      <div className={clsx('map-controls-editor-element-row')}>
        <div
          data-tip="Highlight"
          onClick={highlightRoute}
          onKeyDown={highlightRoute}
          role="button"
          aria-label="highlight"
          tabIndex={0}
          className={clsx(
            'nf',
            'nf-mdi-crosshairs_gps',
            'map-controls-editor-element-button',
            highlighted
              ? 'map-controls-editor-element-highlight-on'
              : 'map-controls-editor-element-highlight'
          )}
        />

        <span className={clsx('map-controls-editor-element-label')}>
          {f('editor-elements-route-id', { id: routeId })}
        </span>

        <Tooltip />

        <div
          data-tip="Delete"
          onClick={deleteRoute}
          onKeyDown={deleteRoute}
          role="button"
          aria-label="Delete"
          tabIndex={0}
          className={clsx(
            'nf',
            'nf-fa-trash',
            'map-controls-editor-element-button',
            'map-controls-editor-element-trash'
          )}
        />
      </div>
      <div className={clsx('map-controls-editor-element-row')}>
        <span className={clsx('map-controls-editor-element-label')}>
          {t('editor-elements-title')}
        </span>
        <input
          placeholder={t('editor-elements-title-placeholder')}
          value={routeTitle}
          onChange={(value) => setRouteTitle(value)}
        />
      </div>
      <div className={clsx('map-controls-editor-element-row')}>
        <span className={clsx('map-controls-editor-element-label')}>
          {t('editor-elements-content')}
        </span>
        <textarea
          placeholder={t('editor-elements-content-placeholder')}
          value={routeContent}
          onChange={(value) => setRouteContent(value)}
        />
      </div>
      <MapControlsEditorImageUploader elementMedia={routeMedia} setElementMedia={setRouteMedia} />
    </div>
  );
};

const mapStateToProps = (state, { route }) => ({
  highlighted: state.editorHighlight === route.id,
  routeId: route.id,
  routeTitle: route.properties.popupTitle.en,
  routeContent: route.properties.popupContent.en,
  routeMedia: route.properties.popupMedia,
});
const mapDispatchToProps = (dispatch, { route }) => ({
  setRouteTitle: (value) => {
    dispatch(setElementProperty(route, 'properties.popupTitle.en', value));
  },
  setRouteContent: (value) => {
    dispatch(setElementProperty(route, 'properties.popupContent.en', value));
  },
  setRouteMedia: (value) => {
    dispatch(setElementProperty(route, 'properties.popupMedia', value));
  },

  deleteMarker: () => dispatch(removeElement(route)),

  highlightMarker: () => {
    const HIGHLIGHT_ZOOM_LEVEL = 8;

    dispatch(setEditorHighlight(route.id));
    dispatch(
      setPositionAndZoom(
        {
          lat: route.geometry.coordinates[0][0],
          lng: route.geometry.coordinates[0][1],
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
