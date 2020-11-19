import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';

import { getFeatureKeysByFilter, MapFeatures } from '../../MapFeatures';
import { useImageExtension } from '../../Image';
import MapControlsFeatureButton from './MapControlsFeatureButton';

import './MapControlsFeatures.css';

const _MapControlsFeatures = ({ currentRegion, currentCategory, displayed }) => {
  const ext = useImageExtension();

  return (
    <div
      className={clsx(
        'map-controls-features-box',
        `map-controls-features-box-${ext}`,
        displayed ? '' : 'display-none'
      )}
    >
      {getFeatureKeysByFilter(currentRegion, currentCategory)
        .sort((a, b) => {
          const textA = MapFeatures[a].name;
          const textB = MapFeatures[b].name;

          if (textA < textB) return -1;
          return textA > textB ? 1 : 0;
        })
        .map((key) => (
          <MapControlsFeatureButton key={key} featureKey={key} />
        ))}
    </div>
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
