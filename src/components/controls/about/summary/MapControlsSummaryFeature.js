import _ from 'lodash';
import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';

import { useImageExtension } from '../../../Image';
import { getFilterIconURL } from '../../../MapFeaturesData';
import { MapFeatures } from '../../../MapFeatures';

import MapControlSummaryProgressBar from './MapControlsSummaryProgressBar';
import MapControlSummaryFeatureMenu from './MapControlsSummaryFeatureMenu';

const _MapControlSummaryFeature = ({ mapFeature, featureKey, completedCount }) => {
  const totalCount = Object.keys(mapFeature.data).length;

  // React hooks must always before any return calls.
  const ext = useImageExtension();

  if (completedCount === 0) return null;

  return (
    <div className={clsx('map-controls-about-summary-feature')}>
      <div className={clsx('map-controls-about-summary-feature-border')}>
        <img
          className={clsx('map-controls-about-summary-feature-icon')}
          src={getFilterIconURL(mapFeature.icons.filter, ext)}
          alt={mapFeature.name}
        />
      </div>
      <div className={clsx('map-controls-about-summary-feature-subcontainer', 'flex-grow')}>
        <div className={clsx('map-controls-about-summary-feature-label')}>{mapFeature.name}</div>
        <MapControlSummaryProgressBar percentage={completedCount / totalCount} width={12} />
        <div className={clsx('map-controls-about-summary-feature-label')}>
          {completedCount} / {totalCount}
        </div>
      </div>
      <div className={clsx('map-controls-about-summary-feature-subcontainer')}>
        <MapControlSummaryFeatureMenu featureKey={featureKey} />
      </div>
    </div>
  );
};

const mapStateToProps = (state, { featureKey }) => {
  const mapFeature = MapFeatures[featureKey];
  return {
    mapFeature,
    doesExpire: (mapFeature?.respawn ?? -1) !== -1,
    displayedFeatures: _.keys(state.displayed.features),
    completedCount: _.keys(state.completed.features[featureKey]).length,
  };
};
const mapDispatchToProps = (_dispatch) => ({});
const MapControlSummaryFeature = connect(
  mapStateToProps,
  mapDispatchToProps
)(_MapControlSummaryFeature);

export default MapControlSummaryFeature;
