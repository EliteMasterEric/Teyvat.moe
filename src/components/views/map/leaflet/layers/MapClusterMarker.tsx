/* eslint-disable import/no-named-as-default-member */
import leaflet from 'leaflet';
import 'leaflet.markercluster';

import _ from 'lodash';
import { forwardRef, ReactNode } from 'react';
import { renderToString } from 'react-dom/server';
import { useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';

import { LExtendedMarker } from 'src/components/views/map/leaflet/layers/ExtendedMarker';

export type MapClusterFunction = (zoom: number) => number;

export const offClusterFunction: MapClusterFunction = _.constant(0);

export const variableClusterFunction: MapClusterFunction = (zoom) => {
  // Use variable clustering based on zoom level.
  switch (zoom) {
    case 10:
    case 9:
    case 8:
      return 0;
    case 7:
      return 25;
    case 6:
      return 55;
    case 5:
      return 80;
    case 4:
      return 100;
    default:
      return 0;
  }
};

export const onClusterFunction: MapClusterFunction = _.constant(24);

const createClusterIcon = (cluster: leaflet.MarkerCluster): L.DivIcon => {
  const childMarkers = cluster.getAllChildMarkers() as LExtendedMarker[];
  const childCount = childMarkers.length;
  // Filter by the 'completed' property of each marker.
  const childMarkersCompleted = _.filter(childMarkers, 'completed');
  const childCompletedCount = childMarkersCompleted.length;
  const iconUrl = childMarkers?.[0]?.clusterIconUrl ?? '';

  // Since createClusterIcon is called by Leaflet, we can't use makeStyles.
  // We have to use hard-coded classnames, then define the styles in index.css.
  const iconHTML = renderToString(
    <>
      <img
        className="map-marker-cluster-marker"
        src="/images/icons/marker/marker_blue_bg.svg"
        alt=""
      />
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
  ({ children = null, clusterFunction = offClusterFunction }, reference) => {
    const map = useMap();

    const generateSpiderPoints = (
      _childMarkerCount: number,
      _centerPoint: leaflet.Point,
      childMarkers: leaflet.Marker[]
    ): leaflet.Point[] => {
      const result: leaflet.Point[] = [];

      result.length = childMarkers.length;

      for (let index = childMarkers.length - 1; index >= 0; index -= 1) {
        const childMarker = childMarkers[index];
        if (childMarker != null) {
          const childCenter = map.latLngToLayerPoint(childMarker.getLatLng());
          result[index] = leaflet.point(childCenter.x, childCenter.y);
        }
      }

      return result;
    };

    return (
      <MarkerClusterGroup
        ref={reference}
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
