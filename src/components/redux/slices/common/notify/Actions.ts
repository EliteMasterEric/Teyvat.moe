import { createAction } from '@reduxjs/toolkit';
import { SnackbarKey } from 'notistack';
import { REDUX_SLICE_NOTIFY } from './Matcher';
import { Notification } from './Types';

/*
 * Create the set of actions.
 * Action names are of the format `teyvatmoe/<namespace>/<slice>/<action>`
 * Set the action type with type generics. Take multiple arguments using a prepare function.
 */
export const enqueueNotification = createAction<Notification>(
  `${REDUX_SLICE_NOTIFY}/enqueueNotification`
);
export const dismissNotification = createAction<SnackbarKey>(
  `${REDUX_SLICE_NOTIFY}/dismissNotification`
);
export const dismissAllNotifications = createAction(
  `${REDUX_SLICE_NOTIFY}/dismissAllNotifications`
);
export const removeNotification = createAction<SnackbarKey>(
  `${REDUX_SLICE_NOTIFY}/removeNotification`
);

export type NotifyAction =
  | ReturnType<typeof enqueueNotification>
  | ReturnType<typeof dismissNotification>
  | ReturnType<typeof dismissAllNotifications>
  | ReturnType<typeof removeNotification>;
