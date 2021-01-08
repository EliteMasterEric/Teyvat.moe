/**
 * Provides the ability to inject a custom control onto a Leaflet map.
 */

import { makeStyles, Tooltip } from '@material-ui/core';
import clsx from 'clsx';
import { DomEvent } from 'leaflet';
import React from 'react';

/**
 * @see https://github.com/LiveBy/react-leaflet-control/issues/44
 * @see https://react-leaflet.js.org/docs/example-react-control
 */

// Classes used by Leaflet to position controls.
const POSITION_CLASSES = {
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

export const MapCustomControlButton = ({ children, className, tooltip = '', ...other }) => {
  const classes = useStyles();

  const innerRef = React.useRef(null);
  const refCb = React.useCallback((node) => {
    if (innerRef.current) {
      // Make sure to cleanup any events/references added to the last instance
    }

    if (node) {
      // Check if a node is actually passed. Otherwise node would be null.
      // You can now do what you need to, addEventListeners, measure, etc.

      // Prevent clicking the button from affecting the map.
      DomEvent.disableClickPropagation(node).disableScrollPropagation(node);
    }

    // Save a reference to the node
    innerRef.current = node;
  }, []);

  return (
    <Tooltip title={tooltip}>
      <div ref={refCb} className={clsx(classes.button, className)} {...other}>
        {children}
      </div>
    </Tooltip>
  );
};

const MapCustomControl = ({
  position = 'topleft',
  containerProps,
  containerClass,
  children,
  className,
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
