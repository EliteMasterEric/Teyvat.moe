import _ from 'lodash';

import MapCategories from '~/components/data/MapCategories';
import { getEmptyFeatureCategories, getEmptyRouteCategories } from '~/components/data/MapFeatures';
import { setControlsCategory, SET_CONTROLS_TAB } from '~/redux/ducks/ui';

export const rootMiddleware = ({ dispatch, getState }) => {
  return (next) => {
    return (action) => {
      switch (action.type) {
        // Here, you can add logic to override dispatched actions.
        // For example, you could add validation to an action,
        // and if it fails, you could override the action.
        case SET_CONTROLS_TAB:
          // Check if the current category is empty.
          const currentCategory = getState().controlsCategory;
          switch (action.payload.tab) {
            case 'features':
              const featureCategoriesEmpty = getEmptyFeatureCategories(getState().controlsRegion);
              if (featureCategoriesEmpty[currentCategory]) {
                const usedCategory = _.find(_.keys(MapCategories), (categoryKey) => {
                  return !(featureCategoriesEmpty[categoryKey] ?? true);
                });
                // If the current category is empty, switch to the first one that isn't.
                dispatch(setControlsCategory(usedCategory));
              }
              break;
            case 'routes':
              const routeCategoriesEmpty = getEmptyRouteCategories(getState().controlsRegion);
              if (routeCategoriesEmpty[currentCategory]) {
                const usedCategory = _.find(_.keys(MapCategories), (categoryKey) => {
                  return !(routeCategoriesEmpty[categoryKey] ?? true);
                });
                // If the current category is empty, switch to the first one that isn't.
                dispatch(setControlsCategory(usedCategory));
              }
              break;
            default:
              break;
          }
          break;
        default:
          break;
      }
      return next(action);
    };
  };
};
