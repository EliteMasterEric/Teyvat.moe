/**
 * Contains static codes and values,
 */

import { MAP_CENTER, DEFAULT_ZOOM } from '~/components/views/map/LayerConstants';

/**
 * The data version.
 * Whenever the structure of mapPreferences changes, increment this.
 */
export const GENSHINMAP_DATA_VERSION = 'GM_007';

/**
 * The default locale code if not specified by the browser or by the user.
 */
export const DEFAULT_LOCALE_CODE = 'en';

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
   * Not saved in local storage.
   */
  controlsCategory: 'special',
  /**
   * The current region of the controls view.
   * Not saved in local storage.
   */
  controlsRegion: 'mondstadt',
  /**
   * Whether the controls drawer is currently open.
   * Not saved in local storage.
   */
  controlsOpen: true,
  /**
   * Whether the debug display is enabled.
   * Not saved in local storage.
   */
  displayDebug: false,
  /**
   * The text to display on the Import popup for whether an error has occurred.
   * Not saved in local storage.
   */
  importError: '',
  /**
   * The notification to display to the user.
   * Not saved in local storage.
   */
  currentToast: {
    message: '',
    action: null,
    showClose: true,
    duration: 6000,
  },

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
      mondstadtTeleporter: true,
      mondstadtStatue: true,
      mondstadtDomain: true,

      liyueGeoculus: true,
      liyueTeleporter: true,
      liyueStatue: true,
      liyueDomain: true,

      dragonspineCrimsonAgate: true,
      dragonspineTeleporter: true,
      dragonspineStatue: true,
      dragonspineDomain: true,
    },
    routes: {},
  },
  /**
   * Store of completed markers.
   * Each key is the internal name of the feature,
   * and each value is an array of marker IDs marked as completed.
   */
  completed: {
    features: {},
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
