import { PayloadAction } from '@reduxjs/toolkit';
import _ from 'lodash';
import { Middleware } from 'redux';

import { MapCategoryKey } from 'src/components/data/map/MapCategories';
import { getEmptyFeatureCategories } from 'src/components/data/map/MapFeatures';
import { getEmptyRouteCategories } from 'src/components/data/map/MapRoutes';
import { AppDispatch } from 'src/components/redux';
import { setMapCategory, setTab } from 'src/components/redux/slices/map/interface/Actions';
import {
  selectMapCategory,
  selectMapRegion,
} from 'src/components/redux/slices/map/interface/Selector';
import { AppState } from 'src/components/redux/Types';
import { UIControlsTab } from 'src/components/Types';
import { getKeys } from 'src/components/util';

/**
 * When switching tabs, also switch the map category
 * if the map category for the target tab is empty.
 */

const handleSetTabFeatures = (currentState: AppState, dispatch: AppDispatch) => {
  const emptyFeatureCategories: Record<MapCategoryKey, boolean> = getEmptyFeatureCategories(
    selectMapRegion(currentState)
  );
  if (emptyFeatureCategories[selectMapCategory(currentState)]) {
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
};
const handleSetTabRoutes = (currentState: AppState, dispatch: AppDispatch) => {
  const emptyRouteCategories: Record<MapCategoryKey, boolean> = getEmptyRouteCategories(
    selectMapRegion(currentState)
  );
  if (emptyRouteCategories[selectMapCategory(currentState)]) {
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
};

const emptyCategoryMiddleware: Middleware<unknown, AppState> = ({ dispatch, getState }) => (
  next
) => (action) => {
  switch (action.type) {
    case setTab.type:
      const currentState = getState();
      const setTabAction: PayloadAction<UIControlsTab> = action;
      switch (setTabAction.payload) {
        case 'features':
          handleSetTabFeatures(currentState, dispatch);

          // Pass on the original action without replacing or modifying it.
          break;
        case 'routes':
          handleSetTabRoutes(currentState, dispatch);

          // Pass on the action without replacing or modifying it.
          break;
      }
      break;
  }

  // Pass on the action without replacing or modifying it.
  return next(action);
};

export default emptyCategoryMiddleware;
