import L from 'leaflet';
// Its very presence changes the behavior of L.
import 'leaflet.markercluster';
import _ from 'lodash';

import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';

export const offClusterFunction = (_zoom) => {
  return 0; // Don't cluster.
};

export const variableClusterFunction = (zoom) => {
  // Use variable clustering based on zoom level.
  switch (zoom) {
    case 10:
    case 9:
    case 8:
    default:
      return 0;
    case 7:
      return 25;
    case 6:
      return 55;
    case 5:
      return 80;
    case 4:
      return 100;
  }
};

export const onClusterFunction = (_zoom) => {
  return 24;
};

const CLUSTER_MARKER_ICON = require('../../../../images/icons/marker/marker_blue_bg.svg').default;

const createClusterIcon = (legacy) => (cluster) => {
  const childMarkers = cluster.getAllChildMarkers();
  const childCount = childMarkers.length;
  // For each cluster child element, check if completed = true; if so, add to the count.
  const childMarkersCompleted = childMarkers.filter((marker) => {
    if (legacy) {
      return marker?.options?.properties?.completed;
    }
    return marker?.options?.completed;
  });
  const childCompletedCount = childMarkersCompleted.length;
  const iconUrl = childMarkers[0]?.options?.icon?.options?.clusterIconUrl;

  const icon = (
    <>
      <img className="map-marker-cluster-marker" src={CLUSTER_MARKER_ICON} alt="" />
      <b className="map-marker-cluster-label">
        {childCompletedCount}/{childCount}
      </b>
      <img className="map-marker-cluster-img" src={iconUrl} alt="" />
    </>
  );

  const iconHTML = ReactDOMServer.renderToString(icon);

  // console.log(`clusterIcon: ${childCompletedCount}`);

  return L.divIcon({
    html: iconHTML,
    className: 'map-marker-cluster',
    iconSize: [36 + childCount / 3, 36 + childCount / 3], // size of the icon
    shadowSize: [36 + childCount / 3, 36 + childCount / 3], // size of the shadow
    iconAnchor: [(36 + childCount / 3) / 2, 36 + (childCount / 3) * 0.95],
  });
};

const MapCluster = ({ children, clusterFunction = offClusterFunction, legacy = true }) => {
  const map = useMap();

  const generateSpiderPoints = (childMarkerCount, _centerPoint, childMarkers) => {
    const res = [];

    res.length = childMarkerCount;

    for (let i = childMarkerCount - 1; i >= 0; i -= 1) {
      // console.log(childMarkers[i]._latlng);
      const childCenter = map.latLngToLayerPoint(childMarkers[i]._latlng);
      res[i] = new L.Point(childCenter.x, childCenter.y);
    }

    return res;
  };

  return (
    <MarkerClusterGroup
      disableClusteringAtZoom={8}
      iconCreateFunction={createClusterIcon(legacy)}
      maxClusterRadius={clusterFunction}
      // onClick={console.log}
      // onDblClick={console.log}
      // onMouseOut={console.log}
      // onMouseOver={console.log}
      // Configure how the coverage line is displayed.
      polygonOptions={{
        color: '#008E8A',
        weight: 3,
        dashArray: '8',
        fillOpacity: 0.4,
      }}
      showCoverageOnHover
      singleMarkerMode={false}
      spiderfyOnEveryZoom // Spiderfy on click (all zoom levels)
      spiderfyShapePositions={generateSpiderPoints}
      zoomToBoundsOnClick={false}
      chunkedLoading // Split the addLayers processing in to small intervals so that the page does not freeze.
    >
      {children}
    </MarkerClusterGroup>
  );
};

export default MapCluster;
