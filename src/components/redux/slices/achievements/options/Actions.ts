import { createAction } from '@reduxjs/toolkit';
import { REDUX_SLICE_OPTIONS } from './Matcher';

/*
 * Create the set of actions.
 * Action names are of the format `teyvatmoe/<namespace>/<slice>/<action>`
 * Set the action type with type generics. Take multiple arguments using a prepare function.
 */
export const setShowHiddenAchievements = createAction<boolean>(
  `${REDUX_SLICE_OPTIONS}/setShowHiddenAchievements`
);

export type OptionsAction = ReturnType<typeof setShowHiddenAchievements>;
