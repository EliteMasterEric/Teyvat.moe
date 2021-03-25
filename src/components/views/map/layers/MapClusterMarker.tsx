/* eslint-disable import/no-named-as-default-member */
import leaflet from 'leaflet';
import 'leaflet.markercluster';

import _ from 'lodash';
import { forwardRef, ReactNode } from 'react';
import { renderToString } from 'react-dom/server';
import { useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';

import { LExtendedMarker } from 'src/components/views/map/layers/ExtendedMarker';

export type MapClusterFunction = (zoom: number) => number;

export const offClusterFunction: MapClusterFunction = (_zoom) => {
  return 0; // Don't cluster.
};

export const variableClusterFunction: MapClusterFunction = (zoom) => {
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

export const onClusterFunction: MapClusterFunction = (_zoom) => {
  return 24;
};

const CLUSTER_MARKER_ICON = require('~/images/icons/marker/marker_blue_bg.svg').default;

const createClusterIcon = (cluster: leaflet.MarkerCluster): L.DivIcon => {
  const childMarkers = cluster.getAllChildMarkers() as LExtendedMarker[];
  const childCount = childMarkers.length;
  // For each cluster child element, check if completed = true; if so, add to the count.
  const childMarkersCompleted = childMarkers.filter((marker) => {
    return marker.completed;
  });
  const childCompletedCount = childMarkersCompleted.length;
  const iconUrl = childMarkers?.[0]?.clusterIconUrl ?? '';

  const iconHTML = renderToString(
    <>
      <img className="map-marker-cluster-marker" src={CLUSTER_MARKER_ICON} alt="" />
      <b className="map-marker-cluster-label">
        {childCompletedCount}/{childCount}
      </b>
      <img className="map-marker-cluster-img" src={iconUrl} alt="" />
    </>
  );

  const iconSize = 36 + childCount / 3;

  return leaflet.divIcon({
    html: iconHTML,
    className: 'map-marker-cluster',
    iconSize: [iconSize, iconSize], // size of the icon
    shadowSize: [iconSize, iconSize], // size of the shadow
    iconAnchor: [iconSize / 2, iconSize * 0.95],
  });
};

interface MapClusterMarkerProps {
  children?: ReactNode;
  clusterFunction: (zoom: number) => number;
}

const MapClusterMarker = forwardRef<leaflet.MarkerClusterGroup, MapClusterMarkerProps>(
  ({ children = null, clusterFunction = offClusterFunction }, ref) => {
    const map = useMap();

    const generateSpiderPoints = (
      childMarkerCount: number,
      _centerPoint: leaflet.Point,
      childMarkers: leaflet.Marker[]
    ): leaflet.Point[] => {
      const result: leaflet.Point[] = [];

      result.length = childMarkers.length;

      for (let i = childMarkers.length - 1; i >= 0; i -= 1) {
        const childMarker = childMarkers[i];
        if (childMarker != null) {
          const childCenter = map.latLngToLayerPoint(childMarker.getLatLng());
          result[i] = leaflet.point(childCenter.x, childCenter.y);
        }
      }

      return result;
    };

    return (
      <MarkerClusterGroup
        ref={ref}
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
  }
);

export default MapClusterMarker;
