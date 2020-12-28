/**
 * Provides the interface for the tabs at the top of the Map controls.
 */

import React from 'react';
import { connect } from 'react-redux';

import { t } from '~/components/i18n/Localization';
import { TabBar } from '~/components/interface/Tabs';
import { setControlsTab } from '~/redux/ducks/ui';

const _MapControlsTabs = ({ editorEnabled, tab, setTab, displayed }) => {
  const tabs = [
    { enabled: !editorEnabled, label: t('map-controls-tab-about'), value: 'help', order: 1 },
    { enabled: editorEnabled, label: t('map-controls-tab-editor-help'), value: 'help', order: 1 },
    {
      enabled: editorEnabled,
      label: t('map-controls-tab-editor-elements'),
      value: 'elements',
      order: 2,
    },
    { enabled: !editorEnabled, label: t('map-controls-tab-features'), value: 'features', order: 2 },
    { enabled: !editorEnabled, label: t('map-controls-tab-routes'), value: 'routes', order: 3 },
    { enabled: true, label: t('map-controls-tab-options'), value: 'options', order: 10 },
  ];

  return <TabBar displayed={displayed} value={tab} onChange={setTab} tabs={tabs} />;
};

const mapStateToProps = ({ editorEnabled, controlsTab: tab, options: { overrideLang: lang } }) => ({
  displayed: true,
  editorEnabled,
  tab,
  // Adding language to the props, even if it isn't used,
  // causes the component to re-render when the language changes.
  lang,
});
const mapDispatchToProps = (dispatch) => ({
  setTab: (tab) => dispatch(setControlsTab(tab)),
});
const MapControlsTabs = connect(mapStateToProps, mapDispatchToProps)(_MapControlsTabs);

export default MapControlsTabs;
