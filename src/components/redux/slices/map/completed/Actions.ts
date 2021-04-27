import { createAction, PrepareAction } from '@reduxjs/toolkit';
import { REDUX_SLICE_COMPLETED } from './Matcher';
import { MarkerCompletedActionPayload, MarkersCompletedActionPayload } from './Types';
import { MSFFeatureKey, MSFMarkerKey } from 'src/components/data/map/Element';
import { getUnixTimestamp } from 'src/components/util';

/*
 * When performing additional logic to customize the creation of the action payload,
 * use a prepare callback.
 */
const prepareSetMarkerCompleted: PrepareAction<MarkerCompletedActionPayload> = (
  key: MSFMarkerKey
) => {
  return { payload: { key, timestamp: getUnixTimestamp() } };
};
const prepareSetMarkersCompleted: PrepareAction<MarkersCompletedActionPayload> = (
  keys: MSFMarkerKey[]
) => {
  return { payload: { keys, timestamp: getUnixTimestamp() } };
};

/*
 * Create the set of actions.
 * Action names are of the format `teyvatmoe/<namespace>/<slice>/<action>`
 * Set the action type with type generics. Take multiple arguments using a prepare function.
 */
export const setMarkerCompleted = createAction(
  `${REDUX_SLICE_COMPLETED}/setMarkerCompleted`,
  prepareSetMarkerCompleted
);
export const setMarkersCompleted = createAction(
  `${REDUX_SLICE_COMPLETED}/setMarkersCompleted`,
  prepareSetMarkersCompleted
);
export const clearMarkerCompleted = createAction<MSFMarkerKey>(
  `${REDUX_SLICE_COMPLETED}/clearMarkerCompleted`
);
export const clearMarkersCompleted = createAction<MSFMarkerKey[]>(
  `${REDUX_SLICE_COMPLETED}/clearMarkersCompleted`
);
export const clearFeatureCompleted = createAction<MSFFeatureKey>(
  `${REDUX_SLICE_COMPLETED}/clearFeatureCompleted`
);

export type CompletedAction =
  | ReturnType<typeof setMarkerCompleted>
  | ReturnType<typeof setMarkersCompleted>
  | ReturnType<typeof clearMarkerCompleted>
  | ReturnType<typeof clearMarkersCompleted>
  | ReturnType<typeof clearFeatureCompleted>;
