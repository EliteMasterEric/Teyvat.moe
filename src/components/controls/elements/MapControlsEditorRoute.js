import _ from 'lodash';
import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';

import Tooltip from 'react-tooltip';

import './MapControlsEditor.css';
import { removeElement, setElementProperty } from '../../../redux/ducks/editor';
import { setEditorHighlight, setPositionAndZoom } from '../../../redux/ducks/ui';
import { f, t } from '../../Localization';

const _MapControlsEditorRoute = ({
  routeId,
  routeTitle,
  routeContent,
  routeImage,
  highlighted,
  highlightRoute,
  setRouteTitle,
  setRouteContent,
  setRouteImage,
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
          {f('route-id', { id: routeId })}
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
        <span className={clsx('map-controls-editor-element-label')}>{t('route-name')}</span>
        <input value={routeTitle} onChange={(event) => setRouteTitle(event.target.value)} />
      </div>
      <div className={clsx('map-controls-editor-element-row')}>
        <span className={clsx('map-controls-editor-element-label')}>{t('route-content')}</span>
        <textarea value={routeContent} onChange={(event) => setRouteContent(event.target.value)} />
      </div>
      <div className={clsx('map-controls-editor-element-row')}>
        <span className={clsx('map-controls-editor-element-label')}>{t('route-image')}</span>
        <input
          placeholder="none"
          value={routeImage}
          onChange={(event) => setRouteImage(event.target.value)}
        />
      </div>
    </div>
  );
};

const mapStateToProps = (state, { route }) => ({
  highlighted: state.editorHighlight === route.id,
  routeId: route.id,
  routeTitle: route.properties.popupTitle,
  routeContent: route.properties.popupTitle,
  routeImage: route.properties.popupTitle,
});
const mapDispatchToProps = (dispatch, { route }) => ({
  setRouteTitle: (value) => {
    dispatch(setElementProperty(route, 'properties.popupName.en', value));
  },
  setRouteContent: (value) => {
    dispatch(setElementProperty(route, 'properties.popupContent.en', value));
  },
  setRouteImage: (value) => {
    dispatch(setElementProperty(route, 'properties.popupImage', value));
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
