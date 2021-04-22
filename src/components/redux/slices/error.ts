/**
 * Handles the section of the state that stores the transient state
 * of the user interface, such as current tab or map position.
 */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { clearPreferences, setPreferences } from 'src/components/redux/Actions';
import { AppState } from 'src/components/redux/Types';
import { LocalizedString } from 'src/components/Types';

export type ErrorState = {
  importError: string | null;
};

// Define the initial state
export const initialState: ErrorState = {
  importError: null,
};

// Define a type using that initial state.

export const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    // ImmerJS allows you to change the state by modifying state parameter object.
    // This provides automatic state merging.
    setImportError: (state, action: PayloadAction<LocalizedString>) => {
      state.importError = action.payload;
    },
    clearImportError: (state) => {
      state.importError = initialState.importError;
    },
    clearErrors: () => {
      //For Immer specifically, you can either mutate the contents
      // of the Proxy-wrapped state value as long as it's an object or array,
      // or you can return an entirely new value, but not both at once.

      return initialState;
    },
  },
  extraReducers: {
    [setPreferences.toString()]: (state, action: PayloadAction<Partial<AppState>>) => {
      return {
        ...state,
        ...action.payload.error,
      };
    },
    [clearPreferences.toString()]: () => {
      // Reset to the default state.
      return initialState;
    },
  },
});

export const name = errorSlice.name;

export const { setImportError, clearImportError, clearErrors } = errorSlice.actions;

/**
 * Convenience functions to retrieve a given value from the root state.
 */
export const selectImportError = (state: AppState): string | null => state.error.importError;

export default errorSlice.reducer;
