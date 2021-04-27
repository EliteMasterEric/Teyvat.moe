import { createAction } from '@reduxjs/toolkit';
import { REDUX_SLICE_AUTH } from './Matcher';
import { AuthGoogleProfile } from './Types';

/*
 * Create the set of actions.
 * Action names are of the format `teyvatmoe/<namespace>/<slice>/<action>`
 * Set the action type with type generics. Take multiple arguments using a prepare function.
 */
export const disableGoogleAuth = createAction(`${REDUX_SLICE_AUTH}/disableGoogleAuth`);
export const setGoogleAuthProfile = createAction<AuthGoogleProfile | null>(
  `${REDUX_SLICE_AUTH}/setGoogleAuthProfile`
);
export const initializeGoogleClient = createAction(`${REDUX_SLICE_AUTH}/initializeGoogleClient`);
export const setGoogleClientInProgress = createAction<boolean>(
  `${REDUX_SLICE_AUTH}/setGoogleClientInProgress`
);

export type AuthAction =
  | ReturnType<typeof disableGoogleAuth>
  | ReturnType<typeof setGoogleAuthProfile>
  | ReturnType<typeof initializeGoogleClient>
  | ReturnType<typeof setGoogleClientInProgress>;
