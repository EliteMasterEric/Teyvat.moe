/**
 * Provides the view which displays the Help tab of the map controls.
 */
import { makeStyles } from '@material-ui/core';
import React, { memo, useState, FunctionComponent } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { t } from 'src/components/i18n/Localization';
import { TabBar, TabValue, TabView } from 'src/components/interface/Tabs';
import { selectOverrideLang } from 'src/components/redux/slices/options';
import { selectEditorEnabled, selectIsTabDisplayed } from 'src/components/redux/slices/ui';
import { AppState } from 'src/components/redux/types';
import { Empty } from 'src/components/Types';
import ControlsSubtabChangelog from 'src/components/views/controls/help/ControlsSubtabChangelog';
import ControlsSubtabHelp from 'src/components/views/controls/help/ControlsSubtabHelp';

const TABS = [
  { enabled: true, order: 11, label: t('changelog'), value: 'changelog' as TabValue },
  { enabled: true, order: 12, label: t('help'), value: 'help' as TabValue },
];

const useStyles = makeStyles((_theme) => ({
  tabBar: {
    margin: 0,
    marginBottom: 8,
  },
}));

const mapStateToProps = (state: AppState) => ({
  displayed: !selectEditorEnabled(state) && selectIsTabDisplayed(state, 'help'),
  // Adding language to the props, even if it isn't used,
  // causes the component to re-render when the language changes.
  lang: selectOverrideLang(state),
});
const mapDispatchToProps = () => ({});
type ControlsTabHelpStateProps = ReturnType<typeof mapStateToProps>;
type ControlsTabHelpDispatchProps = ReturnType<typeof mapDispatchToProps>;
const connector = connect<ControlsTabHelpStateProps, ControlsTabHelpDispatchProps, Empty, AppState>(
  mapStateToProps,
  mapDispatchToProps
);

type ControlsTabHelpProps = ConnectedProps<typeof connector>;

const _ControlsTabHelp: FunctionComponent<ControlsTabHelpProps> = ({ displayed }) => {
  // The current subtab is maintained as an internal state,
  // rather than in the Redux global state.
  const [helpTab, setHelpTab] = useState<TabValue>('changelog' as TabValue);
  const classes = useStyles();

  return (
    <TabView displayed={displayed}>
      <TabBar
        displayed
        icons={false}
        value={helpTab}
        onChange={setHelpTab}
        tabs={TABS}
        className={classes.tabBar}
      />
      <ControlsSubtabChangelog displayed={helpTab === 'changelog'} />
      <ControlsSubtabHelp displayed={helpTab === 'help'} />
    </TabView>
  );
};

const ControlsTabHelp = connector(memo(_ControlsTabHelp));

export default ControlsTabHelp;
