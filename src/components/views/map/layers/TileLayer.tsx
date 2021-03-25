/* eslint-disable import/no-named-as-default-member */
import { createTileLayerComponent, LeafletContextInterface } from '@react-leaflet/core';
import leaflet from 'leaflet';
import { FunctionComponent } from 'react';
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

interface AdvancedTileLayerOptions extends leaflet.TileLayerOptions {
  latLngOffset: leaflet.LatLngExpression;
  cssOffset: leaflet.PointExpression;
}

/**
 * Create a new Leaflet object extending the existing TileLayer.
 * New options:
 * - latLngOffset: Adjust the position of the TileLayer by a given X/Y coordinate, in map units.
 * - cssOffset: Adjust the position of the TileLayer by a given X/Y coordinate, in pixels.
 */
class AdvancedTileLayer extends leaflet.TileLayer {
  /**
   * The default options. Any option not specified in the component properties
   * will use the values here, most of which are copied from the Leaflet source code.
   */
  options: AdvancedTileLayerOptions = {
    // Convert a lat/lng position to a pixel offset.
    // Takes into account zoom level.
    latLngOffset: [0, 0],
    cssOffset: [0, 0],

    // @option tileSize: Number|Point = 256
    // Width and height of tiles in the grid. Use a number if width and height are equal, or `L.point(width, height)` otherwise.
    tileSize: 256,

    // @option opacity: Number = 1.0
    // Opacity of the tiles. Can be used in the `createTile()` function.
    opacity: 1,

    // @option updateWhenIdle: Boolean = (depends)
    // Load new tiles only when panning ends.
    // `true` by default on mobile browsers, in order to avoid too many requests and keep smooth navigation.
    // `false` otherwise in order to display new tiles _during_ panning, since it is easy to pan outside the
    // [`keepBuffer`](#gridlayer-keepbuffer) option in desktop browsers.
    // updateWhenIdle: false,

    // @option updateWhenZooming: Boolean = true
    // By default, a smooth zoom animation (during a [touch zoom](#map-touchzoom) or a [`flyTo()`](#map-flyto)) will update grid layers every integer zoom level. Setting this option to `false` will update the grid layer only when the smooth animation ends.
    updateWhenZooming: true,

    // @option updateInterval: Number = 200
    // Tiles will not update more than once every `updateInterval` milliseconds when panning.
    updateInterval: 200,

    // @option zIndex: Number = 1
    // The explicit zIndex of the tile layer.
    zIndex: 1,

    // @option bounds: LatLngBounds = undefined
    // If set, tiles will only be loaded inside the set `LatLngBounds`.
    bounds: undefined,

    // @option maxNativeZoom: Number = undefined
    // Maximum zoom number the tile source has available. If it is specified,
    // the tiles on all zoom levels higher than `maxNativeZoom` will be loaded
    // from `maxNativeZoom` level and auto-scaled.
    maxNativeZoom: undefined,

    // @option minNativeZoom: Number = undefined
    // Minimum zoom number the tile source has available. If it is specified,
    // the tiles on all zoom levels lower than `minNativeZoom` will be loaded
    // from `minNativeZoom` level and auto-scaled.
    minNativeZoom: undefined,

    // @option noWrap: Boolean = false
    // Whether the layer is wrapped around the antimeridian. If `true`, the
    // GridLayer will only be displayed once at low zoom levels. Has no
    // effect when the [map CRS](#map-crs) doesn't wrap around. Can be used
    // in combination with [`bounds`](#gridlayer-bounds) to prevent requesting
    // tiles outside the CRS limits.
    noWrap: false,

    // @option pane: String = 'tilePane'
    // `Map pane` where the grid layer will be added.
    pane: 'tilePane',

    // @option className: String = ''
    // A custom class name to assign to the tile layer. Empty by default.
    className: '',

    // @option keepBuffer: Number = 2
    // When panning the map, keep this many rows and columns of tiles before unloading them.
    keepBuffer: 2,

    // @option minZoom: Number = 0
    // The minimum zoom level down to which this layer will be displayed (inclusive).
    minZoom: 0,

    // @option maxZoom: Number = 18
    // The maximum zoom level up to which this layer will be displayed (inclusive).
    maxZoom: 18,

    // @option subdomains: String|String[] = 'abc'
    // Subdomains of the tile service. Can be passed in the form of one string (where each letter is a subdomain name) or an array of strings.
    subdomains: 'abc',

    // @option errorTileUrl: String = ''
    // URL to the tile image to show in place of the tile that failed to load.
    errorTileUrl: '',

    // @option zoomOffset: Number = 0
    // The zoom number used in tile URLs will be offset with this value.
    zoomOffset: 0,

    // @option tms: Boolean = false
    // If `true`, inverses Y axis numbering for tiles (turn this on for [TMS](https://en.wikipedia.org/wiki/Tile_Map_Service) services).
    tms: false,

    // @option zoomReverse: Boolean = false
    // If set to true, the zoom number used in tile URLs will be reversed (`maxZoom - zoom` instead of `zoom`)
    zoomReverse: false,

    // @option detectRetina: Boolean = false
    // If `true` and user is on a retina display, it will request four tiles of half the specified size and a bigger zoom level in place of one to utilize the high resolution.
    detectRetina: false,

    // @option crossOrigin: Boolean|String = false
    // Whether the crossOrigin attribute will be added to the tiles.
    // If a String is provided, all tiles will have their crossOrigin attribute set to the String provided. This is needed if you want to access tile pixel data.
    // Refer to [CORS Settings](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes) for valid String values.
    crossOrigin: false,
  };

  constructor(urlTemplate: string, options: Partial<AdvancedTileLayerOptions>) {
    super(urlTemplate, options);

    leaflet.Util.setOptions(this, options);

    if (!this.options.latLngOffset) {
      this.options.latLngOffset = [0, 0];
    }
    if (!this.options.cssOffset) {
      this.options.cssOffset = [0, 0];
    }
  }

  convertLatLngToPixelOffset(position: leaflet.LatLngExpression): leaflet.Point {
    // console.log(this._map.());
    return this._map.project(position);
  }
  // Gets the position (in CSS pixels) of a given tile.
  _getTilePos(tileCoords: leaflet.Point): leaflet.Point {
    // The CSS position of the TileLayer.
    const cssBasePos: leaflet.Point = (leaflet.TileLayer.prototype as any)._getTilePos.call(
      this,
      tileCoords
    );

    // Offset by a lat/lng value, converted to a raw pixel value.
    const latLngPixelOffset = this.convertLatLngToPixelOffset(this.options?.latLngOffset ?? [0, 0]);
    const latLngOffsetPos = cssBasePos.add(latLngPixelOffset);

    // Offset by a raw pixel value.
    const cssOffsetPos = latLngOffsetPos.add(this.options?.cssOffset ?? [0, 0]);

    return cssOffsetPos;
  }
}

type AdvancedTileLayerParam = leaflet.TileLayerOptions & {
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
  latLngOffset: leaflet.LatLngExpression;
  cssOffset: leaflet.PointExpression;
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
  if (ext == null) {
    console.log('WebP support not determined, postponing');
    return null;
  }

  const tileUrl = TILE_URL.replace('{ext}', ext);
  console.log(`Rendering tile layer using url '${tileUrl}'`);

  return (
    <ErrorHandler errorHandler={ErrorTileLayer}>
      <AdvancedTileLayerComponent
        url={tileUrl}
        noWrap
        pane="tilePane"
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
