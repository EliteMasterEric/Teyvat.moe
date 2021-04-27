import { configureStore, Dispatch } from '@reduxjs/toolkit';

import { AppAction } from 'src/components/redux/Actions';
import fullMiddleware from 'src/components/redux/middleware';

import reducer from 'src/components/redux/Reducer';
import addWatchers from 'src/components/redux/watchers';

export const store = configureStore({
  reducer,
  middleware: fullMiddleware,
  devTools: true,
});

addWatchers(store);

export type AppStore = typeof store;
export type AppDispatch = Dispatch<AppAction>;
