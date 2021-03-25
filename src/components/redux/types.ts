import {
  CompletedState,
  initialState as completedInitialState,
} from 'src/components/redux/slices/completed';
import {
  DisplayedState,
  initialState as displayedInitialState,
} from 'src/components/redux/slices/displayed';
import {
  EditorState,
  initialState as editorInitialState,
} from 'src/components/redux/slices/editor';
import { ErrorState, initialState as errorInitialState } from 'src/components/redux/slices/error';
import {
  NotifyState,
  initialState as notifyInitialState,
} from 'src/components/redux/slices/notify';
import {
  OptionsState,
  initialState as optionsInitialState,
} from 'src/components/redux/slices/options';
import { UIState, initialState as uiInitialState } from 'src/components/redux/slices/ui';

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
