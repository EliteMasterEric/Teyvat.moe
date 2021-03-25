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
import React, { FunctionComponent } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { t } from 'src/components/i18n/Localization';
import { TabBar, TabValue } from 'src/components/interface/Tabs';
import { AppDispatch } from 'src/components/redux';
import { selectOverrideLang } from 'src/components/redux/slices/options';
import { selectEditorEnabled, selectTab, setTab } from 'src/components/redux/slices/ui';
import { AppState } from 'src/components/redux/types';
import { distinguishUIControlsTab, Empty } from 'src/components/Types';

const useStyles = makeStyles((_theme) => ({
  tabBar: {
    margin: '0 0 8px 0',
  },
}));

const mapStateToProps = (state: AppState) => ({
  editorEnabled: selectEditorEnabled(state),
  currentTab: selectTab(state),
  // Adding language to the props, even if it isn't used,
  // causes the component to re-render when the language changes.
  lang: selectOverrideLang(state),
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  setTab: (tab: TabValue) => {
    if (distinguishUIControlsTab(tab)) {
      dispatch(setTab(tab));
    }
  },
});
type ControlsTabsStateProps = ReturnType<typeof mapStateToProps>;
type ControlsTabsDispatchProps = ReturnType<typeof mapDispatchToProps>;
const connector = connect<ControlsTabsStateProps, ControlsTabsDispatchProps, Empty, AppState>(
  mapStateToProps,
  mapDispatchToProps
);

type ControlsTabsProps = ConnectedProps<typeof connector>;

const _ControlsTabs: FunctionComponent<ControlsTabsProps> = ({
  editorEnabled,
  currentTab,
  setTab,
}) => {
  const classes = useStyles();

  const tabList = [
    {
      enabled: !editorEnabled,
      label: t('help'),
      value: 'help' as TabValue,
      order: 11,
      icon: <LiveHelpIcon />,
    },
    {
      enabled: !editorEnabled,
      label: t('summary'),
      value: 'summary' as TabValue,
      order: 12,
      icon: <SatelliteIcon />,
    },
    {
      enabled: editorEnabled,
      label: t('editor-help'),
      value: 'help' as TabValue,
      order: 21,
      icon: <LiveHelpIcon />,
    },
    {
      enabled: editorEnabled,
      label: t('editor-elements'),
      value: 'elements' as TabValue,
      order: 22,
      icon: <CreateIcon />,
    },
    {
      enabled: !editorEnabled,
      label: t('features'),
      value: 'features' as TabValue,
      order: 31,
      icon: <PlaceIcon />,
    },
    {
      enabled: !editorEnabled,
      label: t('routes'),
      value: 'routes' as TabValue,
      order: 32,
      icon: <TimelineIcon />,
    },
    {
      enabled: true,
      label: t('sync-data'),
      value: 'sync' as TabValue,
      order: 41,
      icon: <SyncIcon />,
    },
    {
      enabled: true,
      label: t('options'),
      value: 'options' as TabValue,
      order: 42,
      icon: <SettingsIcon />,
    },
  ];

  return (
    <TabBar
      className={classes.tabBar}
      displayed
      value={currentTab as TabValue}
      onChange={setTab}
      tabs={tabList}
      icons
    />
  );
};

const ControlsTabs = connector(_ControlsTabs);

export default ControlsTabs;
