// List action types.

/**
 * This action sets only whether the Editor is enabled.
 */
export const SET_EDITOR_ENABLED = 'genshinmap/ui/SET_EDITOR_ENABLED';
/**
 * This action sets only whether the Debug display is visible.
 */
export const SET_DEBUG_ENABLED = 'genshinmap/ui/SET_DEBUG_ENABLED';
/**
 * This action sets only which marker is highlighted on the editor.
 */
export const SET_EDITOR_HIGHLIGHT = 'genshinmap/ui/SET_EDITOR_HIGHLIGHT';
/**
 * This action sets both the position and zoom level of the map.
 */
export const SET_POSITION_AND_ZOOM = 'genshinmap/ui/SET_POSITION_AND_ZOOM';
/**
 * This action sets the current tab of the map controls.
 */
export const SET_CONTROLS_TAB = 'genshinmap/ui/SET_CONTROLS_TAB';
/**
 * This action sets the current category of the map controls.
 */
export const SET_CONTROLS_CATEGORY = 'genshinmap/ui/SET_CONTROLS_CATEGORY';
/**
 * This action sets the current category of the map controls.
 */
export const SET_CONTROLS_REGION = 'genshinmap/ui/SET_CONTROLS_REGION';
/**
 * This action folds the map controls open or closed.
 */
export const SET_CONTROLS_OPEN = 'genshinmap/ui/SET_CONTROLS_OPEN';
/**
 * This action sets displays a notification in the corner.
 */
export const SET_TOAST = 'genshinmap/ui/SET_TOAST';

/**
 * The reducer.
 * @param {*} state The current state.
 * @param {*} action An action to perform.
 * @returns {*} The modified state.
 */
const uiReducer = (state, action) => {
  switch (action.type) {
    case SET_CONTROLS_TAB:
      return {
        ...state,
        controlsTab: action.payload.tab,
      };
    case SET_CONTROLS_CATEGORY:
      return {
        ...state,
        controlsCategory: action.payload.category,
      };
    case SET_CONTROLS_REGION:
      return {
        ...state,
        controlsRegion: action.payload.region,
      };
    case SET_CONTROLS_OPEN:
      return {
        ...state,
        controlsOpen: action.payload.open,
      };
    case SET_EDITOR_ENABLED:
      // Set whether the Editor is enabled.
      return {
        ...state,
        editorEnabled: action.payload.enabled,
      };
    case SET_DEBUG_ENABLED:
      // Set whether the Editor is enabled.
      return {
        ...state,
        displayDebug: action.payload.enabled,
      };
    case SET_TOAST:
      // Set the displayed notification.
      return {
        ...state,
        currentToast: action.payload,
      };
    case SET_EDITOR_HIGHLIGHT:
      // Set which marker ID is highlighted in the editor.
      return {
        ...state,
        editorHighlight: action.payload.highlight,
      };
    case SET_POSITION_AND_ZOOM:
      return {
        ...state,
        position: {
          latlng: action.payload?.position ?? state.position.latlng,
          zoom: action.payload?.zoom ?? state.position.zoom,
        },
      };
    default:
      console.error(`UI REDUCER ERROR: Unknown action '${action.type}'`);
  }
  // Default to returning the initial state.
  return state;
};

// Export the reducer as default.
export default uiReducer;

// The action creators.
/**
 * Set whether the Editor is enabled.
 * @param {*} enabled The new state of editor visibility.
 * @returns An action to be dispatched.
 */
export const setEditorEnabled = (enabled) => {
  return { type: SET_EDITOR_ENABLED, payload: { enabled } };
};
/**
 * Set whether the Debug display is enabled.
 * @param {*} enabled The new state of debug visibility.
 * @returns An action to be dispatched.
 */
export const setDebugEnabled = (enabled) => {
  return { type: SET_DEBUG_ENABLED, payload: { enabled } };
};
/**
 * Set which marker ID is highlighted in the editor.
 * @param {*} highlight The marker ID to highlight.
 * @returns An action to be dispatched.
 */
export const setEditorHighlight = (highlight) => {
  return { type: SET_EDITOR_HIGHLIGHT, payload: { highlight } };
};
/**
 * Reset the highlight on the marker in the editor.
 * @returns An action to be dispatched.
 */
export const clearEditorHighlight = () => {
  return { type: SET_EDITOR_HIGHLIGHT, payload: { highlight: -1 } };
};
/**
 * Set the visual position of the map.
 * @param {*} position The desired position.
 * @returns An action to be dispatched.
 */
export const setPosition = (position) => {
  return { type: SET_POSITION_AND_ZOOM, payload: { position } };
};
/**
 * Set the zoom level of the map.
 * @param {*} zoom The desired zoom level.
 * @returns An action to be dispatched.
 */
export const setZoom = (zoom) => {
  return { type: SET_POSITION_AND_ZOOM, payload: { zoom } };
};
/**
 * Set both the visual position and the zoom level of the map.
 * @param {*} position The desired position.
 * @param {*} zoom The desired zoom level.
 * @returns An action to be dispatched.
 */
export const setPositionAndZoom = (position, zoom) => {
  return { type: SET_POSITION_AND_ZOOM, payload: { position, zoom } };
};
/**
 * Set the current tab of the Controls pane.
 * @param {*} tab The key of the tab.
 * @returns An action to be dispatched.
 */
export const setControlsTab = (tab) => {
  return { type: SET_CONTROLS_TAB, payload: { tab } };
};
/**
 * Set the current category of the Controls pane.
 * @param {*} category The key of the category.
 * @returns An action to be dispatched.
 */
export const setControlsCategory = (category) => {
  return { type: SET_CONTROLS_CATEGORY, payload: { category } };
};
/**
 * Set the current region of the Controls pane.
 * @param {*} region The key of the region.
 * @returns An action to be dispatched.
 */
export const setControlsRegion = (region) => {
  return { type: SET_CONTROLS_REGION, payload: { region } };
};
/**
 * Set whether the controls pane is folded or not.
 * @param {*} open Whether to open or close.
 * @returns An action to be dispatched.
 */
export const setControlsOpen = (open) => {
  return { type: SET_CONTROLS_OPEN, payload: { open } };
};
/**
 * Display a notification to the user.
 * @param {String} message Text to show.
 * @param {Component} action An optional component used to include user actions.
 *   Not needed for informational popups.
 * @param {Boolean} showClose Whether to display a Close button.
 * @param {Integer} duration Override the duration before the popup auto-hides.
 * @returns An action to be dispatched.
 */
export const setToast = (message, action = null, showClose = true, duration = 6000) => {
  return { type: SET_TOAST, payload: { message, action, showClose, duration } };
};
