/**
 * Provides a component to display a simple flex box with a stylized border.
 */

import { Box, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import React, { ReactElement } from 'react';

import { useImageExtension } from '~/components/interface/Image';

const BorderBoxImagePNG = require('~/images/controls/filter_container.png').default;
const BorderBoxImageWEBP = require('~/images/controls/filter_container.webp').default;

const useStyles = makeStyles((_theme) => ({
  borderBox: {
    borderImage: ({ img }: { img: any }) => `url(${img}) 32 round`,
    border: '16px solid transparent',
    boxSizing: 'border-box',
    marginBottom: 12,
    marginRight: 12,
  },
}));

/**
 * Display a flex box with a fancy border.
 * @param {*} param0
 */
const BorderBox = ({
  children,
  displayed = true,
  direction = 'column',
  grow = true,
  wrap = false,
  image = null,
  className = null,
  ...other
}: {
  children: React.ReactNode;
  displayed: boolean;
  direction: 'column' | 'row';
  grow: boolean;
  wrap: boolean;
  image: null | any;
  className: null | string;
}): ReactElement => {
  const ext = useImageExtension();

  const borderBoxImage = ext === 'webp' ? BorderBoxImageWEBP : BorderBoxImagePNG;

  const classes = useStyles({ img: image !== null ? image : borderBoxImage });

  return (
    <Box
      className={clsx(classes.borderBox, className)}
      display={displayed ? 'flex' : 'none'}
      flexDirection={direction}
      flexGrow={grow ? '1' : '0'}
      flexWrap={wrap ? 'wrap' : 'none'}
      {...other}
    >
      {children}
    </Box>
  );
};

export default BorderBox;
