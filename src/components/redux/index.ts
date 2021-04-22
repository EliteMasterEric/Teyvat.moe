import { CombinedState, configureStore, Dispatch, PreloadedState } from '@reduxjs/toolkit';
import { NoInfer } from 'ts-toolbelt/out/Function/NoInfer';

import { loadStateFromLocalStorage } from 'src/components/preferences/ReduxStore';
import { AppAction } from 'src/components/redux/Actions';
import fullMiddleware from 'src/components/redux/middleware';

import reducer from 'src/components/redux/Reducer';
import { name as completed } from 'src/components/redux/slices/Completed';
import { name as displayed } from 'src/components/redux/slices/Displayed';
import { name as editor } from 'src/components/redux/slices/Editor';
import { name as options } from 'src/components/redux/slices/Options';
import { AppState } from 'src/components/redux/Types';

import addWatchers from 'src/components/redux/watchers';

/**
 * These preferences key should be stored when serializing.
 */
export const PREFERENCES_PERSISTENT_KEYS = [
  completed,
  displayed,
  editor,
  options,
  // ui stores info about the current session.
  // notify stores temporary notifications in queue.
] as const;

/**
 * Initialize a maintained global state, while also configuring Redux Dev Tools for inspection.
 */
const preloadedState = loadStateFromLocalStorage() as PreloadedState<
  CombinedState<NoInfer<AppState>>
>;

export const store = configureStore({
  reducer,
  middleware: fullMiddleware,
  devTools: true,
  // Specify this to restore a previously serialized user session.
  preloadedState,
});

addWatchers(store);

export type AppStore = typeof store;
export type AppDispatch = Dispatch<AppAction>;
