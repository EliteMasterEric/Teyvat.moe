/**
 * Provides the view which displays the Help tab of the map controls.
 */
import { makeStyles } from '@material-ui/core';
import React from 'react';
import { connect } from 'react-redux';
import { getMarkerCount, getRouteCount } from '~/components/data/MapFeatures';

import { t, f } from '~/components/i18n/Localization';
import BorderBox from '~/components/interface/BorderBox';
import { TabBar, TabView } from '~/components/interface/Tabs';
import { SafeHTML } from '~/components/Util';
import MapControlsChangelog from './MapControlsChangelog';

const TABS = [
  { enabled: true, order: 11, label: t('changelog'), value: 'changelog' },
  { enabled: true, order: 12, label: t('help'), value: 'help' },
];

const useStyles = makeStyles((_theme) => ({
  tabBar: {
    margin: 0,
    marginBottom: 8,
  },
}));

const _MapControlsHelp = ({ displayed }) => {
  const [helpTab, setHelpTab] = React.useState('changelog');
  const classes = useStyles();

  return (
    <TabView displayed={displayed}>
      <TabBar value={helpTab} onChange={setHelpTab} tabs={TABS} className={classes.tabBar} />
      <MapControlsChangelog displayed={helpTab === 'changelog'} />
      <BorderBox displayed={helpTab === 'help'} overflow="hidden auto">
        <SafeHTML gutterBottom>
          {f('help-description', { markers: getMarkerCount(), routes: getRouteCount() })}
        </SafeHTML>
        <SafeHTML gutterBottom>{t('help-migrate')}</SafeHTML>
        <SafeHTML gutterBottom>{t('help-contribute')}</SafeHTML>

        <SafeHTML>{t('help-content')}</SafeHTML>
      </BorderBox>
    </TabView>
  );
};

const mapStateToProps = ({ controlsTab, editorEnabled, options: { overrideLang: lang } }) => ({
  displayed: controlsTab === 'help' && !editorEnabled,
  // Adding language to the props, even if it isn't used,
  // causes the component to re-render when the language changes.
  lang,
});
const mapDispatchToProps = (_dispatch) => ({});
const MapControlsHelp = connect(mapStateToProps, mapDispatchToProps)(React.memo(_MapControlsHelp));

export default MapControlsHelp;
