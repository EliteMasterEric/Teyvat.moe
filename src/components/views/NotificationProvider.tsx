import _ from 'lodash';
import { OptionsObject, SnackbarKey, SnackbarProvider, useSnackbar } from 'notistack';
import React, { useEffect, useState, FunctionComponent } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { removeNotification } from 'src/components/redux/slices/common/notify/Actions';
import { selectNotifications } from 'src/components/redux/slices/common/notify/Selector';
import { AppState } from 'src/components/redux/Types';
import { Empty } from 'src/components/Types';

const mapStateToProps = (state: AppState) => ({
  notifications: selectNotifications(state),
});
const mapDispatchToProps = {
  removeNotification,
};
type NotificationProviderStateProps = ReturnType<typeof mapStateToProps>;
type NotificationProviderDispatchProps = typeof mapDispatchToProps;
const connector = connect<
  NotificationProviderStateProps,
  NotificationProviderDispatchProps,
  Empty,
  AppState
>(mapStateToProps, mapDispatchToProps);
type NotificationHandlerProps = ConnectedProps<typeof connector>;

/**
 * Not a pure component, keeps an internal list
 * @param notifications The notifications to display.
 */
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

      // This notification is invalid.
      if (notification.options.key == null) return;

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
          if (notification.options.key != null) {
            removeNotification(notification.options.key);
            removeDisplayed(notification.options.key);
          }
        },
      };

      // Else, we need to enqueue this snackbar.
      enqueueSnackbar(notification.message, notificationOptions);
      addDisplayed(notification.options.key);
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

const NotificationHandler = connector(_NotificationHandler);

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: FunctionComponent<NotificationProviderProps> = ({
  children,
}) => (
  <SnackbarProvider>
    <NotificationHandler />
    {children}
  </SnackbarProvider>
);
