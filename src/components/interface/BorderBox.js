import { Box, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import React from 'react';
import { useImageExtension } from './Image';

const BORDER_BOX_IMAGE_PNG = require('~/images/controls/filter_container.png').default;
const BORDER_BOX_IMAGE_WEBP = require('~/images/controls/filter_container.webp').default;

const useStyles = makeStyles((_theme) => ({
  borderBox: {
    borderImage: ({ borderBoxImage }) => `url(${borderBoxImage}) 32 round`,
    border: '16px solid transparent',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    marginBottom: 12,
    marginRight: 12,
    overflow: 'hidden auto',
  },
  displayNone: {
    display: 'none',
  },
}));

const BorderBox = ({ children, displayed = true }) => {
  const ext = useImageExtension();

  const borderBoxImage = ext === 'webp' ? BORDER_BOX_IMAGE_WEBP : BORDER_BOX_IMAGE_PNG;

  const classes = useStyles({ borderBoxImage });

  return (
    <Box className={clsx(classes.borderBox, displayed ? null : classes.displayNone)}>
      {children}
    </Box>
  );
};

export default BorderBox;
