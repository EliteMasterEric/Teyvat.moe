import _ from 'lodash';
import initialState from './InitialState';
import { NotifyState } from './Types';
import selectNamespace from 'src/components/redux/slices/common/Selector';
import { CommonState } from 'src/components/redux/slices/common/Types';

import { AppState } from 'src/components/redux/Types';

/**
 * Convenience function to retrieve a given value from the root state.
 * @param state
 */
export const selectNotifications = (state: AppState): NotifyState['notifications'] =>
  selectSlice(selectNamespace(state)).notifications;

const selectSlice = (state: CommonState | null): NotifyState => {
  return state?.notify ?? initialState;
};
export default selectSlice;
