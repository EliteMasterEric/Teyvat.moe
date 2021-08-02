import _ from 'lodash';
import { REDUX_NAMESPACE_ACHIEVEMENTS } from 'src/components/redux/slices/achievements/Matcher';

export const REDUX_SLICE_OPTIONS = `${REDUX_NAMESPACE_ACHIEVEMENTS}/options` as const;

/**
 * @param actionType The action type.
 * @returns Whether the action is part of this namespace.
 */
export const match = (actionType: string): boolean => {
  return _.startsWith(actionType, REDUX_SLICE_OPTIONS);
};
