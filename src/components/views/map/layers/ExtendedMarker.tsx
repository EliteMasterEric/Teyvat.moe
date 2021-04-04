import { createLayerComponent } from '@react-leaflet/core';
import { Marker as LeafletMarker, MarkerOptions as LeafletMarkerOptions } from 'leaflet';
import { MarkerProps } from 'react-leaflet';

interface LExtendedMarkerOptions extends LeafletMarkerOptions {
  clusterIconUrl: string;
  completed: boolean;
  markerKey: string;
}

export class LExtendedMarker extends LeafletMarker {
  clusterIconUrl: string;
  completed: boolean;
  markerKey: string;

  constructor(latlng: L.LatLngExpression, options?: LExtendedMarkerOptions) {
    super(latlng, options);
    this.clusterIconUrl = options?.clusterIconUrl ?? '';
    this.completed = options?.completed ?? false;
    this.markerKey = options?.markerKey ?? '';
  }

  setMarkerKey(markerKey: string): void {
    this.markerKey = markerKey;
  }

  setCompleted(completed: boolean): void {
    this.completed = completed;
  }
}

interface ExtendedMarkerProps extends MarkerProps {
  clusterIconUrl: string;
  completed: boolean;
  markerKey: string;
}

export const ExtendedMarker = createLayerComponent<LExtendedMarker, ExtendedMarkerProps>(
  ({ position, ...options }, ctx) => {
    const instance = new LExtendedMarker(position, options);
    return { instance, context: { ...ctx, overlayContainer: instance } };
  },
  function updateMarker(marker, props, prevProps) {
    if (props.position !== prevProps.position) {
      marker.setLatLng(props.position);
    }
    if (props.icon != null && props.icon !== prevProps.icon) {
      marker.setIcon(props.icon);
    }
    if (props.zIndexOffset != null && props.zIndexOffset !== prevProps.zIndexOffset) {
      marker.setZIndexOffset(props.zIndexOffset);
    }
    if (props.opacity != null && props.opacity !== prevProps.opacity) {
      marker.setOpacity(props.opacity);
    }
    if (marker.dragging != null && props.draggable !== prevProps.draggable) {
      if (props.draggable === true) {
        marker.dragging.enable();
      } else {
        marker.dragging.disable();
      }
    }
    if (props.markerKey !== prevProps.markerKey) {
      marker.setMarkerKey(props.markerKey);
    }
    if (props.completed !== prevProps.completed) {
      marker.setCompleted(props.completed);
    }
  }
);
