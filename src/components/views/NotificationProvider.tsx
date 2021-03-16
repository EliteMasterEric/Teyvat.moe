import _ from 'lodash';
import { OptionsObject, SnackbarKey, SnackbarProvider, useSnackbar } from 'notistack';
import React, { useEffect, useState, ReactNode, ReactElement, FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';

import { AppDispatch } from '~/components/redux';
import {
  removeNotification,
  Notification,
  selectNotifications,
} from '~/components/redux/slices/notify';
import { AppState } from '~/components/redux/types';

/**
 *
 *
 * Not a pure component, keeps an internal list
 * @param notifications The notifications to display.
 */
interface NotificationHandlerProps {
  notifications: Notification[];
  removeNotification: (key: SnackbarKey) => AnyAction;
}
const _NotificationHandler: FunctionComponent<NotificationHandlerProps> = ({
  notifications,
  removeNotification,
}) => {
  /**
   * The functions which link with the NotificationProvider
   * to enqueue and dequeue the notifications.
   */
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  /**
   * The keys of the notifications which have already been enqueued for display.
   */
  const [currentlyDisplayed, setCurrentlyDisplayed] = useState<SnackbarKey[]>([]);

  useEffect(() => {
    const addDisplayed = (key: SnackbarKey) => {
      setCurrentlyDisplayed((previous) => [...previous, key]);
    };
    const removeDisplayed = (key: SnackbarKey) => {
      setCurrentlyDisplayed((previous) =>
        _.filter(previous, (value: SnackbarKey) => value !== key)
      );
    };

    _.forEach(notifications, (notification) => {
      // If this snackbar has been flagged for dismissal, close it.
      if (notification.dismissed) {
        closeSnackbar(notification.options.key);
        return;
      }

      // Skip if we've already displayed this snackbar.
      if (_.includes(currentlyDisplayed, notification.options.key)) return;

      const notificationOptions: OptionsObject = {
        ...notification.options,
        onClose: (event, reason, myKey) => {
          if (notification.options.onClose) {
            notification.options.onClose(event, reason, myKey);
          }
        },
        onExited: () => {
          // The notification has left. We can now remove it from the store.
          removeNotification(notification.options.key);
          removeDisplayed(notification.options.key);
        },
      };

      enqueueSnackbar(notification.message, notificationOptions);
      addDisplayed(notification.options.key);

      // Else, we need to enqueue this snackbar.
    });
  }, [
    notifications,
    currentlyDisplayed,
    setCurrentlyDisplayed,
    enqueueSnackbar,
    closeSnackbar,
    removeNotification,
  ]);

  // Has no actual render presence.
  return null;
};

const mapStateToProps = (state: AppState) => ({
  notifications: selectNotifications(state),
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  removeNotification: (key: SnackbarKey) => dispatch(removeNotification(key)),
});
const NotificationHandler = connect(mapStateToProps, mapDispatchToProps)(_NotificationHandler);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: FunctionComponent<NotificationProviderProps> = ({
  children,
}) => (
  <SnackbarProvider>
    <NotificationHandler />
    {children}
  </SnackbarProvider>
);
