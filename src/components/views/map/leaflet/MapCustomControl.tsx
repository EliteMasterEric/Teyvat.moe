/**
 * Provides the ability to inject a custom control onto a Leaflet map.
 */

import { Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { DomEvent } from 'leaflet';
import React, { FunctionComponent, ReactNode, useCallback, useRef } from 'react';

/**
 * @see https://github.com/LiveBy/react-leaflet-control/issues/44
 * @see https://react-leaflet.js.org/docs/example-react-control
 */

// Classes used by Leaflet to position controls.
type Position = 'topleft' | 'topright' | 'bottomleft' | 'bottomright';
const POSITION_CLASSES: Record<Position, string> = {
  bottomleft: 'leaflet-bottom leaflet-left leaflet-bottom-left-offset',
  bottomright: 'leaflet-bottom leaflet-right',
  topleft: 'leaflet-top leaflet-left leaflet-top-left-offset',
  topright: 'leaflet-top leaflet-right',
};

const useStyles = makeStyles((_theme) => ({
  button: {
    cursor: 'pointer',
  },
}));

type MapCustomControlButtonProps = React.HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  className?: string;
  tooltip?: string;
  // other includes attributes passed to the div.
};

export const MapCustomControlButton: FunctionComponent<MapCustomControlButtonProps> = ({
  children,
  className = '',
  tooltip = '',
  ...other
}) => {
  const classes = useStyles();

  const innerReference = useRef(null);
  const referenceCallback = useCallback((node) => {
    if (innerReference.current) {
      // Make sure to cleanup any events/references added to the last instance
    }

    if (node) {
      // Check if a node is actually passed. Otherwise node would be null.
      // You can now do what you need to, addEventListeners, measure, etc.

      // Prevent clicking the button from affecting the map.
      DomEvent.disableClickPropagation(node).disableScrollPropagation(node);
    }

    // Save a reference to the node
    innerReference.current = node;
  }, []);

  return (
    <Tooltip title={tooltip}>
      <div ref={referenceCallback} className={clsx(classes.button, className)} {...other}>
        {children}
      </div>
    </Tooltip>
  );
};

interface MapCustomControlProps {
  children: ReactNode;
  position?: Position;
  containerProps?: React.HTMLAttributes<HTMLDivElement>; // Props for a div.
  containerClass?: string;
  className?: string;
}

const MapCustomControl: FunctionComponent<MapCustomControlProps> = ({
  children,
  position = 'topleft',
  containerProps = {},
  containerClass = '',
  className = '',
  ...other
}) => {
  return (
    <div className={clsx(POSITION_CLASSES[position], className)} {...other}>
      <div className={clsx('leaflet-control', 'leaflet-bar', containerClass)} {...containerProps}>
        {children}
      </div>
    </div>
  );
};

export default MapCustomControl;
