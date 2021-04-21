import {
  CombinedState,
  configureStore,
  ConfigureStoreOptions,
  Dispatch,
  Middleware,
  PreloadedState,
} from '@reduxjs/toolkit';

import { AppAction } from 'src/components/redux/actions';
import fullMiddleware from 'src/components/redux/middleware';

import reducer from 'src/components/redux/slices';
import { name as completed } from 'src/components/redux/slices/completed';
import { name as displayed } from 'src/components/redux/slices/displayed';
import { name as editor } from 'src/components/redux/slices/editor';
import { name as options } from 'src/components/redux/slices/options';

import addWatchers from 'src/components/redux/watchers';
import { NoInfer } from 'ts-toolbelt/out/Function/NoInfer';
import { loadStateFromLocalStorage } from '../preferences/ReduxStore';
import { AppState } from './types';

export const PREFERENCES_PERSISTENT_KEYS: string[] = [
  completed,
  displayed,
  editor,
  options,
  // ui stores info about the current session.
  // notify stores temporary notifications in queue.
];

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
