/**
 * Provides the interface for the Categories tab button
 * within the Features and Routes tabs of the Map controls.
 */

import { makeStyles, Button } from '@material-ui/core';
import clsx from 'clsx';
import React from 'react';
import { connect } from 'react-redux';

import MapCategories from '~/components/data/MapCategories';
import { getEmptyFeatureCategories, getEmptyRouteCategories } from '~/components/data/MapFeatures';
import { t } from '~/components/i18n/Localization';
import { setControlsCategory } from '~/redux/ducks/ui';

const useStyles = makeStyles((_theme) => ({
  categoryButton: {
    margin: '4px 4px 4px 4px',
    padding: '8px 4px 8px 4px',

    flex: '1 0 25%',
  },
}));

const _MapControlsCategoryButton = ({ active, categoryEmpty, categoryKey, enableCategory }) => {
  const classes = useStyles();

  const category = MapCategories[categoryKey];
  const displayed = (category?.enabled ?? true) && !categoryEmpty;

  if (!displayed) return null;

  const buttonStyle = {
    backgroundColor: active
      ? category?.style?.enabled?.bg
      : category?.style?.disabled?.bg ?? '#FFF',
    color: active ? category?.style?.enabled?.text : category?.style?.disabled?.text ?? '#000',
    flexBasis: category?.style?.fullWidth ? '95%' : null,
  };

  return (
    <Button
      onClick={enableCategory}
      variant="contained"
      style={buttonStyle}
      className={classes.categoryButton}
    >
      {t(category.nameKey)}
    </Button>
  );

  // eslint-disable-next-line no-unreachable
  return (
    <div
      onClick={enableCategory}
      onKeyDown={enableCategory}
      role="button"
      tabIndex={0}
      className={clsx(
        'map-controls-category',
        active ? 'map-controls-category-active' : '',
        'noselect',
        displayed ? '' : 'display-none'
      )}
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
