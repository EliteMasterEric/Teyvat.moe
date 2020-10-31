import React from 'react';

import L from 'leaflet';
import { GeoJSON } from 'react-leaflet';
import { hashObject } from '../Util';

const editorMarker = L.icon({
  className: `map-marker-editor`,
  iconUrl: 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==', // Transparent pixel.
  shadowUrl: require('../../images/icons/map_base/marker.png').default, // Default value. Use options to override.
  iconSize: [24, 23], // size of the icon
  shadowSize: [40, 40], // size of the shadow
  iconAnchor: [12, 34.5], // point of the icon which will correspond to marker's location
  shadowAnchor: [20, 40], // the same for the shadow
  popupAnchor: [0, -34.5], // point from which the popup should open relative to the iconAnchor
});

export const EditorLayer = ({ mapPreferences, updateData }) => {
  const mapFeature = {
    ...mapPreferences?.editor?.feature,
    icons: {
      // The icon used on the map.
      base: editorMarker,
    },
  };

  const onDragEnd = (feature) => (event) => {
    // Update the marker to the new location.
    const dest = event.target.getLatLng();

    updateData((oldData) => {
      const index = oldData.indexOf(feature);
      console.log(`Dragged marker ${index} to ${dest}`);

      // Update the marker.
      const oldMarker = oldData[index];
      const newData = oldData;
      newData[index] = {
        ...oldMarker,
        geometry: {
          type: 'Point',
          coordinates: [dest?.lat, dest?.lng],
        },
      };

      return newData;
    });
  };

  const pointToLayer = (feature, latLng) => {
    // Generate the feature here.
    return L.marker([latLng.lng, latLng.lat], {
      icon: mapFeature.icons.base,
      alt: `${latLng.lng},${latLng.lat}`,
    });
  };
  const style = (feature) => {
    // Tack on additional styles here.
    return {};
  };
  const onEachFeature = (feature, layer) => {
    // Define popups and drag events here.
    // eslint-disable-next-line no-param-reassign
    layer.options.draggable = true;
    layer.on('dragend', onDragEnd(feature));
  };

  return (
    <GeoJSON
      key={hashObject(mapFeature)}
      data={mapFeature.data}
      style={style}
      pointToLayer={pointToLayer}
      onEachFeature={onEachFeature}
    />
  );
};

export const FeatureLayer = ({ mapFeature }) => {
  const pointToLayer = (feature, latLng) => {
    // Generate the feature here.
    return L.marker([latLng.lng, latLng.lat], {
      icon: mapFeature.icons.base,
      alt: `${latLng.lng},${latLng.lat}`,
    });
  };

  return (
    <GeoJSON key={hashObject(mapFeature)} data={mapFeature.data} pointToLayer={pointToLayer} />
  );
};
