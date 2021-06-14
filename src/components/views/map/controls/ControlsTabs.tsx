/**
 * Provides the interface for the tabs at the top of the Map controls.
 */

import CreateIcon from '@material-ui/icons/Create';
import LiveHelpIcon from '@material-ui/icons/LiveHelp';
import PlaceIcon from '@material-ui/icons/Place';
import SatelliteIcon from '@material-ui/icons/Satellite';
import SettingsIcon from '@material-ui/icons/Settings';
import SyncIcon from '@material-ui/icons/Sync';
import TimelineIcon from '@material-ui/icons/Timeline';
import { makeStyles } from '@material-ui/styles';

import React, { FunctionComponent, useCallback, useMemo } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { getLocale, isI18nLoaded, t } from 'src/components/i18n/Localization';
import { TabBar, TabValue } from 'src/components/interface/Tabs';
import { setTab } from 'src/components/redux/slices/map/interface/Actions';
import { selectEditorEnabled, selectTab } from 'src/components/redux/slices/map/interface/Selector';
import { selectOverrideLang } from 'src/components/redux/slices/map/options/Selector';
import { AppState } from 'src/components/redux/Types';
import { Empty, UIControlsTab } from 'src/components/Types';

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
const mapDispatchToProps = {
  setTab,
};
type ControlsTabsStateProps = ReturnType<typeof mapStateToProps>;
type ControlsTabsDispatchProps = typeof mapDispatchToProps;
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

  const tabList = useMemo(
    () => [
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
        label: t('map-ui:editor-help'),
        value: 'help' as TabValue,
        order: 21,
        icon: <LiveHelpIcon />,
      },
      {
        enabled: editorEnabled,
        label: t('map-ui:editor-elements'),
        value: 'elements' as TabValue,
        order: 22,
        icon: <CreateIcon />,
      },
      {
        enabled: !editorEnabled,
        label: t('map-ui:markers'),
        value: 'features' as TabValue,
        order: 31,
        icon: <PlaceIcon />,
      },
      {
        enabled: !editorEnabled,
        label: t('map-ui:routes'),
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
    ],
    [editorEnabled, isI18nLoaded(), getLocale()]
  );

  const setTabValue = useCallback((value) => setTab(value as UIControlsTab), []);

  return (
    <TabBar
      className={classes.tabBar}
      displayed
      value={currentTab as TabValue}
      onChange={setTabValue}
      tabs={tabList}
      icons
    />
  );
};

const ControlsTabs = connector(_ControlsTabs);

export default ControlsTabs;
