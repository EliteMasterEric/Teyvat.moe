/**
 * Provides the interface for the Routes tab of the Map controls.
 */

import React, { FunctionComponent } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { getRouteKeysByFilter, sortRoutesByName } from '~/components/data/MapRoutes';
import BorderBox from '~/components/interface/BorderBox';
import ControlsRouteButton from '~/components/views/controls/features/ControlsRouteButton';

const mapStateToProps = (state) => ({
  displayed: state.controlsTab === 'routes',
  currentCategory: state.controlsCategory,
  currentRegion: state.controlsRegion,
});
const mapDispatchToProps = () => ({});
const connector = connect(mapStateToProps, mapDispatchToProps);

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
