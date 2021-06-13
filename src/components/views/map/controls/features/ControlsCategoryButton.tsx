/**
 * Provides the interface for the Categories tab button
 * within the Features and Routes tabs of the Map controls.
 */

import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, { FunctionComponent } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { getMapCategory, MapCategoryKey } from 'src/components/data/map/MapCategories';

import { getEmptyFeatureCategories } from 'src/components/data/map/MapFeatures';
import { getEmptyRouteCategories } from 'src/components/data/map/MapRoutes';
import { t } from 'src/components/i18n/Localization';
import { AppDispatch } from 'src/components/redux';
import { setMapCategory } from 'src/components/redux/slices/map/interface/Actions';
import {
  selectMapCategory,
  selectMapRegion,
  selectTab,
} from 'src/components/redux/slices/map/interface/Selector';
import { selectOverrideLang } from 'src/components/redux/slices/map/options/Selector';
import { AppState } from 'src/components/redux/Types';

const useStyles = makeStyles((_theme) => ({
  categoryButton: {},
}));

interface ControlsCategoryButtonBaseProps {
  categoryKey: MapCategoryKey;
}

const mapStateToProps = (state: AppState, { categoryKey }: ControlsCategoryButtonBaseProps) => {
  const controlsTab = selectTab(state);
  const controlsRegion = selectMapRegion(state);
  const { enabled: categoryEnabled, style, nameKey } = getMapCategory(categoryKey);
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
    active: selectMapCategory(state) === categoryKey,
    displayed: categoryEnabled && !categoryEmpty,
    style,
    nameKey,
    // Adding language to the props, even if it isn't used,
    // causes the component to re-render when the language changes.
    lang: selectOverrideLang(state),
  };
};
const mapDispatchToProps = (
  dispatch: AppDispatch,
  { categoryKey }: ControlsCategoryButtonBaseProps
) => ({
  enableCategory: () => dispatch(setMapCategory(categoryKey)),
});
type ControlsCategoryButtonStateProps = ReturnType<typeof mapStateToProps>;
type ControlsCategoryButtonDispatchProps = ReturnType<typeof mapDispatchToProps>;
const connector = connect<
  ControlsCategoryButtonStateProps,
  ControlsCategoryButtonDispatchProps,
  ControlsCategoryButtonBaseProps,
  AppState
>(mapStateToProps, mapDispatchToProps);

type ControlsCategoryButtonProps = ConnectedProps<typeof connector> &
  ControlsCategoryButtonBaseProps;

const _ControlsCategoryButton: FunctionComponent<ControlsCategoryButtonProps> = ({
  active,
  style,
  nameKey,
  displayed,
  enableCategory,
}) => {
  const classes = useStyles();

  if (!displayed) {
    return null;
  }

  const buttonStyle = {
    backgroundColor: active ? style.enabled.bg : style.disabled.bg ?? '#FFF',
    color: active ? style.enabled.text : style.disabled.text ?? '#000',
    flexBasis: style.fullWidth ? '95%' : 'auto',

    // Moved down here from makeStyles because styles were breaking.
    margin: '4px 4px 4px 4px',
    padding: '8px 4px 8px 4px',
    flex: '1 0 25%',
  };

  return (
    <Button
      onClick={enableCategory}
      variant="contained"
      style={buttonStyle}
      className={classes.categoryButton}
    >
      {t(nameKey)}
    </Button>
  );
};

const ControlsCategoryButton = connector(_ControlsCategoryButton);

export default ControlsCategoryButton;
