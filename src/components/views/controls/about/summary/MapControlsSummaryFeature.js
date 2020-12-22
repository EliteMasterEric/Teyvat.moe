/**
 * Provides the view which displays the individual features
 * in the About > Summary tab of the map controls.
 */

import clsx from 'clsx';
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';

import { MapFeatures } from '~/components/data/MapFeatures';
import { getFilterIconURL } from '~/components/data/MapFeaturesData';
import { useImageExtension } from '~/components/interface/Image';
import MapControlSummaryProgressBar from '~/components/interface/ProgressBar';
import MapControlSummaryFeatureMenu from '~/components/views/controls/about/summary/MapControlsSummaryFeatureMenu';

const _MapControlSummaryFeature = ({ mapFeature, featureKey, completedCount, displayed }) => {
  // React hooks must always before any return calls.
  const ext = useImageExtension();

  if (!displayed) return null; // Feature is not displayed.
  if (!mapFeature) return null; // Feature is not valid (CHECK THE CONSOLE).
  if (completedCount === 0) return null; // No markers have been completed.

  // Total number of markers for this feature. Contrast with completedCount.
  const totalCount = Object.keys(mapFeature.data).length;

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
    displayed: state.displayed.features[featureKey] || state.options.showHiddenFeatures,
    doesExpire: (mapFeature?.respawn ?? -1) !== -1,
    completedCount: _.keys(state.completed.features[featureKey]).length,
  };
};
const mapDispatchToProps = (_dispatch) => ({});
const MapControlSummaryFeature = connect(
  mapStateToProps,
  mapDispatchToProps
)(_MapControlSummaryFeature);

export default MapControlSummaryFeature;
