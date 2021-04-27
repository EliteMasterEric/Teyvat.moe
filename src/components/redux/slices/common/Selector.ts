import { CommonState } from './Types';
import initialAppState from 'src/components/redux/InitialState';
import { AppState } from 'src/components/redux/Types';

const selectNamespace = (state: AppState | Partial<AppState> | null): CommonState => {
  return state?.common ?? initialAppState.common;
};
export default selectNamespace;
