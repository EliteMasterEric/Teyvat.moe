import { LatLngExpression } from 'leaflet';
import {
  MSFMarkerID,
  MSFMarkerKey,
  MSFRouteID,
  MSFRouteKey,
} from 'src/components/data/map/Element';
import { MapCategoryKey } from 'src/components/data/map/MapCategories';
import { MapRegionKey } from 'src/components/data/map/MapRegions';
import { UIControlsTab, MapPosition, LocalizedString } from 'src/components/Types';

export type InterfaceState = {
  tab: UIControlsTab;
  mapCategory: MapCategoryKey;
  mapRegion: MapRegionKey;

  /**
   * Whether the map controls are open or collapsed.
   */
  open: boolean;
  /**
   * The marker or route with this ID will have a different color.
   */
  mapHighlight: MSFMarkerID | MSFRouteID | null;
  // When the user moves on the map, this value should be updated.
  // Likewise, when this value updates, smoothly move the user on the map.
  // Allows for repositioning on the map by updating the state.
  mapPosition: MapPosition;
  /**
   * Whether to show the editor tools.
   */
  editorEnabled: boolean;
  /**
   * Whether to show the editor debug window.
   */
  editorDebugEnabled: boolean;

  /**
   * TODO: Transition from one-popup-per-marker to a single popup,
   * which is hidden when closed, and is re-used when selecting other markers.
   * This saves on performance.
   */
  mapPopup?: {
    /**
     * The position for the popup to display in.
     */
    position: LatLngExpression;

    /**
     * The type of the current marker.
     */
    elementType: 'marker' | 'route';
    /**
     * The ID of the current marker.
     */
    currentElementId: MSFMarkerKey | MSFRouteKey;

    /**
     * If completed, the value is the Unix timestamp.
     * Otherwise, it is false.
     */
    completed: false | number;

    /**
     * Set the popup's title.
     */
    popupTitle: LocalizedString;
    /**
     * Set the popup's content.
     */
    popupContent: LocalizedString;
    /**
     * Set the popup's media (an image or YouTube video).
     */
    popupMedia: string;
  };

  mapStats: {
    markerCount: number | null;
    routeCount: number | null;
  };

  permalinkId: string | null;
};
