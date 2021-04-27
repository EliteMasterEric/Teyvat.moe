import { createAction } from '@reduxjs/toolkit';
import { REDUX_SLICE_CORE } from './Matcher';
import { AppState } from 'src/components/redux/Types';

/*
 * Create the set of actions.
 * Action names are of the format `teyvatmoe/<namespace>/<slice>/<action>`
 * Set the action type with type generics. Take multiple arguments using a prepare function.
 */
export const setPreferences = createAction<Partial<AppState>>(`${REDUX_SLICE_CORE}/setPreferences`);
export const clearPreferences = createAction(`${REDUX_SLICE_CORE}/clearPreferences`);

export type CoreAction = ReturnType<typeof setPreferences> | ReturnType<typeof clearPreferences>;
