/**
 * Provides the interface for the Features tab of the Map controls.
 */

import React from 'react';
import { connect } from 'react-redux';

import { getFeatureKeysByFilter, sortByName } from '~/components/data/MapFeatures';
import BorderBox from '~/components/interface/BorderBox';
import MapControlsFeatureButton from '~/components/views/controls/features/MapControlsFeatureButton';

const _MapControlsFeatures = ({ currentRegion, currentCategory, displayed }) => {
  return (
    <BorderBox displayed={displayed} overflow="hidden auto">
      {sortByName(getFeatureKeysByFilter(currentRegion, currentCategory)).map((key) => (
        <MapControlsFeatureButton key={key} featureKey={key} />
      ))}
    </BorderBox>
  );
};

const mapStateToProps = (state) => ({
  displayed: state.controlsTab === 'features',
  currentCategory: state.controlsCategory,
  currentRegion: state.controlsRegion,
});
const mapDispatchToProps = (_dispatch) => ({});
const MapControlsFeatures = connect(mapStateToProps, mapDispatchToProps)(_MapControlsFeatures);

export default MapControlsFeatures;
