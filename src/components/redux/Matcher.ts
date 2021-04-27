import _ from 'lodash';

export const REDUX_APP = 'teyvat.moe' as const;

/**
 * @param actionType The action type.
 * @returns Whether the action is part of this namespace.
 */
export const match = (actionType: string): boolean => {
  return _.startsWith(actionType, REDUX_APP);
};
