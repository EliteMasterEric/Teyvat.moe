/* eslint-disable no-fallthrough */
/**
 * This module provides the core state of the application, and the root reducer.
 * It follows the redux-duck convention: https://github.com/erikras/ducks-modular-redux
 */
// import { combineReducers } from 'redux';

import _ from 'lodash';

import { DEFAULT_MAP_PREFERENCES } from '~/components/preferences/DefaultPreferences';
import completedReducer, {
  CLEAR_FEATURE_COMPLETED,
  CLEAR_FEATURE_MARKER_COMPLETED,
  CLEAR_FEATURE_MARKERS_COMPLETED,
  SET_FEATURE_MARKER_COMPLETED,
  SET_FEATURE_MARKERS_COMPLETED,
} from '~/redux/ducks/completed';
import displayedReducer, {
  SET_FEATURE_DISPLAYED,
  SET_ROUTE_DISPLAYED,
} from '~/redux/ducks/displayed';
import uiReducer, {
  SET_CONTROLS_CATEGORY,
  SET_CONTROLS_OPEN,
  SET_CONTROLS_REGION,
  SET_CONTROLS_TAB,
  SET_DEBUG_ENABLED,
  SET_EDITOR_ENABLED,
  SET_EDITOR_HIGHLIGHT,
  SET_POSITION_AND_ZOOM,
  SET_TOAST,
} from '~/redux/ducks/ui';
import optionsReducer, { SET_OPTIONS } from '~/redux/ducks/options';
import editorReducer, {
  APPEND_ELEMENT,
  CLEAR_EDITOR_DATA,
  REMOVE_ELEMENT,
  SET_ELEMENT_PROPERTY,
} from '~/redux/ducks/editor';
import errorReducer, { SET_IMPORT_ERROR } from '~/redux/ducks/error';

// List action types.
/**
 * This action sets one or more attributes of the state directly.
 */
export const SET_STATE = 'genshinmap/prefs/SET_STATE';
/**
 * This action resets the stored state to the default.
 */
export const CLEAR_STATE = 'genshinmap/prefs/CLEAR_STATE';

/**
 * The default state of the application.
 */
export const initialState = _.omit(DEFAULT_MAP_PREFERENCES, []);

/**
 * The state of the application is produced by reducers.
 *
 * The only way to modify the state is to send a signal to the store, known as an action.
 *   When an action is dispatched, the store forwards an action object to the reducer.
 *   The reducer then inspects the type property of the action.
 *   Then, depending on the type, the reducer produces the next state, merging the action payload into the new state.
 *
 * A reducer is a function which takes the current state and an action as arguments.
 *   It then returns a new, modified state as a result.
 *
 * A reducer must be a PURE function.
 *   For a given input state and action, the same resulting state must always be produced.
 */

/**
 * The root reducer.
 *
 * Actions are split into several categories; for each category, the relevant reducer is called.
 *
 * @param {*} state The current state.
 * @param {*} action An action to perform.
 * @returns {*} The modified state.
 */
const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_OPTIONS:
      // Handle options actions here.
      return optionsReducer(state, action);
    case SET_FEATURE_DISPLAYED:
    case SET_ROUTE_DISPLAYED:
      // Handle displayed actions here.
      return displayedReducer(state, action);
    case SET_EDITOR_ENABLED:
    case SET_DEBUG_ENABLED:
    case SET_EDITOR_HIGHLIGHT:
    case SET_POSITION_AND_ZOOM:
    case SET_CONTROLS_TAB:
    case SET_CONTROLS_CATEGORY:
    case SET_CONTROLS_REGION:
    case SET_CONTROLS_OPEN:
    case SET_TOAST:
      // Handle UI actions here.
      return uiReducer(state, action);
    case SET_IMPORT_ERROR:
      return errorReducer(state, action);
    case SET_FEATURE_MARKER_COMPLETED:
    case SET_FEATURE_MARKERS_COMPLETED:
    case CLEAR_FEATURE_COMPLETED:
    case CLEAR_FEATURE_MARKER_COMPLETED:
    case CLEAR_FEATURE_MARKERS_COMPLETED:
      return completedReducer(state, action);
    case CLEAR_EDITOR_DATA:
    case REMOVE_ELEMENT:
    case SET_ELEMENT_PROPERTY:
    case APPEND_ELEMENT:
      return editorReducer(state, action);
    case SET_STATE:
      return {
        ...state,
        ...action.payload,
      };
    case CLEAR_STATE:
      // Reset the mapPreferences.
      return initialState;
    default:
      // @@ actions are built-ins, to be ignored.
      if (!action.type.startsWith('@@')) {
        // If we get to this line, one of our actions wasn't handled.
        console.error(`REDUCER ERROR: Unknown action '${action.type}'`);
      }
  }
  // Fallthrough should return the state passed to it, or the initial state.
  return state;
};

// Export the root reducer as default.
export default rootReducer;

/**
 * The action creators.
 *
 * An action is an object with two properties, type and payload.
 *   The type property drives how the state should change, and is mandatory.
 *   The payload should drive what should change and to what value, and may be optional.
 * As a best practice, actions are created by a factory function rather than directly as an object.
 */

/**
 * Clear the application's internal state and reset it to default.
 * @returns An action to be dispatched.
 */
export const clearMapPreferences = () => {
  return { type: CLEAR_STATE };
};
/**
 * Modify the application's internal state.
 * @param {*} newState An object containing one or more of the attributes to override.
 *   Unspecified attributes will be left with the existing value.
 * @returns An action to be dispatched.
 */
export const setMapPreferences = (newState) => {
  return { type: SET_STATE, payload: newState };
};
