import {
  CompletedState,
  initialState as completedInitialState,
} from 'src/components/redux/slices/Completed';
import {
  DisplayedState,
  initialState as displayedInitialState,
} from 'src/components/redux/slices/Displayed';
import {
  EditorState,
  initialState as editorInitialState,
} from 'src/components/redux/slices/Editor';
import { ErrorState, initialState as errorInitialState } from 'src/components/redux/slices/Error';
import { UIState, initialState as uiInitialState } from 'src/components/redux/slices/Interface';
import {
  NotifyState,
  initialState as notifyInitialState,
} from 'src/components/redux/slices/Notify';
import {
  OptionsState,
  initialState as optionsInitialState,
} from 'src/components/redux/slices/Options';

export type AuthGoogleProfile = {
  googleId: string;
  imageUrl: string;
  email: string;
  name: string;
  givenName: string;
  familyName: string;
};

export type AppState = {
  completed: CompletedState;
  displayed: DisplayedState;
  editor: EditorState;
  error: ErrorState;
  notify: NotifyState;
  options: OptionsState;
  ui: UIState;
};

export const initialState: AppState = {
  completed: completedInitialState,
  displayed: displayedInitialState,
  editor: editorInitialState,
  error: errorInitialState,
  notify: notifyInitialState,
  options: optionsInitialState,
  ui: uiInitialState,
};

export type AppWatcher = (state: AppState) => void;
