/**
 * Provides the interface for the tabs at the top of the Map controls.
 */

import { makeStyles } from '@material-ui/core';
import {
  Create as CreateIcon,
  LiveHelp as LiveHelpIcon,
  Place as PlaceIcon,
  Satellite as SatelliteIcon,
  Settings as SettingsIcon,
  Sync as SyncIcon,
  Timeline as TimelineIcon,
} from '@material-ui/icons';
import React from 'react';
import { connect } from 'react-redux';

import { t } from '~/components/i18n/Localization';
import { TabBar } from '~/components/interface/Tabs';
import { setControlsTab } from '~/redux/ducks/ui';

const useStyles = makeStyles((_theme) => ({
  tabBar: {
    margin: '0 0 8px 0',
  },
}));

const _MapControlsTabs = ({ editorEnabled, tab, setTab, displayed }) => {
  const classes = useStyles();

  const tabs = [
    {
      enabled: !editorEnabled,
      label: t('help'),
      value: 'help',
      order: 11,
      icon: <LiveHelpIcon />,
    },
    {
      enabled: !editorEnabled,
      label: t('summary'),
      value: 'summary',
      order: 12,
      icon: <SatelliteIcon />,
    },
    {
      enabled: editorEnabled,
      label: t('editor-help'),
      value: 'help',
      order: 21,
      icon: <LiveHelpIcon />,
    },
    {
      enabled: editorEnabled,
      label: t('editor-elements'),
      value: 'elements',
      order: 22,
      icon: <CreateIcon />,
    },
    {
      enabled: !editorEnabled,
      label: t('features'),
      value: 'features',
      order: 31,
      icon: <PlaceIcon />,
    },
    {
      enabled: !editorEnabled,
      label: t('routes'),
      value: 'routes',
      order: 32,
      icon: <TimelineIcon />,
    },
    {
      enabled: true,
      label: t('sync-data'),
      value: 'sync',
      order: 41,
      icon: <SyncIcon />,
    },
    {
      enabled: true,
      label: t('options'),
      value: 'options',
      order: 42,
      icon: <SettingsIcon />,
    },
  ];

  return (
    <TabBar
      className={classes.tabBar}
      displayed={displayed}
      value={tab}
      onChange={setTab}
      tabs={tabs}
      icons
    />
  );
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
