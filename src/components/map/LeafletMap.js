import _ from 'lodash';
import React from 'react';

import { MapFeatures, MapRoutes } from '../MapFeatures';
import { FeatureLayer, RouteLayer, EditorLayer } from './MapLayer';
import EditorMap from './EditorMap';

import './LeafletMap.css';
import { getUnixTimestamp } from '../Util';

const LeafletMap = ({ mapPreferences, setMapPreferences }) => {
  // Reference to the map.
  const mapRef = React.useRef(null);
  const editRef = React.useRef(null);

  const setEditorData = (func) => {
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

  /**
   * Mark a feature marker as completed.
   * @param {*} featureKey The feature key of the marker.
   * @param {*} id The ID of the marker.
   */
  const markFeature = (featureKey, id) => {
    setMapPreferences((old) => {
      const currentValues = old?.completed?.features[featureKey];
      let newValues = null;

      if (currentValues == null || currentValues === []) {
        // Create a new mark group with one element.
        newValues = { [id]: getUnixTimestamp() };
      } else {
        // Check the mark group if the element is in the list.
        const alreadyCompleted = _.has(currentValues, id);

        // Copy the array.
        newValues = { ...currentValues };
        if (alreadyCompleted) {
          newValues = _.omit(newValues, id);
        } else {
          newValues = { ...newValues, [id]: getUnixTimestamp() };
        }
      }

      return {
        ...old,
        completed: {
          ...old.completed,
          features: {
            ...old.completed.features,
            [featureKey]: newValues,
          },
        },
      };
    });
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
            if (!feature) {
              console.error(`ERROR: Feature '${key}' is not defined.`);
              return null;
            }

            return (
              <FeatureLayer
                key={key}
                featureKey={key}
                mapPreferences={mapPreferences}
                mapFeature={feature}
                markFeature={markFeature}
                completedIds={mapPreferences?.completed?.features[key]}
              />
            );
          }),
          ...Object.keys(mapPreferences?.displayed?.routes).map((key) => {
            const shouldDisplay = mapPreferences?.displayed?.routes[key];

            if (!shouldDisplay) return null;

            const route = MapRoutes[key];
            if (!route) {
              console.error(`ERROR: Route '${key}' is not defined.`);
              return null;
            }

            return <RouteLayer key={key} mapPreferences={mapPreferences} mapRoute={route} />;
          }),
        ]
      )}
    </EditorMap>
  );
};

export default LeafletMap;
