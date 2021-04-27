import { MapState } from './Types';
import initialAppState from 'src/components/redux/InitialState';
import { AppState } from 'src/components/redux/Types';

const selectNamespace = (state: AppState | Partial<AppState> | null): MapState => {
  return state?.map ?? initialAppState.map;
};
export default selectNamespace;
