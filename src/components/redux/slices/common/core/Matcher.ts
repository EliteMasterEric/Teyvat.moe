import _ from 'lodash';
import { REDUX_NAMESPACE_COMMON } from 'src/components/redux/slices/common/Matcher';

export const REDUX_SLICE_CORE = `${REDUX_NAMESPACE_COMMON}/core` as const;

/**
 * @param actionType The action type.
 * @returns Whether the action is part of this namespace.
 */
export const match = (actionType: string): boolean => {
  return _.startsWith(actionType, REDUX_SLICE_CORE);
};
