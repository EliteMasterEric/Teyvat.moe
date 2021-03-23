import { PayloadAction } from '@reduxjs/toolkit';
import _ from 'lodash';
import { Middleware } from 'redux';

import { MapCategoryKey } from 'src/components/data/MapCategories';
import { getEmptyFeatureCategories } from 'src/components/data/MapFeatures';
import { getEmptyRouteCategories } from 'src/components/data/MapRoutes';
import { setMapCategory, setTab } from 'src/components/redux/slices/ui';
import { AppState } from 'src/components/redux/types';
import { UIControlsTab } from 'src/components/Types';

const emptyCategoryMiddleware: Middleware<unknown, AppState> = ({ dispatch, getState }) => (
  next
) => (action) => {
  switch (action.type) {
    case [setTab]:
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
            const categoryList = Object.keys(emptyFeatureCategories) as MapCategoryKey[];
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
            const categoryList = Object.keys(emptyRouteCategories) as MapCategoryKey[];
            const usedCategory = _.find(categoryList, (key) => !emptyRouteCategories[key]);
            // Dispatch an action to set the category.
            if (usedCategory != null) {
              dispatch(setMapCategory(usedCategory));
            }
          }

          // Pass on the action without replacing or modifying it.
          return next(action);
        default:
          // Pass on the action without replacing or modifying it.
          return next(action);
      }
    default:
      // Pass on the action without replacing or modifying it.
      return next(action);
  }
};

export default emptyCategoryMiddleware;
