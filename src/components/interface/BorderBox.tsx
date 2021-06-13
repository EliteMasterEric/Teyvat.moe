/**
 * Provides a component to display a simple flex box with a stylized border.
 */

import { Box, BoxProps } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import React, { FunctionComponent } from 'react';
import { getNextImageUrl } from './Image';

const DEFAULT_IMAGE = getNextImageUrl('/images/controls/filter_container.png', 96, 96);

const useStyles = makeStyles((_theme) => ({
  borderBox: {
    border: '16px solid transparent',
    boxSizing: 'border-box',
    marginBottom: 12,
    marginRight: 12,
  },
  boxShow: {
    display: 'flex',
  },
  boxHide: {
    display: 'none',
  },
}));

interface BorderBoxProps extends Partial<Omit<BoxProps, 'flexDirection'>> {
  children: React.ReactNode;
  displayed?: boolean;
  direction: 'column' | 'row';
  grow?: boolean;
  wrap?: boolean;
  source?: string;
  className?: string;
}

/**
 * Display a flex box with a fancy border.
 * @param {*} param0
 */
const BorderBox: FunctionComponent<BorderBoxProps> = ({
  children,
  displayed = true,
  direction,
  grow = true,
  wrap = false,
  source = DEFAULT_IMAGE,
  className,
  ...other
}) => {
  const classes = useStyles();

  return (
    <Box
      className={clsx(classes.borderBox, displayed ? classes.boxShow : classes.boxHide, className)}
      style={{ borderImage: `url(${source}) 32 round`, flexDirection: direction }}
      flexGrow={grow ? '1' : '0'}
      flexWrap={wrap ? 'wrap' : 'none'}
      {...other}
    >
      {children}
    </Box>
  );
};

export default BorderBox;
