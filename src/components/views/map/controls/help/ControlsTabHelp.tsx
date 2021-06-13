/**
 * Provides the view which displays the Help tab of the map controls.
 */
import { makeStyles } from '@material-ui/styles';
import React, { memo, useState, FunctionComponent, useMemo } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { getLocale, isI18nLoaded, t } from 'src/components/i18n/Localization';
import { TabBar, TabValue } from 'src/components/interface/Tabs';
import {
  selectEditorEnabled,
  selectIsTabDisplayed,
} from 'src/components/redux/slices/map/interface/Selector';
import { selectOverrideLang } from 'src/components/redux/slices/map/options/Selector';
import { AppState } from 'src/components/redux/Types';
import { Empty } from 'src/components/Types';
import ControlsSubtabChangelog from 'src/components/views/map/controls/help/ControlsSubtabChangelog';
import ControlsSubtabHelp from 'src/components/views/map/controls/help/ControlsSubtabHelp';

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
type ControlsTabHelpStateProps = ReturnType<typeof mapStateToProps>;
const connector = connect<ControlsTabHelpStateProps, Empty, Empty, AppState>(mapStateToProps);

type ControlsTabHelpProps = ConnectedProps<typeof connector>;

const _ControlsTabHelp: FunctionComponent<ControlsTabHelpProps> = ({ displayed }) => {
  // The current subtab is maintained as an internal state,
  // rather than in the Redux global state.
  const [helpTab, setHelpTab] = useState<TabValue>('changelog' as TabValue);
  const classes = useStyles();

  const tabs = useMemo(
    () => [
      { enabled: true, order: 11, label: t('changelog'), value: 'changelog' as TabValue },
      { enabled: true, order: 12, label: t('help'), value: 'help' as TabValue },
    ],
    [isI18nLoaded(), getLocale()]
  );

  return (
    <>
      <TabBar
        displayed={displayed}
        icons={false}
        value={helpTab}
        onChange={setHelpTab}
        tabs={tabs}
        className={classes.tabBar}
      />
      <ControlsSubtabChangelog displayed={displayed && helpTab === 'changelog'} />
      <ControlsSubtabHelp displayed={displayed && helpTab === 'help'} />
    </>
  );
};

const ControlsTabHelp = connector(memo(_ControlsTabHelp));

export default ControlsTabHelp;
