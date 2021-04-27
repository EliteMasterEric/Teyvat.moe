/**
 * Provides the interface for the Routes tab of the Map controls.
 */

import _ from 'lodash';
import React, { FunctionComponent } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { getRouteKeysByFilter, sortRoutesByName } from 'src/components/data/map/MapRoutes';
import BorderBox from 'src/components/interface/BorderBox';
import {
  selectIsTabDisplayed,
  selectMapCategory,
  selectMapRegion,
} from 'src/components/redux/slices/map/interface/Selector';
import { AppState } from 'src/components/redux/Types';
import { Empty } from 'src/components/Types';
import ControlsRouteButton from 'src/components/views/map/controls/features/ControlsRouteButton';

const mapStateToProps = (state: AppState) => ({
  displayed: selectIsTabDisplayed(state, 'routes'),
  currentCategory: selectMapCategory(state),
  currentRegion: selectMapRegion(state),
});
type ControlsTabRoutesStateProps = ReturnType<typeof mapStateToProps>;
const connector = connect<ControlsTabRoutesStateProps, Empty, Empty, AppState>(mapStateToProps);

type ControlsTabRoutesProps = ConnectedProps<typeof connector>;

const _ControlsTabRoutes: FunctionComponent<ControlsTabRoutesProps> = ({
  currentRegion,
  currentCategory,
  displayed,
}) => {
  return (
    <BorderBox direction="column" displayed={displayed} overflow="hidden auto">
      {_.map(sortRoutesByName(getRouteKeysByFilter(currentRegion, currentCategory)), (key) => (
        <ControlsRouteButton key={key} routeKey={key} />
      ))}
    </BorderBox>
  );
};

const ControlsTabRoutes = connector(_ControlsTabRoutes);

export default ControlsTabRoutes;
