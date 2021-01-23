// List action types.

import { DEFAULT_MAP_PREFERENCES } from '~/components/preferences/DefaultPreferences';

/**
 * This action sets a user preference.
 */
export const SET_OPTIONS = 'genshinmap/prefs/SET_OPTIONS';

/**
 * The reducer.
 * @param {*} state The current state.
 * @param {*} action An action to perform.
 * @returns {*} The modified state.
 */
const optionsReducer = (state, action) => {
  switch (action.type) {
    case SET_OPTIONS:
      // Set whether the Editor is enabled.
      return {
        ...state,
        options: {
          ...state.options,
          ...action.payload,
        },
      };
    default:
      console.error(`OPTIONS REDUCER ERROR: Unknown action '${action.type}'`);
  }
  return state;
};

// Export the reducer as default.
export default optionsReducer;

/**
 * Set a specific named option to a specific value.
 * @param {*} key The string name of the key.
 * @param {*} value The desired value.
 * @returns An action to be dispatched.
 */
export const setNamedOption = (key, value = DEFAULT_MAP_PREFERENCES.options[key]) => {
  return { type: SET_OPTIONS, payload: { [key]: value } };
};

/**
 * Set the opacity of complated markers.
 * @param {*} value The desired value.
 * @returns An action to be dispatched.
 */
export const setCompletedAlpha = (value) => {
  return setNamedOption('completedAlpha', value);
};
/**
 * Set whether close markers are clustered together.
 * @param {*} value The desired value.
 * @returns An action to be dispatched.
 */
export const setClusterMarkers = (value) => {
  return setNamedOption('clusterMarkers', value);
};
/**
 * Set whether the world border is visible.
 * @param {*} value The desired value.
 * @returns An action to be dispatched.
 */
export const setWorldBorderEnabled = (value) => {
  return setNamedOption('worldBorderEnabled', value);
};
/**
 * Set whether region labels are visible.
 * @param {*} value The desired value.
 * @returns An action to be dispatched.
 */
export const setRegionLabelsEnabled = (value) => {
  return setNamedOption('regionLabelsEnabled', value);
};
/**
 * Set whether features are hidden while the Editor is enabled.
 * @param {*} value The desired value.
 * @returns An action to be dispatched.
 */
export const setHideFeaturesInEditor = (value) => {
  return setNamedOption('hideFeaturesInEditor', value);
};
/**
 * Set whether routes are hidden while the Editor is enabled.
 * @param {*} value The desired value.
 * @returns An action to be dispatched.
 */
export const setHideRoutesInEditor = (value) => {
  return setNamedOption('hideRoutesInEditor', value);
};
/**
 * Set whether features that are not displayed show in the Summary view.
 * @param {*} value The desired value.
 * @returns An action to be dispatched.
 */
export const setShowHiddenFeatures = (value) => {
  return setNamedOption('showHiddenFeatures', value);
};
/**
 * Set whether to override the displayed language.
 * @param {*} value The desired value.
 * @returns An action to be dispatched.
 */
export const setOverrideLang = (value) => {
  return setNamedOption('overrideLang', value);
};
