import { AuthState } from 'src/components/redux/slices/map/auth/Types';
import { CompletedState } from 'src/components/redux/slices/map/completed/Types';
import { DisplayedState } from 'src/components/redux/slices/map/displayed/Types';
import { EditorState } from 'src/components/redux/slices/map/editor/Types';
import { ErrorState } from 'src/components/redux/slices/map/error/Types';
import { InterfaceState } from 'src/components/redux/slices/map/interface/Types';
import { LoadingState } from 'src/components/redux/slices/map/loading/Types';
import { OptionsState } from 'src/components/redux/slices/map/options/Types';

export type MapState = {
  auth: AuthState;
  completed: CompletedState;
  displayed: DisplayedState;
  editor: EditorState;
  error: ErrorState;
  loading: LoadingState;
  options: OptionsState;
  interface: InterfaceState;
};
