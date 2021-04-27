import { createAction } from '@reduxjs/toolkit';
import { REDUX_SLICE_I18N } from './Matcher';

/*
 * Create the set of actions.
 * Action names are of the format `teyvatmoe/<namespace>/<slice>/<action>`
 * Set the type
 */
export const setLanguage = createAction<string>(`${REDUX_SLICE_I18N}/setLanguage`);

export type I18nAction = ReturnType<typeof setLanguage>;
