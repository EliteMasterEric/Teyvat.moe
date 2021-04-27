import _ from 'lodash';
import initialState from './InitialState';
import { LoadingEnum, LoadingState } from './Types';
import selectNamespace from 'src/components/redux/slices/map/Selector';
import { MapState } from 'src/components/redux/slices/map/Types';
import { AppState } from 'src/components/redux/Types';
import { getKeys } from 'src/components/util';

export const selectLoading = (state: AppState, loadingKey: keyof LoadingState): LoadingEnum =>
  selectSlice(selectNamespace(state))?.[loadingKey] ?? false;

export const selectCurrentLoadingTasks = (state: AppState): Array<keyof LoadingState> => {
  const loadingState = selectSlice(selectNamespace(state));
  return _.filter(getKeys(loadingState), (key) => loadingState[key] === 'progress');
};

export const selectFullyLoaded = (state: AppState): boolean => {
  return _.every(
    _.values(selectSlice(selectNamespace(state))),
    (value) => value === true || value === 'skip'
  );
};

const selectSlice = (state: MapState | null): LoadingState => {
  return state?.loading ?? initialState;
};
export default selectSlice;
