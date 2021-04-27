import { AuthAction } from 'src/components/redux/slices/map/auth/Actions';
import { CompletedAction } from 'src/components/redux/slices/map/completed/Actions';
import { DisplayedAction } from 'src/components/redux/slices/map/displayed/Actions';
import { EditorAction } from 'src/components/redux/slices/map/editor/Actions';
import { ErrorAction } from 'src/components/redux/slices/map/error/Actions';
import { InterfaceAction } from 'src/components/redux/slices/map/interface/Actions';
import { LoadingAction } from 'src/components/redux/slices/map/loading/Actions';
import { OptionsAction } from 'src/components/redux/slices/map/options/Actions';

export type MapAction =
  | AuthAction
  | CompletedAction
  | DisplayedAction
  | EditorAction
  | ErrorAction
  | InterfaceAction
  | LoadingAction
  | OptionsAction;
