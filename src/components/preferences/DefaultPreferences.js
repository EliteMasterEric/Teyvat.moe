/**
 * Contains static codes and values,
 */
import L from 'leaflet';

// Center of the map.
export const MAP_CENTER = [-35, 45];

// Zoom levels.
export const MINIMUM_ZOOM = 3;
export const DEFAULT_ZOOM = 4;
export const MAXIMUM_ZOOM = 8;

// Format used to fetch the URL of a tile. z is the zoom level, x and y are the coordinates.
export const TILE_URL = 'tiles/Map_{z}_{x}_{y}.{ext}';

// Observable bounds of the map.
export const MAP_BOUNDS = L.latLngBounds([0, 0], [-66.5, 90]);

/**
 * The data version.
 * Whenever the structure of mapPreferences changes, increment this.
 */
export const GENSHINMAP_DATA_VERSION = 'GM_003';

/**
 * The default locale code if not specified by the browser or by the user.
 */
export const DEFAULT_LOCALE_CODE = 'en';
/**
 * The path, relative to ./data/i18n/, of the default locale code's language file.
 */
export const DEFAULT_LOCALE_FILE = `./${DEFAULT_LOCALE_CODE}.json`;

/**
 * The location to store the application data.
 */
export const LOCAL_STORAGE_KEY = 'genshinmap-preferences';
/**
 * The location to store application data. Replace %COUNTER% with the lowest unused value.
 */
export const LOCAL_STORAGE_KEY_RECOVERY = 'genshinmap-preferences-recovery-%COUNTER%';
/**
 * The prefix used on the data.
 */
export const PREFERENCES_PREFIX = `${GENSHINMAP_DATA_VERSION}~`;
/**
 * The names of the keys which are persistent (stored in local storage).
 * Keys not in this list will be reset to their default values on page load.
 */
export const PERSISTENT_KEYS = ['version', 'options', 'displayed', 'completed', 'editor'];

/**
 * The default preferences stored by the app.
 * Used as a reference for the structure of the internal settings.
 */
export const DEFAULT_MAP_PREFERENCES = {
  /**
   * Store the version; if it's outdated, the app can migrate as necessary.
   */
  version: GENSHINMAP_DATA_VERSION,

  /**
   * Whether the editor is currently enabled.
   * Not saved in local storage.
   */
  editorEnabled: false,
  /**
   * The ID of the marker currently highlighted in the editor.
   * Not saved in local storage.
   */
  editorHighlight: -1,
  /**
   * The current position on the map. Modify this to reorient the map location.
   * Not saved in local storage.
   */
  position: {
    latlng: {
      lat: MAP_CENTER[0], // Default latitude
      lng: MAP_CENTER[1], // Default longitude
    },
    zoom: DEFAULT_ZOOM, // Default zoom level
  },
  /**
   * The current tab of the controls view.
   * Not saved in local storage.
   */
  controlsTab: 'help',
  /**
   * The current category of the controls view.
   */
  controlsCategory: 'special',
  /**
   * The current region of the controls view.
   */
  controlsRegion: 'mondstadt',
  /**
   * Whether the controls drawer is currently open.
   */
  controlsOpen: true,
  /**
   * The text to display on the Import popup for whether an error has occurred.
   */
  importError: '',

  /**
   * The user preferences, as seen in the Options menu.
   */
  options: {
    completedAlpha: 0.5, // Make 'Done' markers transparent.
    clusterMarkers: true,
    worldBorderEnabled: true,
    regionLabelsEnabled: true,
    hideFeaturesInEditor: false,
    hideRoutesInEditor: false,
    overrideLang: '', // Override the current language.
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
   * Store information from the current editor draft.
   */
  editor: {
    feature: {
      name: '',
      category: '',
      region: '',
      data: [],
    },
  },
};
