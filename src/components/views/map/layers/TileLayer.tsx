import { createTileLayerComponent, LeafletContextInterface } from '@react-leaflet/core';
import { LatLngExpression, Point, PointExpression, TileLayer, TileLayerOptions } from 'leaflet';
import React, { FunctionComponent } from 'react';
// This has to be installed if react-leaflet is.
// eslint-disable-next-line import/no-extraneous-dependencies
import { TileLayerProps } from 'react-leaflet';

import { useImageExtension } from 'src/components/interface/Image';
import ErrorHandler, { ErrorHandlerComponent } from 'src/components/views/error/ErrorHandler';
import {
  MAP_BOUNDS,
  MAP_CSS_OFFSET,
  MAP_LATLNG_OFFSET,
  MAXIMUM_NATIVE_ZOOM,
  MAXIMUM_ZOOM,
  MINIMUM_ZOOM,
  TILE_URL,
} from 'src/components/views/map/LayerConstants';

interface AdvancedTileLayerOptions extends TileLayerOptions {
  latLngOffset?: LatLngExpression;
  cssOffset?: PointExpression;
}

/**
 * Create a new Leaflet object extending the existing TileLayer.
 * New options:
 * - latLngOffset: Adjust the position of the TileLayer by a given X/Y coordinate, in map units.
 * - cssOffset: Adjust the position of the TileLayer by a given X/Y coordinate, in pixels.
 */
class AdvancedTileLayer extends TileLayer {
  // Convert a lat/lng position to a pixel offset.
  // Takes into account zoom level.
  _cssOffset: PointExpression = [0, 0];
  _latLngOffset: LatLngExpression = [0, 0];
  options: AdvancedTileLayerOptions = {};

  convertLatLngToPixelOffset(position: LatLngExpression): Point {
    // console.log(this._map.());
    return this._map.project(position);
  }
  // Gets the position (in CSS pixels) of a given tile.
  _getTilePos(tileCoords: Point): Point {
    // The CSS position of the TileLayer.
    const cssBasePos: Point = (TileLayer.prototype as any)._getTilePos.call(this, tileCoords);

    // Offset by a lat/lng value, converted to a raw pixel value.
    const latLngPixelOffset = this.convertLatLngToPixelOffset(this._latLngOffset ?? [0, 0]);
    const latLngOffsetPos = cssBasePos.add(latLngPixelOffset);

    // Offset by a raw pixel value.
    const cssOffsetPos = latLngOffsetPos.add(this._cssOffset ?? [0, 0]);

    return cssOffsetPos;
  }
}

/**
 * Add a function which is called after the AdvancedTileLayer is initialized.
 * This function stores the provided options.
 * This has to be an unnamed, non-arrow function to be able to access 'this'.
 */
// eslint-disable-next-line func-names
AdvancedTileLayer.addInitHook(function (this: AdvancedTileLayer) {
  if ('latLngOffset' in this.options) this._latLngOffset = this.options.latLngOffset ?? [0, 0];
  this._cssOffset = this.options.cssOffset ?? [0, 0];
});

type AdvancedTileLayerParam = TileLayerOptions & {
  url: string;
};

const createTileLayer = (
  { url, ...options }: AdvancedTileLayerParam,
  ctx: LeafletContextInterface
) => {
  const instance = new AdvancedTileLayer(url, options);
  return { instance, context: { ...ctx, overlayContainer: instance } };
};

interface AdvancedTileLayerComponentProps extends TileLayerProps {
  url: string;
  latLngOffset: LatLngExpression;
  cssOffset: PointExpression;
}

const AdvancedTileLayerComponent = createTileLayerComponent<
  AdvancedTileLayer,
  AdvancedTileLayerComponentProps
>(createTileLayer);

const ErrorTileLayer: ErrorHandlerComponent = ({ error }) => {
  if (error == null) return null;

  return (
    <div style={{ color: 'white', fontSize: 24 }}>
      [TILELAYER ERROR]: {error.name}: {error.message}
    </div>
  );
};

const MainTileLayer: FunctionComponent = () => {
  // Check for WebP support.
  const ext = useImageExtension(true);

  // Wait until we get confirmation of WebP support.
  if (ext == null) return null;

  const tileUrl = TILE_URL.replace('{ext}', ext);

  return (
    <ErrorHandler errorHandler={ErrorTileLayer}>
      <AdvancedTileLayerComponent
        url={tileUrl}
        noWrap
        latLngOffset={MAP_LATLNG_OFFSET}
        cssOffset={MAP_CSS_OFFSET}
        bounds={MAP_BOUNDS}
        errorTileUrl={`tiles/blank.${ext}`}
        maxZoom={MAXIMUM_ZOOM}
        minZoom={MINIMUM_ZOOM}
        maxNativeZoom={MAXIMUM_NATIVE_ZOOM}
        minNativeZoom={MINIMUM_ZOOM}
      />
    </ErrorHandler>
  );
};

export default MainTileLayer;
