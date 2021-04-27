import { MapState } from './Types';
import { initialState as authInitialState } from 'src/components/redux/slices/map/auth';
import { initialState as completedInitialState } from 'src/components/redux/slices/map/completed';
import { initialState as displayedInitialState } from 'src/components/redux/slices/map/displayed';
import { initialState as editorInitialState } from 'src/components/redux/slices/map/editor';
import { initialState as errorInitialState } from 'src/components/redux/slices/map/error';
import { initialState as interfaceInitialState } from 'src/components/redux/slices/map/interface';
import { initialState as loadingInitialState } from 'src/components/redux/slices/map/loading';
import { initialState as optionsInitialState } from 'src/components/redux/slices/map/options';

const initialState: MapState = {
  auth: authInitialState,
  completed: completedInitialState,
  displayed: displayedInitialState,
  editor: editorInitialState,
  error: errorInitialState,
  loading: loadingInitialState,
  options: optionsInitialState,
  interface: interfaceInitialState,
};

export default initialState;
