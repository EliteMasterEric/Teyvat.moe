import _ from 'lodash';
import { REDUX_NAMESPACE_MAP } from 'src/components/redux/slices/map/Matcher';

export const REDUX_SLICE_INTERFACE = `${REDUX_NAMESPACE_MAP}/interface` as const;

/**
 * @param actionType The action type.
 * @returns Whether the action is part of this namespace.
 */
export const match = (actionType: string): boolean => {
  return _.startsWith(actionType, REDUX_SLICE_INTERFACE);
};
