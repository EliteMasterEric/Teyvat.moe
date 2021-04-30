import { AnyAction } from '@reduxjs/toolkit';
import _ from 'lodash';
import { reducer as authReducer, selectSliceAuth } from './auth';
import { reducer as completedReducer, selectSliceCompleted } from './completed';
import { reducer as displayedReducer, selectSliceDisplayed } from './displayed';
import { reducer as editorReducer, selectSliceEditor } from './editor';
import { reducer as errorReducer, selectSliceError } from './error';
import { reducer as interfaceReducer, selectSliceInterface } from './interface';
import { reducer as loadingReducer, selectSliceLoading } from './loading';
import { reducer as optionsReducer, selectSliceOptions } from './options';
import { MapState } from './Types';

const mapReducer = (currentState: MapState | null, action: AnyAction): MapState => ({
  auth: authReducer(selectSliceAuth(currentState), action),
  completed: completedReducer(selectSliceCompleted(currentState), action),
  displayed: displayedReducer(selectSliceDisplayed(currentState), action),
  editor: editorReducer(selectSliceEditor(currentState), action),
  error: errorReducer(selectSliceError(currentState), action),
  interface: interfaceReducer(selectSliceInterface(currentState), action),
  loading: loadingReducer(selectSliceLoading(currentState), action),
  options: optionsReducer(selectSliceOptions(currentState), action),
});

export default mapReducer;
