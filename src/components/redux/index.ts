import { configureStore, Dispatch } from '@reduxjs/toolkit';

import initialState from './InitialState';
import { loadMapStateFromLocalStorage } from 'src/components/preferences/map/ReduxStore';
import { AppAction } from 'src/components/redux/Actions';
import fullMiddleware from 'src/components/redux/middleware';

import reducer from 'src/components/redux/Reducer';
import addWatchers from 'src/components/redux/watchers';

const preloadedState = {
  ...initialState,
  map: loadMapStateFromLocalStorage(),
};

export const store = configureStore({
  preloadedState,
  reducer,
  middleware: fullMiddleware,
  devTools: true,
});

addWatchers(store);

export type AppStore = typeof store;
export type AppDispatch = Dispatch<AppAction>;
