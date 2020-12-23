/**
 * Provides the contents of the About tab in the Map Controls.
 */

import React from 'react';
import { connect } from 'react-redux';

import { TabView } from '~/components/interface/Tabs';
import MapControlsHelpEditor from '~/components/views/controls/about/help/MapControlsHelpEditor';
import MapControlsHelp from '~/components/views/controls/about/help/MapControlsHelp';
import MapControlsAboutTabs from '~/components/views/controls/about/MapControlsAboutTabs';
import MapControlSummary from '~/components/views/controls/about/summary/MapControlsSummary';

const _MapControlsAbout = ({ displayed }) => {
  return (
    <TabView displayed={displayed}>
      <MapControlsAboutTabs />
      <MapControlsHelp />
      <MapControlsHelpEditor />
      <MapControlSummary />
    </TabView>
  );
};

const mapStateToProps = (state) => ({ displayed: ['help', 'summary'].includes(state.controlsTab) });
const mapDispatchToProps = (_dispatch) => ({});
const MapControlsAbout = connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(_MapControlsAbout));

export default MapControlsAbout;
