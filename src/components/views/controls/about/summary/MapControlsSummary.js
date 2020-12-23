/**
 * Provides the view which displays the About > Summary tab of the map controls.
 */

import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';

import { t } from '~/components/i18n/Localization';
import BorderBox from '~/components/interface/BorderBox';
import MapControlSummaryFeature from '~/components/views/controls/about/summary/MapControlsSummaryFeature';

import './MapControlsSummary.css';

const useStyles = makeStyles((_theme) => ({
  header: {},
  subtitle: {},
}));

/**
 * Displays features which are both:
 * A) Currently visible on the map, and
 * B) Have at least one feature marked as completed.
 */
const _MapControlSummary = ({ displayed, displayedFeatures }) => {
  const classes = useStyles();

  return (
    <BorderBox displayed={displayed}>
      <span className={clsx('map-controls-about-summary-header')}>
        {t('map-controls-tab-summary')}
      </span>
      <span className={clsx('map-controls-about-summary-subtitle')}>
        {t('map-summary-subtitle')}
      </span>
      {displayedFeatures.map((featureKey) => (
        <MapControlSummaryFeature key={featureKey} featureKey={featureKey} />
      ))}
    </BorderBox>
  );
};

const mapStateToProps = (state, { feature }) => ({
  doesExpire: (feature?.respawn ?? -1) !== -1,
  displayedFeatures: _.keys(state.displayed.features),
  displayed: state.controlsTab === 'summary',
});
const mapDispatchToProps = (_dispatch) => ({});
const MapControlSummary = connect(mapStateToProps, mapDispatchToProps)(_MapControlSummary);

export default MapControlSummary;
