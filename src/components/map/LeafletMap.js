import React from 'react';

import { MapFeatures, MapRoutes } from '../MapFeatures';
import { FeatureLayer, RouteLayer, EditorLayer } from './MapLayer';
import EditorMap, { EditorControls } from './EditorMap';

import './LeafletMap.css';

const LeafletMap = ({ mapPreferences, setMapPreferences }) => {
  // Reference to the map.
  const mapRef = React.useRef(null);
  const editRef = React.useRef(null);

  const setEditorData = (func) => {
    console.log('Edit data!');
    setMapPreferences((old) => ({
      ...old,
      editor: {
        ...old.editor,
        feature: {
          ...old.editor.feature,
          data: func(old.editor.feature.data),
        },
      },
    }));
  };

  /**
   * Every time the requested position changes in the mapPreferences object,
   * move the map to that position.
   *
   * The !== check prevents an infinite loop with onDragEnd.
   */
  React.useEffect(() => {
    if (mapRef.current.leafletElement == null) return;

    if (
      mapPreferences.position.latlng !== mapRef.current.leafletElement.getCenter() ||
      mapPreferences.position.zoom !== mapRef.current.leafletElement.getZoom()
    ) {
      mapRef.current.leafletElement.setView(
        [mapPreferences.position.latlng.lat, mapPreferences.position.latlng.lng],
        mapPreferences.position.zoom
      );
    }
  }, [mapPreferences.position]);

  /**
   * Every time the user drags or zooms to a position on the map,
   * update the state in setMapPreferences.
   */
  const onChangeMapPos = () => {
    if (mapRef.current.leafletElement == null) return;

    setMapPreferences((old) => ({
      ...old,
      position: {
        latlng: mapRef.current.leafletElement.getCenter(),
        zoom: mapRef.current.leafletElement.getZoom(),
      },
    }));
  };

  return (
    <EditorMap
      ref={editRef}
      mapRef={mapRef}
      onChangeMapPos={onChangeMapPos}
      setEditorData={setEditorData}
      editorEnabled={mapPreferences?.editor?.enabled}
    >
      {mapPreferences?.editor?.enabled ? (
        <>
          <EditorLayer mapPreferences={mapPreferences} mapRef={mapRef} />
        </>
      ) : (
        [
          ...Object.keys(mapPreferences?.displayed?.features).map((key) => {
            const shouldDisplay = mapPreferences?.displayed?.features[key];

            if (!shouldDisplay) return null;

            const feature = MapFeatures[key];
            return <FeatureLayer key={key} mapFeature={feature} />;
          }),
          ...Object.keys(mapPreferences?.displayed?.routes).map((key) => {
            const shouldDisplay = mapPreferences?.displayed?.routes[key];

            if (!shouldDisplay) return null;

            const route = MapRoutes[key];
            return <RouteLayer key={key} mapFeature={route} />;
          }),
        ]
      )}
    </EditorMap>
  );
};

export default LeafletMap;
