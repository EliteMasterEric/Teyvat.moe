import { createAction } from '@reduxjs/toolkit';

import { GenshinMapPreferencesLatest } from 'src/components/preferences/PreferencesSchema';
import { completedSlice } from 'src/components/redux/slices/completed';
import { displayedSlice } from 'src/components/redux/slices/displayed';
import { editorSlice } from 'src/components/redux/slices/editor';
import { notifySlice } from 'src/components/redux/slices/notify';
import { optionsSlice } from 'src/components/redux/slices/options';
import { uiSlice } from 'src/components/redux/slices/ui';

export const setPreferences = createAction<GenshinMapPreferencesLatest>(
  'genshinmap/core/SET_PREFERENCES'
);
export const clearPreferences = createAction('genshinmap/core/CLEAR_PREFERENCES');

type SliceActions<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => infer A ? A : never;
}[keyof T];

export type MiscAction = ReturnType<typeof clearPreferences> | ReturnType<typeof setPreferences>;

export type CompletedAction = SliceActions<typeof completedSlice.actions>;
export type DisplayedAction = SliceActions<typeof displayedSlice.actions>;
export type EditorAction = SliceActions<typeof editorSlice.actions>;
export type NotifyAction = SliceActions<typeof notifySlice.actions>;
export type OptionsAction = SliceActions<typeof optionsSlice.actions>;
export type UIAction = SliceActions<typeof uiSlice.actions>;

export type AppAction =
  | MiscAction
  | CompletedAction
  | DisplayedAction
  | EditorAction
  | NotifyAction
  | OptionsAction
  | UIAction;
