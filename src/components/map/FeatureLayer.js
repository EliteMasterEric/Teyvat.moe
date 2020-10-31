import React from 'react';

import L from 'leaflet';
import { GeoJSON } from 'react-leaflet';

const FeatureLayer = ({ mapFeature }) => {
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
  const onEachFeature = () => {
    // Define popups here.
  };

  return (
    <GeoJSON
      data={mapFeature.data}
      style={style}
      pointToLayer={pointToLayer}
      onEachFeature={onEachFeature}
    />
  );
};

export default FeatureLayer;
