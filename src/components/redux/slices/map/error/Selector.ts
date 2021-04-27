import _ from 'lodash';
import initialState from './InitialState';
import { ErrorState } from './Types';
import selectNamespace from 'src/components/redux/slices/map/Selector';
import { MapState } from 'src/components/redux/slices/map/Types';
import { AppState } from 'src/components/redux/Types';

export const selectImportError = (state: AppState): string | null =>
  selectSlice(selectNamespace(state))?.importError;

const selectSlice = (state: MapState | null): ErrorState => {
  return state?.error ?? initialState;
};
export default selectSlice;
