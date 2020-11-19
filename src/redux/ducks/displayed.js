// List action types.
/**
 * This action sets whether a given feature is displayed.
 */
export const SET_FEATURE_DISPLAYED = 'genshinmap/displayed/SET_FEATURE_DISPLAYED';
/**
 * This action sets whether a given route is displayed.
 */
export const SET_ROUTE_DISPLAYED = 'genshinmap/displayed/SET_ROUTE_DISPLAYED';

/**
 * The reducer.
 * @param {*} state The current state.
 * @param {*} action An action to perform.
 * @returns {*} The modified state.
 */
const displayedReducer = (state, action) => {
  switch (action.type) {
    case SET_FEATURE_DISPLAYED:
      // Set whether a given feature is visible.
      return {
        ...state,
        displayed: {
          ...state.displayed,
          features: {
            ...state.displayed.features,
            [action.payload.key]: action.payload.displayed,
          },
        },
      };
    case SET_ROUTE_DISPLAYED:
      // Set whether a given route is visible.
      return {
        ...state,
        displayed: {
          ...state.displayed,
          routes: {
            ...state.displayed.routes,
            [action.payload.key]: action.payload.displayed,
          },
        },
      };
    default:
      console.error(`DISPLAYED REDUCER ERROR: Unknown action '${action.type}'`);
  }
  return state;
};

// Export the reducer as default.
export default displayedReducer;

// The action creators.
/**
 * Set whether a given feature is enabled.
 * @param {*} featureKey The feature to set the state of.
 * @param {*} displayed The new state of the feature's visibility.
 * @returns An action to be dispatched.
 */
export const setFeatureDisplayed = (featureKey, displayed) => {
  return {
    type: SET_FEATURE_DISPLAYED,
    payload: {
      key: featureKey,
      displayed,
    },
  };
};
/**
 * Set whether a given route is enabled.
 * @param {*} routeKey The route to set the state of.
 * @param {*} displayed The new state of the route's visibility.
 * @returns An action to be dispatched.
 */
export const setRouteDisplayed = (routeKey, displayed) => {
  return {
    type: SET_ROUTE_DISPLAYED,
    payload: {
      key: routeKey,
      displayed,
    },
  };
};
