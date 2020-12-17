import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import clsx from 'clsx';
import MapCustomControl from './MapCustomControl';

import './EditorControls.css';

const _EditorControls = ({ startEditorMarker, startEditorRoute, displayed }) => {
  return (
    <MapCustomControl position="topleft">
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
