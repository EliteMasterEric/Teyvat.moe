import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';

import MapControlSummary from './summary/MapControlsSummary';
import MapControlsAboutTabs from './MapControlsAboutTabs';
import MapControlsHelp from './MapControlsHelp';

import './MapControlsAbout.css';
import MapControlsHelpEditor from './MapControlsHelpEditor';

const _MapControlsAbout = ({ displayed }) => {
  return (
    <div className={clsx('map-controls-about-container', displayed ? '' : 'display-none')}>
      <MapControlsAboutTabs />
      <MapControlsHelp />
      <MapControlsHelpEditor />
      <MapControlSummary />
    </div>
  );
};

const mapStateToProps = (state) => ({ displayed: ['help', 'summary'].includes(state.controlsTab) });
const mapDispatchToProps = (_dispatch) => ({});
const MapControlsAbout = connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(_MapControlsAbout));

export default MapControlsAbout;
