import React from 'react';
import { TileLayer as LeafletTileLayer } from 'react-leaflet';

import { useImageExtension } from '~/components/interface/Image';
import {
  MAP_BOUNDS,
  MAXIMUM_ZOOM,
  MAXIMUM_NATIVE_ZOOM,
  MINIMUM_ZOOM,
  TILE_URL,
} from '~/components/preferences/DefaultPreferences';

const TileLayer = () => {
  // Check for WebP support.
  const ext = useImageExtension(true);

  // Wait until we get confirmation of WebP support.
  if (ext == null) return null;

  const tileUrl = TILE_URL.replace('{ext}', ext);

  return (
    <LeafletTileLayer
      url={tileUrl}
      noWrap
      bounds={MAP_BOUNDS}
      errorTileUrl={`tiles/blank.${ext}`}
      maxZoom={MAXIMUM_ZOOM}
      minZoom={MINIMUM_ZOOM}
      maxNativeZoom={MAXIMUM_NATIVE_ZOOM}
      minNativeZoom={MINIMUM_ZOOM}
    />
  );
};

export default TileLayer;
