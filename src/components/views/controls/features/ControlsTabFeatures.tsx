/**
 * Provides the interface for the Features tab of the Map controls.
 */

import React, { FunctionComponent } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { getFeatureKeysByFilter, sortFeaturesByName } from 'src/components/data/MapFeatures';
import BorderBox from 'src/components/interface/BorderBox';
import {
  selectIsTabDisplayed,
  selectMapCategory,
  selectMapRegion,
} from 'src/components/redux/slices/ui';
import { AppState } from 'src/components/redux/types';
import { Empty } from 'src/components/Types';
import ControlsFeatureButton from 'src/components/views/controls/features/ControlsFeatureButton';

const mapStateToProps = (state: AppState) => ({
  displayed: selectIsTabDisplayed(state, 'features'),
  currentCategory: selectMapCategory(state),
  currentRegion: selectMapRegion(state),
});
const mapDispatchToProps = () => ({});
type ControlsTabFeaturesStateProps = ReturnType<typeof mapStateToProps>;
type ControlsTabFeaturesDispatchProps = ReturnType<typeof mapDispatchToProps>;
const connector = connect<
  ControlsTabFeaturesStateProps,
  ControlsTabFeaturesDispatchProps,
  Empty,
  AppState
>(mapStateToProps, mapDispatchToProps);

type ControlsTabFeaturesProps = ConnectedProps<typeof connector>;

const _ControlsTabFeatures: FunctionComponent<ControlsTabFeaturesProps> = ({
  currentRegion,
  currentCategory,
  displayed,
}) => {
  return (
    <BorderBox displayed={displayed} overflow="hidden auto">
      {sortFeaturesByName(getFeatureKeysByFilter(currentRegion, currentCategory)).map((key) => (
        <ControlsFeatureButton key={key} featureKey={key} />
      ))}
    </BorderBox>
  );
};

const ControlsTabFeatures = connector(_ControlsTabFeatures);

export default ControlsTabFeatures;
