import { configureStore, Dispatch } from '@reduxjs/toolkit';

import { AppAction } from '~/components/redux/actions';
import fullMiddleware from '~/components/redux/middleware';

import reducer from '~/components/redux/slices';
import completed from '~/components/redux/slices/completed';
import displayed from '~/components/redux/slices/displayed';
import editor from '~/components/redux/slices/editor';
import options from '~/components/redux/slices/options';

import addWatchers from '~/components/redux/watchers';

export const PREFERENCES_PERSISTENT_KEYS: string[] = [
  completed.name,
  displayed.name,
  editor.name,
  options.name,
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
