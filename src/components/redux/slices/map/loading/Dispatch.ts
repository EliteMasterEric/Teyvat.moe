import { setLoading } from './Actions';
import { LoadingEnum, LoadingState } from './Types';
import { dispatchAction } from 'src/components/redux/Dispatch';

export const dispatchSetLoading = (loadingKey: keyof LoadingState, newValue: LoadingEnum): void => {
  dispatchAction(setLoading(loadingKey, newValue));
};
