import { SnackbarKey } from 'notistack';
import {
  dismissAllNotifications,
  dismissNotification,
  enqueueNotification,
  removeNotification,
} from './Actions';
import { Notification } from './Types';
import { dispatchAction } from 'src/components/redux/Dispatch';
import { LocalizedString } from 'src/components/Types';

export const dispatchEnqueueNotification = (notification: Notification): void => {
  dispatchAction(enqueueNotification(notification));
};
export const dispatchDismissNotification = (snackbarKey: SnackbarKey): void => {
  dispatchAction(dismissNotification(snackbarKey));
};
export const dispatchDismissAllNotifications = (): void => {
  dispatchAction(dismissAllNotifications());
};
export const dispatchRemoveNotification = (snackbarKey: SnackbarKey): void => {
  dispatchAction(removeNotification(snackbarKey));
};

export const sendNotification = (
  message: LocalizedString,
  options?: Partial<Notification['options']>
): void => {
  dispatchEnqueueNotification(buildNotification(message, options));
};

export const buildNotification = (
  message: LocalizedString,
  options?: Partial<Notification['options']>
): Notification => {
  return {
    dismissed: false,
    message,
    options: {
      key: Date.now() + Math.random(),
      persist: false,
      preventDuplicate: false,
      variant: 'default',
      action: null, // Action must be a valid react node.
      ...options,
    },
  };
};
