/**
 * Provides the interface for the Features tab of the Map controls.
 */

import _ from 'lodash';
import React, { FunctionComponent } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { getFeatureKeysByFilter, sortFeaturesByName } from 'src/components/data/map/MapFeatures';
import BorderBox from 'src/components/interface/BorderBox';
import {
  selectIsTabDisplayed,
  selectMapCategory,
  selectMapRegion,
} from 'src/components/redux/slices/map/interface/Selector';
import { AppState } from 'src/components/redux/Types';
import { Empty } from 'src/components/Types';
import ControlsFeatureButton from 'src/components/views/map/controls/features/ControlsFeatureButton';

const mapStateToProps = (state: AppState) => ({
  displayed: selectIsTabDisplayed(state, 'features'),
  currentCategory: selectMapCategory(state),
  currentRegion: selectMapRegion(state),
});
type ControlsTabFeaturesStateProps = ReturnType<typeof mapStateToProps>;
const connector = connect<ControlsTabFeaturesStateProps, Empty, Empty, AppState>(mapStateToProps);

type ControlsTabFeaturesProps = ConnectedProps<typeof connector>;

const _ControlsTabFeatures: FunctionComponent<ControlsTabFeaturesProps> = ({
  currentRegion,
  currentCategory,
  displayed,
}) => {
  return (
    <BorderBox direction="column" displayed={displayed} overflow="hidden auto">
      {_.map(sortFeaturesByName(getFeatureKeysByFilter(currentRegion, currentCategory)), (key) => (
        <ControlsFeatureButton key={key} featureKey={key} />
      ))}
    </BorderBox>
  );
};

const ControlsTabFeatures = connector(_ControlsTabFeatures);

export default ControlsTabFeatures;
