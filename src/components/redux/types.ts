import {
  CompletedState,
  initialState as completedInitialState,
} from '~/components/redux/slices/completed';
import {
  DisplayedState,
  initialState as displayedInitialState,
} from '~/components/redux/slices/displayed';
import { EditorState, initialState as editorInitialState } from '~/components/redux/slices/editor';
import { ErrorState, initialState as errorInitialState } from '~/components/redux/slices/error';
import { NotifyState, initialState as notifyInitialState } from '~/components/redux/slices/notify';
import {
  OptionsState,
  initialState as optionsInitialState,
} from '~/components/redux/slices/options';
import { UIState, initialState as uiInitialState } from '~/components/redux/slices/ui';

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
