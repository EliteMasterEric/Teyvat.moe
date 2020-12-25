/**
 * Powers the tab view in the About tab of the Map controls.
 */
import React from 'react';
import { connect } from 'react-redux';

import { t } from '~/components/i18n/Localization';
import { TabBar } from '~/components/interface/Tabs';
import { setControlsTab } from '~/redux/ducks/ui';

const ABOUT_TABS = [
  { label: t('map-controls-tab-help'), enabled: true, value: 'help', order: 1 },
  { label: t('map-controls-tab-summary'), enabled: true, value: 'summary', order: 2 },
];

const _MapControlsAboutTabs = ({ tab, displayed, setTab }) => {
  return <TabBar displayed={displayed} value={tab} onChange={setTab} tabs={ABOUT_TABS} />;
};

const mapStateToProps = (state) => ({
  tab: state.controlsTab,
  displayed:
    (state.controlsTab === 'help' || state.controlsTab === 'summary') && !state.editorEnabled,
});
const mapDispatchToProps = (dispatch) => ({ setTab: (tab) => dispatch(setControlsTab(tab)) });
const MapControlsAboutTabs = connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(_MapControlsAboutTabs));

export default MapControlsAboutTabs;
