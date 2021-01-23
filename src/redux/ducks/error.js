/**
 * This action sets error text to display on the Import popup.
 */
export const SET_IMPORT_ERROR = 'genshinmap/editor/SET_IMPORT_ERROR';

/**
 * The reducer.
 * @param {*} state The current state.
 * @param {*} action An action to perform.
 * @returns {*} The modified state.
 */
const errorReducer = (state, action) => {
  switch (action.type) {
    case SET_IMPORT_ERROR:
      return {
        ...state,
        importError: action.payload.value,
      };
    default:
      console.error(`IMPORTERROR REDUCER ERROR: Unknown action '${action.type}'`);
  }
  // Default to returning the initial state.
  return state;
};

// Export the reducer as default.
export default errorReducer;

export const displayImportError = (errorString) => {
  return {
    type: SET_IMPORT_ERROR,
    payload: {
      value: errorString,
    },
  };
};
export const clearImportError = () => {
  return {
    type: SET_IMPORT_ERROR,
    payload: {
      value: '',
    },
  };
};
