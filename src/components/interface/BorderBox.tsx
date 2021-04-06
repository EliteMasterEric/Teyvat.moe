/**
 * Provides a component to display a simple flex box with a stylized border.
 */

import { Box, BoxProps, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import React, { FunctionComponent } from 'react';
import { getNextImageUrl } from 'src/components/interface/Image';

const DEFAULT_IMAGE = getNextImageUrl('/images/controls/filter_container.png', 96, 96);

const useStyles = makeStyles((_theme) => ({
  borderBox: {
    borderImage: ({ img }: { img: any }) => `url(${img}) 32 round`,
    border: '16px solid transparent',
    boxSizing: 'border-box',
    marginBottom: 12,
    marginRight: 12,
  },
}));

interface BorderBoxProps extends Partial<BoxProps> {
  children: React.ReactNode;
  displayed?: boolean;
  direction?: 'column' | 'row';
  grow?: boolean;
  wrap?: boolean;
  src?: string;
  className?: string;
}

/**
 * Display a flex box with a fancy border.
 * @param {*} param0
 */
const BorderBox: FunctionComponent<BorderBoxProps> = ({
  children,
  displayed = true,
  direction = 'column',
  grow = true,
  wrap = false,
  src,
  className = null,
  ...other
}) => {
  const classes = useStyles({ img: src != null ? src : DEFAULT_IMAGE });

  if (!displayed) return null;

  return (
    <Box
      className={clsx(classes.borderBox, className)}
      // display={displayed ? 'flex' : 'none'}
      display="flex"
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
