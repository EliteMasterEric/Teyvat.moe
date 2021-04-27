import { AnyAction } from '@reduxjs/toolkit';
import _ from 'lodash';
import { reducer as i18nReducer, selectSliceI18n } from './i18n';
import { reducer as notifyReducer, selectSliceNotify } from './notify';
import { initialState, CommonState } from './Types';

const commonReducer = (
  currentState: CommonState | null = initialState,
  action: AnyAction
): CommonState => ({
  i18n: i18nReducer(selectSliceI18n(currentState), action),
  notify: notifyReducer(selectSliceNotify(currentState), action),
});

export default commonReducer;
