import { initialState as i18nInitialState } from 'src/components/redux/slices/common/i18n';
import { I18nState } from 'src/components/redux/slices/common/i18n/Types';
import { initialState as notifyInitialState } from 'src/components/redux/slices/common/notify';
import { NotifyState } from 'src/components/redux/slices/common/notify/Types';

export type CommonState = {
  i18n: I18nState;
  notify: NotifyState;
};

export const initialState: CommonState = {
  i18n: i18nInitialState,
  notify: notifyInitialState,
};

export type AppCommonWatcher = (state: CommonState) => void;
