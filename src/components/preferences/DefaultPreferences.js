/**
 * Contains static codes and values,
 */
import { DEFAULT_ZOOM, MAP_CENTER } from '../map/EditorMap';

// The data version.
// Whenever the structure of mapPreferences changes, increment this.
export const GENSHINMAP_DATA_VERSION = 'GM_001';

// The location to store the application data.
export const LOCAL_STORAGE_KEY = 'genshinmap-preferences';
// The location to store application data. Replace %COUNTER% with the lowest unused value.
export const LOCAL_STORAGE_KEY_RECOVERY = 'genshinmap-preferences-recovery-%COUNTER%';
// The prefix used on the data.
export const PREFERENCES_PREFIX = `${GENSHINMAP_DATA_VERSION}~`;

/**
 * The default preferences stored by the app.
 * Used as a reference for the structure of the internal settings.
 */
export const DEFAULT_MAP_PREFERENCES = {
  /**
   * Store the version; if it's outdated, the app can migrate as necessary.
   */
  version: GENSHINMAP_DATA_VERSION,

  options: {
    completedAlpha: 0.5, // Make 'Done' markers transparent.
    clusterMarkers: true,
    worldBorderEnabled: true,
    regionLabelsEnabled: true,
  },

  /**
   * Store of currently displayed marker layers.
   * Each key is the internal name of the feature,
   * and each value is a boolean for whether it is currently displayed.
   */
  displayed: {
    features: {
      // These features will be displayed to new users when they first open the site.
      mondstadtAnemoculus: true,
      liyueGeoculus: true,

      mondstadtTeleporter: true,
      mondstadtStatue: true,
      mondstadtDomain: true,

      liyueTeleporter: true,
      liyueStatue: true,
      liyueDomain: true,
    },
    routes: {},
  },

  /**
   * Store of completed markers.
   * Each key is the internal name of the feature,
   * and each value is an array of marker IDs marked as completed.
   */
  completed: {
    features: {
      mondstadtAnemoculus: {},
      liyueGeoculus: {},
    },
  },

  /**
   * The current position on the map.
   * Modify this to reorient the map location.
   */
  position: {
    latlng: {
      lat: MAP_CENTER[0], // Default latitude
      lng: MAP_CENTER[1], // Default longitude
    },
    zoom: DEFAULT_ZOOM, // Default zoom level
  },

  /**
   * Store information from the last editor draft.
   */
  editor: {
    enabled: false,

    highlighted: -1,

    feature: {
      data: [],
    },
  },
};
