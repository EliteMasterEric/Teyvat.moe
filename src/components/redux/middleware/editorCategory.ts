import { PayloadAction } from '@reduxjs/toolkit';
import _ from 'lodash';
import { Middleware } from 'redux';

import { MapCategoryKey } from 'src/components/data/MapCategories';
import { getEmptyFeatureCategories } from 'src/components/data/MapFeatures';
import { getEmptyRouteCategories } from 'src/components/data/MapRoutes';
import { setMapCategory, setTab } from 'src/components/redux/slices/Interface';
import { AppState } from 'src/components/redux/Types';
import { UIControlsTab } from 'src/components/Types';
import { getKeys } from 'src/components/util';

/**
 * When switching tabs, also switch the map category
 * if the map category for the target tab is empty.
 */

const emptyCategoryMiddleware: Middleware<unknown, AppState> = ({ dispatch, getState }) => (
  next
) => (action) => {
  if (action.type === setTab.type) {
    console.warn('MIDDLEWARE: setTab');
    const setTabAction: PayloadAction<UIControlsTab> = action;
    const currentState = getState();
    switch (setTabAction.payload) {
      case 'features':
        const emptyFeatureCategories: Record<MapCategoryKey, boolean> = getEmptyFeatureCategories(
          currentState.ui.mapRegion
        );
        if (emptyFeatureCategories[currentState.ui.mapCategory]) {
          // We are switching to the 'Features' tab, but the current category is empty!!!
          // We need to dispatch an action to switch to the next available category.

          // Find the first category which has features available.
          const categoryList = getKeys(emptyFeatureCategories);
          const usedCategory = _.find(categoryList, (key) => !emptyFeatureCategories[key]);
          // Dispatch an action to set the category.
          if (usedCategory != null) {
            dispatch(setMapCategory(usedCategory));
          }
        }

        // Pass on the original action without replacing or modifying it.
        return next(action);
      case 'routes':
        const emptyRouteCategories: Record<MapCategoryKey, boolean> = getEmptyRouteCategories(
          currentState.ui.mapRegion
        );
        if (emptyRouteCategories[currentState.ui.mapCategory]) {
          // We are switching to the 'Routes' tab, but the current category is empty!!!
          // We need to dispatch an action to switch to the next available category.

          // Find the first category which has routes available.
          const categoryList = getKeys(emptyRouteCategories);
          const usedCategory = _.find(categoryList, (key) => !emptyRouteCategories[key]);
          // Dispatch an action to set the category.
          if (usedCategory != null) {
            dispatch(setMapCategory(usedCategory));
          }
        }

        // Pass on the action without replacing or modifying it.
        break;
      default:
        // Pass on the action without replacing or modifying it.
        break;
    }
  }

  // Pass on the action without replacing or modifying it.
  return next(action);
};

export default emptyCategoryMiddleware;
