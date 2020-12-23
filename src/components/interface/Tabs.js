import { Box, Tabs as MaterialTabs, Tab as MaterialTab } from '@material-ui/core';
import React from 'react';

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

export const Tab = ({ label }) => {};

export const TabBar = ({ fullWidth = true }) => {
  <MaterialTabs variant={fullWidth ? 'fullWidth' : null}></MaterialTabs>;
};
