import { createAction } from '@reduxjs/toolkit';
import { REDUX_SLICE_ERROR } from './Matcher';
import { LocalizedString } from 'src/components/Types';

/*
 * Create the set of actions.
 * Action names are of the format `teyvatmoe/<namespace>/<slice>/<action>`
 * Set the action type with type generics. Take multiple arguments using a prepare function.
 */
export const setImportError = createAction<LocalizedString>(`${REDUX_SLICE_ERROR}/setImportError`);
export const clearImportError = createAction(`${REDUX_SLICE_ERROR}/clearImportError`);
export const clearErrors = createAction(`${REDUX_SLICE_ERROR}/clearErrors`);

export type ErrorAction =
  | ReturnType<typeof setImportError>
  | ReturnType<typeof clearImportError>
  | ReturnType<typeof clearErrors>;
