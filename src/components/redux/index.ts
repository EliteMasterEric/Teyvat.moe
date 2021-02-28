import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import fullMiddleware from '~/components/redux/middleware';
import completed from '~/components/redux/slices/completed';
import displayed from '~/components/redux/slices/displayed';
import editor from '~/components/redux/slices/editor';
import notify from '~/components/redux/slices/notify';
import options from '~/components/redux/slices/options';
import ui from '~/components/redux/slices/ui';
import { AppState } from '~/components/redux/types';
import addWatchers from '~/components/redux/watchers';

export const PERSISTENT_KEYS = [completed.name, displayed.name, editor.name, options.name];

/**
 * Initialize a maintained global state, while also configuring Redux Dev Tools for inspection.
 */
export const store = configureStore({
  reducer: {
    completed,
    displayed,
    editor,
    notify,
    options,
    ui,
  },
  middleware: fullMiddleware,
  devTools: true,
});

addWatchers(store);

export type AppStore = typeof store;
export type AppDispatch = typeof store.dispatch;

// Utilize special typed Redux hooks to enable TypeScript checking.
export const useAppDispatch = (): void => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
