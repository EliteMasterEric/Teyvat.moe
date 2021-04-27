import { createAction, PrepareAction } from '@reduxjs/toolkit';
import { REDUX_SLICE_LOADING } from './Matcher';

import { LoadingEnum, LoadingState, SetLoadingActionPayload } from './Types';

/*
 * When performing additional logic to customize the creation of the action payload,
 * use a prepare callback.
 */
const prepareSetLoading: PrepareAction<SetLoadingActionPayload> = (
  loadingKey: keyof LoadingState,
  newValue: LoadingEnum
) => {
  return { payload: { loadingKey, newValue } };
};

/*
 * Create the set of actions.
 * Action names are of the format `teyvatmoe/<namespace>/<slice>/<action>`
 * Set the action type with type generics. Take multiple arguments using a prepare function.
 */
export const setLoading = createAction(`${REDUX_SLICE_LOADING}/setLoading`, prepareSetLoading);

export type LoadingAction = ReturnType<typeof setLoading>;
