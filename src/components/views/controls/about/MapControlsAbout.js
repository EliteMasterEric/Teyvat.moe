/**
 * Provides the contents of the About tab in the Map Controls.
 */

import clsx from 'clsx';
import React from 'react';
import { connect } from 'react-redux';

import MapControlsHelpEditor from '~/components/views/controls/about/help/MapControlsHelpEditor';
import MapControlsHelp from '~/components/views/controls/about/help/MapControlsHelp';
import MapControlsAboutTabs from '~/components/views/controls/about/MapControlsAboutTabs';
import MapControlSummary from '~/components/views/controls/about/summary/MapControlsSummary';

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
