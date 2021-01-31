import store from '~/redux';

import { setToast as setToastCreator } from '~/redux/ducks/ui';

export const setToast = (message, action = null, showClose = true, duration = 6000) => {
  store.dispatch(setToastCreator(message, action, showClose, duration));
};
