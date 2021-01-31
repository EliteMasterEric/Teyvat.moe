/**
 * This folder contains modules that handle React Redux.
 */
import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from '~/redux/ducks/index';
import { rootMiddleware } from '~/redux/middleware';
import { loadStateFromLocalStorage } from '~/components/preferences/ReduxStore';
import watchers from '~/redux/watchers';

/**
 * The store in Redux holds ALL the application's state.
 * The state of the application is produced by reducers.
 *
 * The only way to modify the state is to send a signal to the store, known as an action.
 * The state is immutable and cannot be changed in place; it must be changed by calling an action.
 */

const persistedStore = loadStateFromLocalStorage();

const ENABLE_REDUX_DEBUG = true;

const fullMiddleware = ENABLE_REDUX_DEBUG
  ? (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose)(applyMiddleware(rootMiddleware))
  : compose(applyMiddleware(rootMiddleware));

const store = createStore(rootReducer, persistedStore, fullMiddleware);

export default store;

// Call these functions whenever the store changes.
watchers.forEach((watcherFunction) => {
  const listen = () => {
    const currentStore = store.getState();
    watcherFunction(currentStore);
  };
  // Call once as the app initializes.
  listen();
  // Call every time the store changes.
  store.subscribe(listen);
});

/**
 * NOTES:
 *
 * This tutorial was a godsend:
 * https://www.valentinog.com/blog/redux/#react-redux-tutorial-should-i-use-redux
 *
 * mapStateToProps sets the props of a React component to values from the state.
 * mapDispatchToProps connects Redux actions to react props so a React component can send messages to the store.
 *
 * The goal of Redux should be to move as much application logic as possible out of components,
 * and into middleware. Middleware is reusable, can be tested in isolation, and kept outside the
 *
 * redux-thunk creates a middleware that allows objects to be functions as well as objects.
 * This is useful for any asynchronous data operations.
 * Example: (dispatch) => fetch().then(() => dispatch(action)).
 *
 * redux-saga is a middlware for handling side effects.
 * It relies on generator functions.
 */
