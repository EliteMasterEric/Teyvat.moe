/**
 * Provides the interface for the Categories tab button
 * within the Features and Routes tabs of the Map controls.
 */

import clsx from 'clsx';
import React from 'react';
import { connect } from 'react-redux';

import MapCategories from '~/components/data/MapCategories';
import { getEmptyFeatureCategories, getEmptyRouteCategories } from '~/components/data/MapFeatures';
import { t } from '~/components/i18n/Localization';
import { setControlsCategory } from '~/redux/ducks/ui';

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

const mapStateToProps = (
  { controlsTab, controlsRegion, controlsCategory, options: { overrideLang: lang } },
  { categoryKey }
) => {
  // Check if the given category is empty for the active region.
  let categoryEmpty = true;
  switch (controlsTab) {
    case 'features':
      const featureList = getEmptyFeatureCategories(controlsRegion);
      categoryEmpty = featureList[categoryKey];
      break;
    case 'routes':
      const routeList = getEmptyRouteCategories(controlsRegion);
      categoryEmpty = routeList[categoryKey];
      break;
    default:
      categoryEmpty = false;
      break;
  }
  return {
    active: controlsCategory === categoryKey,
    categoryEmpty,
    // Adding language to the props, even if it isn't used,
    // causes the component to re-render when the language changes.
    lang,
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
