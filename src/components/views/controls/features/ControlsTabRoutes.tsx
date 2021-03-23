/**
 * Provides the interface for the Routes tab of the Map controls.
 */

import React, { FunctionComponent } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { getRouteKeysByFilter, sortRoutesByName } from 'src/components/data/MapRoutes';
import BorderBox from 'src/components/interface/BorderBox';
import {
  selectIsTabDisplayed,
  selectMapCategory,
  selectMapRegion,
} from 'src/components/redux/slices/ui';
import { AppState } from 'src/components/redux/types';
import { Empty } from 'src/components/Types';
import ControlsRouteButton from 'src/components/views/controls/features/ControlsRouteButton';

const mapStateToProps = (state: AppState) => ({
  displayed: selectIsTabDisplayed(state, 'routes'),
  currentCategory: selectMapCategory(state),
  currentRegion: selectMapRegion(state),
});
const mapDispatchToProps = () => ({});
type ControlsTabRoutesStateProps = ReturnType<typeof mapStateToProps>;
type ControlsTabRoutesDispatchProps = ReturnType<typeof mapDispatchToProps>;
const connector = connect<
  ControlsTabRoutesStateProps,
  ControlsTabRoutesDispatchProps,
  Empty,
  AppState
>(mapStateToProps, mapDispatchToProps);

type ControlsTabRoutesProps = ConnectedProps<typeof connector>;

const _ControlsTabRoutes: FunctionComponent<ControlsTabRoutesProps> = ({
  currentRegion,
  currentCategory,
  displayed,
}) => {
  return (
    <BorderBox displayed={displayed} overflow="hidden auto">
      {sortRoutesByName(getRouteKeysByFilter(currentRegion, currentCategory)).map((key) => (
        <ControlsRouteButton key={key} routeKey={key} />
      ))}
    </BorderBox>
  );
};

const ControlsTabRoutes = connector(_ControlsTabRoutes);

export default ControlsTabRoutes;
