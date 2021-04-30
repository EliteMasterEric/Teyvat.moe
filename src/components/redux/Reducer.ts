import { AnyAction } from '@reduxjs/toolkit';
import _ from 'lodash';
import { AppState } from './Types';
import {
  reducer as commonReducer,
  selectNamespaceCommon,
} from 'src/components/redux/slices/common';
import { reducer as mapReducer, selectNamespaceMap } from 'src/components/redux/slices/map';

const reducer = (currentState: AppState, action: AnyAction): AppState => ({
  common: commonReducer(selectNamespaceCommon(currentState), action),
  map: mapReducer(selectNamespaceMap(currentState), action),
});

export default reducer;
