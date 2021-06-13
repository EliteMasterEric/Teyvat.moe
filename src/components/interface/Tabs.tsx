/**
 * Wrappers for handling a row of tabs in a bar,
 * as well as the content of those tab views.
 */

import {
  Box,
  Tab as MaterialTab,
  Tabs as MaterialTabs,
  TabsActions,
  Tooltip,
  useTheme,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import _ from 'lodash';
import React, {
  useRef,
  useEffect,
  ReactElement,
  FunctionComponent,
  useCallback,
  useMemo,
} from 'react';
import { A } from 'ts-toolbelt';

import { LocalizedString } from 'src/components/Types';
import { useDebouncedState } from 'src/components/util';

const useStyles = makeStyles((_theme) => ({
  tab: { minWidth: 0 },
  showTab: { display: 'flex' },
  hideTab: { display: 'none' },
}));

export type TabValue = A.Type<string, 'TabValue'>;
export interface Tab {
  enabled: boolean;
  label: LocalizedString;
  value: TabValue;
  order: number;
  icon?: ReactElement; // Icon may be blank.
}

interface TabViewProps {
  children: React.ReactNode;
  displayed: boolean;
  grow?: boolean;
}

/**
 * A box view that can easily be hidden.
 */
export const TabView: FunctionComponent<TabViewProps> = ({
  children,
  displayed,
  grow = false,
  ...other
}) => {
  const classes = useStyles();

  return (
    <Box
      className={displayed ? classes.showTab : classes.hideTab}
      flexDirection="column"
      flexGrow={1}
      height={grow ? 'auto' : '100%'}
      overflow="hidden auto"
      {...other}
    >
      {children}
    </Box>
  );
};

const sortByOrder = (array: Tab[]) => {
  return array.sort((a, b) => {
    // Sort the features by lowest order first.
    const orderA = a.order;
    const orderB = b.order;

    if (orderA < orderB) return -1;
    return orderA > orderB ? 1 : 0;
  });
};

type TabBarProps = Omit<React.ComponentProps<typeof MaterialTabs>, 'onChange'> & {
  displayed: boolean;
  icons: boolean;
  tabs: Tab[];
  value: TabValue;
  onChange: (value: TabValue) => void;
};

/**
 * Debounced tab bar.
 * @param {*} tabs: {label: 'About', value: 'about', order: 0, enabled: true}
 * @param {String} scroll: 'auto', 'desktop', 'on', 'off'
 */
export const TabBar: FunctionComponent<TabBarProps> = ({
  displayed = true,
  scrollButtons = 'auto',
  icons = false,
  tabs,
  value,
  onChange,
  ...other
}) => {
  const classes = useStyles();

  const [currentValue, setCurrentValue] = useDebouncedState<TabValue>(value, onChange);
  const onValueChange = useCallback(
    (_event, newValue) => setCurrentValue(newValue),
    [setCurrentValue]
  );

  // Fix indicator breaking when tabs dynamically change.
  const theme = useTheme();
  const actionReference = useRef<TabsActions | null>(null);
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (actionReference.current) {
        actionReference.current.updateIndicator();
      }
    }, theme.transitions.duration.enteringScreen);

    return () => {
      clearTimeout(timeout);
    };
  }, [tabs, theme]);

  const renderTab = useCallback(
    (tab) => {
      const label = icons ? <Tooltip title={tab.label}>{tab.icon}</Tooltip> : tab.label;

      return (
        <MaterialTab
          wrapped
          key={tab.value}
          label={label}
          value={tab.value}
          classes={{ root: classes.tab }}
        />
      );
    },
    [icons]
  );

  const renderedTabs = useMemo(() => {
    const sortedTabs = sortByOrder(tabs);

    const result = _.map(sortedTabs, (tab) => {
      if (!tab.enabled) return null;
      return renderTab(tab);
    });

    return result;
  }, [renderTab, tabs]);

  if (!displayed) return null;

  return (
    <MaterialTabs
      action={actionReference}
      value={currentValue}
      onChange={onValueChange}
      centered
      variant="fullWidth"
      scrollButtons={scrollButtons}
      indicatorColor="primary"
      textColor="primary"
      {...other}
    >
      {renderedTabs}
    </MaterialTabs>
  );
};
