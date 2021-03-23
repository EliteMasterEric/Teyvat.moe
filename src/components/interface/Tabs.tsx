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
  makeStyles,
  useTheme,
} from '@material-ui/core';
import React, { useRef, useEffect, ReactElement, FunctionComponent } from 'react';

import { A } from 'ts-toolbelt';
import { LocalizedString } from 'src/components/Types';
import { CloneProps, useDebouncedState } from 'src/components/util';

const useStyles = makeStyles((_theme) => ({
  tab: { minWidth: 0 },
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
  return (
    <Box
      display={displayed ? 'flex' : 'none'}
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

  const sortedTabs = sortByOrder(tabs);

  // Fix indicator breaking when tabs dynamically change.
  const theme = useTheme();
  const actionRef = useRef<TabsActions | null>(null);
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (actionRef.current) {
        actionRef.current.updateIndicator();
      }
    }, theme.transitions.duration.enteringScreen);

    return () => {
      clearTimeout(timeout);
    };
  }, [tabs, theme]);

  if (!displayed) return null;

  return (
    <MaterialTabs
      action={actionRef}
      value={currentValue}
      onChange={(_event, newValue) => setCurrentValue(newValue)}
      centered
      variant="fullWidth"
      scrollButtons={scrollButtons}
      indicatorColor="primary"
      textColor="primary"
      {...other}
    >
      {sortedTabs.map((tab) => {
        if (!tab.enabled) return null;

        return icons ? (
          <CloneProps key={tab.value} value={tab.value}>
            {(tabProps) => (
              <Tooltip title={tab.label}>
                <MaterialTab
                  wrapped
                  icon={tab.icon}
                  classes={{ root: classes.tab }}
                  {...tabProps}
                />
              </Tooltip>
            )}
          </CloneProps>
        ) : (
          <MaterialTab
            wrapped
            key={tab.value}
            label={tab.label}
            value={tab.value}
            classes={{ root: classes.tab }}
          />
        );
      })}
    </MaterialTabs>
  );
};
