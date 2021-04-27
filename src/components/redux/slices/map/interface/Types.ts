import { MSFMarkerID, MSFRouteID } from 'src/components/data/map/Element';
import { MapCategoryKey } from 'src/components/data/map/MapCategories';
import { MapRegionKey } from 'src/components/data/map/MapRegions';
import { UIControlsTab, MapPosition } from 'src/components/Types';

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

  mapStats: {
    markerCount: number | null;
    routeCount: number | null;
  };

  permalinkId: string | null;
};
