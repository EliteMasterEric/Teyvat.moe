// List action types.
import _ from 'lodash';

import { DEFAULT_MAP_PREFERENCES } from '~/components/preferences/DefaultPreferences';

/**
 * This action clears the data for the current editor feature.
 */
export const CLEAR_EDITOR_DATA = 'genshinmap/editor/CLEAR_EDITOR_DATA';
/**
 * This action sets removes a given element (marker or route) from the list.
 */
export const REMOVE_ELEMENT = 'genshinmap/editor/REMOVE_ELEMENT';
/**
 * This action sets a property (given by a named path) for a given element (marker or route) to a given value.
 */
export const SET_ELEMENT_PROPERTY = 'genshinmap/editor/SET_ELEMENT_PROPERTY';
/**
 * This action adds a new element to the editor list..
 */
export const APPEND_ELEMENT = 'genshinmap/editor/APPEND_ELEMENT';

/**
 * The reducer.
 * @param {*} state The current state.
 * @param {*} action An action to perform.
 * @returns {*} The modified state.
 */
const editorReducer = (state, action) => {
  switch (action.type) {
    case CLEAR_EDITOR_DATA:
      return {
        ...state,
        editor: DEFAULT_MAP_PREFERENCES.editor,
      };
    case REMOVE_ELEMENT:
      const elementToRemove = action.payload.element;
      const trimedEditorData = _.difference(state.editor.feature.data, [elementToRemove]);
      return {
        ...state,
        editor: {
          ...state.editor,
          feature: {
            ...state.editor.feature,
            data: trimedEditorData,
          },
        },
      };
    case APPEND_ELEMENT:
      return {
        ...state,
        editor: {
          ...state.editor,
          feature: {
            ...state.editor.feature,
            data: [...state.editor.feature.data, action.payload.element],
          },
        },
      };
    case SET_ELEMENT_PROPERTY:
      const editedEditorData = state.editor.feature.data.map((element) => {
        if (element.id === action.payload.id) {
          // Set a property. 'popupTitle.en' can set `popupTitle: { en: value }`
          return _.set(element, action.payload.propertyPath, action.payload.value);
        }
        // Not the element to edit.
        return element;
      });
      return {
        ...state,
        editor: {
          ...state.editor,
          feature: {
            ...state.editor.feature,
            data: editedEditorData,
          },
        },
      };
    default:
      console.error(`EDITOR REDUCER ERROR: Unknown action '${action.type}'`);
  }
  // Default to returning the initial state.
  return state;
};

// Export the reducer as default.
export default editorReducer;

// The action creators.
/**
 * Clears the current editor's feature data.
 * @returns An action to be dispatched.
 */
export const clearEditorData = () => {
  return { type: CLEAR_EDITOR_DATA };
};
/**
 * Set the property of an editor element.
 * @param {*} originalElement
 * @param {*} propertyPath
 * @param {*} value
 * @returns An action to be dispatched.
 */
export const setElementProperty = (elementId, propertyPath, value) => {
  return { type: SET_ELEMENT_PROPERTY, payload: { id: elementId, propertyPath, value } };
};
/**
 * Remove an editor element.
 * @param {*} element
 * @returns An action to be dispatched.
 */
export const removeElement = (element) => {
  return { type: REMOVE_ELEMENT, payload: { element } };
};
/**
 * Remove an editor element.
 * @param {*} element
 * @returns An action to be dispatched.
 */
export const appendElement = (element) => {
  return { type: APPEND_ELEMENT, payload: { element } };
};
