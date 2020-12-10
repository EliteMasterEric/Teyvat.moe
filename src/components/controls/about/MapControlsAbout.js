import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';

import MapControlSummary from './summary/MapControlsSummary';
import MapControlsAboutTabs from './MapControlsAboutTabs';
import MapControlsHelpEditor from './help/MapControlsHelpEditor';
import MapControlsHelp from './help/MapControlsHelp';

import './MapControlsAbout.css';

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
