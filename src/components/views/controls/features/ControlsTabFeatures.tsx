/**
 * Provides the interface for the Features tab of the Map controls.
 */

import React, { FunctionComponent } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { getFeatureKeysByFilter, sortFeaturesByName } from '~/components/data/MapFeatures';
import BorderBox from '~/components/interface/BorderBox';
import {
  selectIsTabDisplayed,
  selectMapCategory,
  selectMapRegion,
} from '~/components/redux/slices/ui';
import { AppState } from '~/components/redux/types';
import ControlsFeatureButton from '~/components/views/controls/features/ControlsFeatureButton';

const mapStateToProps = (state: AppState) => ({
  displayed: selectIsTabDisplayed(state, 'features'),
  currentCategory: selectMapCategory(state),
  currentRegion: selectMapRegion(state),
});
const mapDispatchToProps = () => ({});
const connector = connect(mapStateToProps, mapDispatchToProps);

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
