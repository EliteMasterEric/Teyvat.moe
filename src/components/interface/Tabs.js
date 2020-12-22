import { Box } from '@material-ui/core';
import React from 'react';

export const TabView = ({ children, displayed }) => {
  return (
    <Box
      display={displayed ? 'flex' : 'none'}
      flexDirection="column"
      height="100%"
      overflow="hidden"
    >
      {children}
    </Box>
  );
};
