/**
 * Provides the Leaflet controls at the top left of the map.
 */

import clsx from 'clsx';
import _ from 'lodash';
import React from 'react';
import { ZoomControl } from 'react-leaflet';
import { connect } from 'react-redux';

import MapCustomControl from '~/components/views/map/MapCustomControl';

import './EditorControls.css';

const _EditorControls = ({ startEditorMarker, startEditorRoute, displayed }) => {
  return (
    <MapCustomControl position="topleft">
      {/* Controls the zoom buttons in the top left corner. */}
      <ZoomControl zoomInTitle="+" zoomOutTitle="-" />
      <div
        className={clsx('map-editor-control-toolbar', displayed ? 'display-block' : 'display-none')}
      >
        <div
          onClick={startEditorMarker}
          onKeyDown={startEditorMarker}
          className={clsx(
            'map-editor-control-button-image',
            'map-editor-control-button-image-marker'
          )}
          role="button"
          aria-label="Create Marker"
          tabIndex={0}
        />
        <div
          role="button"
          tabIndex={0}
          onClick={startEditorRoute}
          onKeyDown={startEditorRoute}
          aria-label="Create Route"
          className={clsx(
            'map-editor-control-button-image',
            'map-editor-control-button-image-route'
          )}
        />
      </div>
    </MapCustomControl>
  );
};

const mapStateToProps = (state) => ({
  displayed: state.editorEnabled,
});
const mapDispatchToProps = (_dispatch) => ({});
const EditorControls = connect(mapStateToProps, mapDispatchToProps)(_EditorControls);

export default EditorControls;
