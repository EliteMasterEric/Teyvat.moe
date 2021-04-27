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
  ({ position, ...options }, context) => {
    const instance = new LExtendedMarker(position, options);
    return { instance, context: { ...context, overlayContainer: instance } };
  },
  function updateMarker(marker, props, previousProps) {
    if (props.position !== previousProps.position) {
      marker.setLatLng(props.position);
    }
    if (props.icon != null && props.icon !== previousProps.icon) {
      marker.setIcon(props.icon);
    }
    if (props.zIndexOffset != null && props.zIndexOffset !== previousProps.zIndexOffset) {
      marker.setZIndexOffset(props.zIndexOffset);
    }
    if (props.opacity != null && props.opacity !== previousProps.opacity) {
      marker.setOpacity(props.opacity);
    }
    if (marker.dragging != null && props.draggable !== previousProps.draggable) {
      if (props.draggable === true) {
        marker.dragging.enable();
      } else {
        marker.dragging.disable();
      }
    }
    if (props.markerKey !== previousProps.markerKey) {
      marker.setMarkerKey(props.markerKey);
    }
    if (props.completed !== previousProps.completed) {
      marker.setCompleted(props.completed);
    }
  }
);
