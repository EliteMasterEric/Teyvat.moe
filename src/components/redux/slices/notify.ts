/**
 * Handles the section of the state that powers the toast notifications.
 */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';
import { OptionsObject, SnackbarKey } from 'notistack';

import { LocalizedString } from '~/components/Types';
import { CLEAR_PREFERENCES } from '~/components/redux/actions';
import { AppState } from '~/components/redux/types';

interface NotificationOptions extends OptionsObject {
  // Override a mutability issue.
  defaultValue?: string | number | string[];
}

export interface Notification {
  // Set this value to true to tell the Notification handler to
  // use the dismissal animation.
  dismissed: boolean;
  // The message to display in the popup.
  // Make sure to translate before passing a value in.
  message: LocalizedString;
  options: NotificationOptions;
}

// Define a type for the slice state
export interface NotifyState {
  notifications: Notification[];
}

// Define the initial state using that type
export const initialState: NotifyState = {
  notifications: [],
};

const notifySlice = createSlice({
  name: 'notify',
  initialState,
  reducers: {
    // ImmerJS allows you to change the state by modifying state parameter object.
    // This provides automatic state merging.
    enqueueNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.push(action.payload);
    },
    dismissNotification: (state, action: PayloadAction<SnackbarKey>) => {
      // Dismiss all notifications whose key matches the provided value.
      state.notifications = state.notifications.map((notification) =>
        notification.options.key === action.payload
          ? { ...notification, dismissed: true }
          : notification
      );
    },
    dismissAllNotifications: (state) => {
      // Dismiss all queued notifications.
      state.notifications = state.notifications.map((notification) => ({
        ...notification,
        dismissed: true,
      }));
    },
    removeNotification: (state, action: PayloadAction<SnackbarKey>) => {
      // Remove the notification from the state.
      // Called internally once the dismissal animation is complete.
      state.notifications = state.notifications.filter(
        (notification) => notification.options.key !== action.payload
      );
    },
  },
  extraReducers: {
    [CLEAR_PREFERENCES.toString()]: () => {
      // Reset to the default state.
      return initialState;
    },
  },
});

export const {
  enqueueNotification,
  dismissNotification,
  dismissAllNotifications,
  removeNotification,
} = notifySlice.actions;

/**
 * Convenience function to retrieve a given value from the root state.
 * @param state
 */
export const selectNotifications = (state: AppState): NotifyState['notifications'] =>
  state.notify.notifications;

export const buildNotification = (
  message: LocalizedString,
  options: Partial<Notification['options']> | undefined
): Notification => {
  return {
    dismissed: false,
    message,
    options: {
      key: new Date().getTime() + Math.random(),
      persist: false,
      preventDuplicate: false,
      variant: 'default',
      action: {},
      ...options,
    },
  };
};

export default notifySlice.reducer;
