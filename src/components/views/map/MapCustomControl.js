/**
 * Provides the ability to inject a custom control onto a Leaflet map.
 */

import React from 'react';

/**
 * @see https://github.com/LiveBy/react-leaflet-control/issues/44
 * @see https://react-leaflet.js.org/docs/example-react-control
 */

// Classes used by Leaflet to position controls.
const POSITION_CLASSES = {
  bottomleft: 'leaflet-bottom leaflet-left',
  bottomright: 'leaflet-bottom leaflet-right',
  topleft: 'leaflet-top leaflet-left leaflet-top-left-offset',
  topright: 'leaflet-top leaflet-right',
};

const MapCustomControl = ({ position = 'topleft', containerProps, children }) => {
  return (
    <div className={POSITION_CLASSES[position]}>
      <div className="leaflet-control leaflet-bar" {...containerProps}>
        {children}
      </div>
    </div>
  );
};

export default MapCustomControl;
