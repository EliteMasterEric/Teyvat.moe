import _ from 'lodash';
import initialState from './InitialState';
import { I18nState } from './Types';
import selectNamespace from 'src/components/redux/slices/common/Selector';
import { CommonState } from 'src/components/redux/slices/common/Types';

import { AppState } from 'src/components/redux/Types';

/**
 * Convenience function to retrieve a given value from the root state.
 * @param state
 */
export const selectCurrentLanguage = (state: AppState): string => {
  return selectSlice(selectNamespace(state))?.currentLanguage;
};

const selectSlice = (state: CommonState | null): I18nState => {
  return state?.i18n ?? initialState;
};
export default selectSlice;
