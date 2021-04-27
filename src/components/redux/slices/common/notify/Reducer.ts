import { createReducer } from '@reduxjs/toolkit';
import _ from 'lodash';
import {
  dismissAllNotifications,
  dismissNotification,
  enqueueNotification,
  removeNotification,
} from './Actions';
import initialState from './InitialState';
import selectSlice from './Selector';
import { setPreferences, clearPreferences } from 'src/components/redux/slices/common/core';
import selectNamespace from 'src/components/redux/slices/common/Selector';

const displayedReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(enqueueNotification, (state, action) => {
      state.notifications.push(action.payload);
    })
    .addCase(dismissNotification, (state, action) => {
      // Dismiss all notifications whose key matches the provided value.
      state.notifications = _.map(state.notifications, (notification) =>
        notification.options.key === action.payload
          ? { ...notification, dismissed: true }
          : notification
      );
    })
    .addCase(dismissAllNotifications, (state) => {
      // Dismiss all queued notifications.
      state.notifications = _.map(state.notifications, (notification) => ({
        ...notification,
        dismissed: true,
      }));
    })
    .addCase(removeNotification, (state, action) => {
      // Remove the notification from the state.
      // Called internally once the dismissal animation is complete.
      state.notifications = _.reject(
        state.notifications,
        (notification) => notification.options.key == action.payload
      );
    })
    .addCase(setPreferences, (state, action) => {
      return selectSlice(selectNamespace(action.payload)) ?? state;
    })
    .addCase(clearPreferences, () => {
      return initialState;
    });
});

export default displayedReducer;
