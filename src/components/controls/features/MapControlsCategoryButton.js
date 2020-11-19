import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';

import {
  getEmptyFeatureCategories,
  getEmptyRouteCategories,
  MapCategories,
} from '../../MapFeatures';
import { t } from '../../Localization';
import { setControlsCategory } from '../../../redux/ducks/ui';

import './MapControlsCategoryButton.css';

const _MapControlsCategoryButton = ({ active, categoryEmpty, categoryKey, enableCategory }) => {
  const category = MapCategories[categoryKey];
  const displayed = (category?.enabled ?? true) && !categoryEmpty;

  return (
    <div
      onClick={enableCategory}
      onKeyDown={enableCategory}
      role="button"
      aria-label={active ? 'Close Filter Window' : 'Open Filter Window'}
      tabIndex={0}
      className={clsx(
        'map-controls-category',
        active ? 'map-controls-category-active' : '',
        'noselect',
        displayed ? '' : 'display-none'
      )}
      style={{
        minWidth: category?.style?.fullWidth ?? false ? '100%' : 0,
        backgroundColor: active
          ? category?.style?.enabled?.bg
          : category?.style?.disabled?.bg ?? '#FFF',
        color: active ? category?.style?.enabled?.text : category?.style?.disabled?.text ?? '#000',
      }}
    >
      {t(category.nameKey)}
    </div>
  );
};

const mapStateToProps = (state, { categoryKey }) => {
  // Check if the given category is empty for the active region.
  let categoryEmpty = true;
  switch (state.controlsTab) {
    case 'features':
      const featureList = getEmptyFeatureCategories(state.controlsRegion);
      categoryEmpty = featureList[categoryKey];
      break;
    case 'routes':
      const routeList = getEmptyRouteCategories(state.controlsRegion);
      categoryEmpty = routeList[categoryKey];
      break;
    default:
      categoryEmpty = false;
      break;
  }
  return {
    active: state.controlsCategory === categoryKey,
    categoryEmpty,
  };
};
const mapDispatchToProps = (dispatch, { categoryKey }) => ({
  enableCategory: () => dispatch(setControlsCategory(categoryKey)),
});
const MapControlsCategoryButton = connect(
  mapStateToProps,
  mapDispatchToProps
)(_MapControlsCategoryButton);

export default MapControlsCategoryButton;
