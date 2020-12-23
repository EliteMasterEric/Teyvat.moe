import {
  Box,
  Tabs as MaterialTabs,
  Tab as MaterialTab,
  makeStyles,
  useTheme,
} from '@material-ui/core';
import React from 'react';
import { useDebouncedState } from '../Util';

const useStyles = makeStyles((_theme) => ({
  tab: { minWidth: 0 },
}));

/**
 * A box view that can easily be hidden.
 */
export const TabView = ({ children, displayed, grow = false, ...other }) => {
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

const sortByOrder = (array) => {
  return array.sort((a, b) => {
    // Sort the features by lowest order first.
    const orderA = a.order;
    const orderB = b.order;

    if (orderA < orderB) return -1;
    return orderA > orderB ? 1 : 0;
  });
};

/**
 * Debounced tab bar.
 * @param {*} tabs: {label: 'About', value: 'about', order: 0, enabled: true}
 */
export const TabBar = ({ displayed = true, scroll = false, value, onChange, tabs }) => {
  const classes = useStyles();

  const [currentValue, setCurrentValue] = useDebouncedState(value, onChange);

  // Fix indicator breaking when tabs dynamically change.
  const theme = useTheme();
  const actionRef = React.useRef();
  React.useEffect(() => {
    console.log('useEffect');
    const timeout = setTimeout(() => {
      if (actionRef?.current) {
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
      variant={scroll ? 'scrollable' : ''}
      centered
      scrollButtons={scroll ? 'on' : 'off'}
      indicatorColor="primary"
      textColor="primary"
    >
      {sortByOrder(tabs).map((tab) => {
        if (!tab.enabled) return null;
        return <MaterialTab label={tab.label} value={tab.value} classes={{ root: classes.tab }} />;
      })}
    </MaterialTabs>
  );
};
