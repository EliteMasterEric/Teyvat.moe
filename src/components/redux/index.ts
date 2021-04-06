import { configureStore, Dispatch } from '@reduxjs/toolkit';

import { AppAction } from 'src/components/redux/actions';
import fullMiddleware from 'src/components/redux/middleware';

import reducer from 'src/components/redux/slices';
import completed from 'src/components/redux/slices/completed';
import displayed from 'src/components/redux/slices/displayed';
import editor from 'src/components/redux/slices/editor';
import options from 'src/components/redux/slices/options';

import addWatchers from 'src/components/redux/watchers';

export const PREFERENCES_PERSISTENT_KEYS: string[] = [
  completed.name,
  displayed.name,
  editor.name,
  options.name,
  // ui stores info about the current session.
  // notify stores temporary notifications in queue.
];
export const CREDENTIALS_PERSISTENT_KEYS: string[] = [];

/**
 * Initialize a maintained global state, while also configuring Redux Dev Tools for inspection.
 */
export const store = configureStore({
  reducer,
  middleware: fullMiddleware,
  devTools: true,
});

addWatchers(store);

export type AppStore = typeof store;
export type AppDispatch = Dispatch<AppAction>;
