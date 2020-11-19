import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';

import MapControlSummary from './summary/MapControlsSummary';
import MapControlsAboutTabs from './MapControlsAboutTabs';
import MapControlsHelp from './MapControlsHelp';

import './MapControlsAbout.css';

const _MapControlsAbout = ({ displayed }) => {
  return (
    <div className={clsx('map-controls-about-container', displayed ? '' : 'display-none')}>
      <MapControlsAboutTabs />
      <MapControlsHelp />
      <MapControlSummary />
    </div>
  );
};

const mapStateToProps = (state) => ({ displayed: ['help', 'summary'].includes(state.controlsTab) });
const mapDispatchToProps = (_dispatch) => ({});
const MapControlsAbout = connect(mapStateToProps, mapDispatchToProps)(_MapControlsAbout);

export default MapControlsAbout;
