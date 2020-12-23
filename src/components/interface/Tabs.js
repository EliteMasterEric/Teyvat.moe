import { Box, Tabs as MaterialTabs, Tab as MaterialTab } from '@material-ui/core';
import React from 'react';
import { useDebouncedState } from '../Util';

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

export const Tab = ({ label, value, _order }) => {
  return <MaterialTab label={label} value={value} />;
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
 * @param {*} tabs: {label: 'About', value: 'about', order: 0}
 */
export const TabBar = ({ fullWidth = true, value, onChange, tabs }) => {
  const [currentValue, setCurrentValue] = useDebouncedState(value, onChange);

  <MaterialTabs
    value={currentValue}
    onChange={(_event, newValue) => setCurrentValue(newValue)}
    variant={fullWidth ? 'fullWidth' : null}
    centered
    indicatorColor="primary"
    textColor="primary"
  >
    {sortByOrder(tabs).map((tab) => (
      <Tab {...tab} />
    ))}
  </MaterialTabs>;
};
