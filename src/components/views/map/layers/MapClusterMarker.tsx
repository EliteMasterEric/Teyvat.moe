import { Marker, MarkerCluster, Point, divIcon } from 'leaflet';
// Its very presence changes the behavior of L.
import 'leaflet.markercluster';
import _ from 'lodash';
import React, { ReactElement } from 'react';
import ReactDOMServer from 'react-dom/server';
import { useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';

import { LExtendedMarker } from '~/components/views/map/layers/ExtendedMarker';

export const offClusterFunction = (_zoom: number): number => {
  return 0; // Don't cluster.
};

export const variableClusterFunction = (zoom: number): number => {
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

export const onClusterFunction = (_zoom: number): number => {
  return 24;
};

const CLUSTER_MARKER_ICON = require('~/images/icons/marker/marker_blue_bg.svg').default;

const createClusterIcon = (cluster: MarkerCluster): L.DivIcon => {
  const childMarkers = cluster.getAllChildMarkers() as LExtendedMarker[];
  const childCount = childMarkers.length;
  // For each cluster child element, check if completed = true; if so, add to the count.
  const childMarkersCompleted = childMarkers.filter((marker) => {
    return marker?.completed;
  });
  const childCompletedCount = childMarkersCompleted.length;
  const iconUrl = childMarkers[0]?.clusterIconUrl;

  const iconHTML = ReactDOMServer.renderToString(
    <>
      <img className="map-marker-cluster-marker" src={CLUSTER_MARKER_ICON} alt="" />
      <b className="map-marker-cluster-label">
        {childCompletedCount}/{childCount}
      </b>
      <img className="map-marker-cluster-img" src={iconUrl} alt="" />
    </>
  );

  const iconSize = 36 + childCount / 3;

  return divIcon({
    html: iconHTML,
    className: 'map-marker-cluster',
    iconSize: [iconSize, iconSize], // size of the icon
    shadowSize: [iconSize, iconSize], // size of the shadow
    iconAnchor: [iconSize / 2, iconSize * 0.95],
  });
};

const MapClusterMarker = ({
  children,
  clusterFunction = offClusterFunction,
}: {
  children: any;
  clusterFunction: (zoom: number) => number;
}): ReactElement => {
  const map = useMap();

  const generateSpiderPoints = (
    childMarkerCount: number,
    _centerPoint: Point,
    childMarkers: Marker[]
  ) => {
    const result = [];

    result.length = childMarkerCount;

    for (let i = childMarkerCount - 1; i >= 0; i -= 1) {
      // console.log(childMarkers[i]._latlng);
      const childCenter = map.latLngToLayerPoint(childMarkers[i].getLatLng());
      result[i] = new Point(childCenter.x, childCenter.y);
    }

    return result;
  };

  return (
    <MarkerClusterGroup
      disableClusteringAtZoom={8}
      iconCreateFunction={createClusterIcon}
      maxClusterRadius={clusterFunction}
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

export default MapClusterMarker;
