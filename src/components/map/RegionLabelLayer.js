import clsx from 'clsx';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { connect } from 'react-redux';

import L from 'leaflet';

import { GeoJSON } from 'react-leaflet';
import { localizeField } from '../FeatureLocalization';
import { hashObject } from '../Util';

const regionLabelData = require('../../data/core/map-labels.json');

const RegionLabel = ({ featureData, zoomLevel }) => {
  const name = localizeField(featureData?.properties?.label);
  /**
   * Dynamically style based on zoom level.
   * Currently used to scale text, but if needed,
   * a switch/case structure could be used for
   * finer tuning.
   */
  const style = {
    fontSize: `${zoomLevel * 0.25}em`,
    '-webkit-text-stroke': `${zoomLevel * 0.125}px black`,
    textStroke: `${zoomLevel * 0.125}px black`,
    top: `-${zoomLevel * 2}px`,
  };
  return (
    <h1 className={clsx('map-region-label-text')} style={style}>
      {name}
    </h1>
  );
};

const _RegionLabelLayer = ({ mapRef, displayed }) => {
  const [zoomLevel, storeZoomLevel] = React.useState(
    mapRef?.current?.leafletElement?.getZoom() ?? 4
  );

  const pointToLayer = (featureData, latLng) => {
    const html = ReactDOMServer.renderToString(
      <RegionLabel featureData={featureData} zoomLevel={zoomLevel} />
    );

    return L.marker([latLng.lng, latLng.lat], {
      interactive: false, // Allow clicks to pass through.
      icon: L.divIcon({
        html,
        className: 'map-region-label-marker',
      }),
      zIndexOffset: -900,
    });
  };

  /**
   * Update whenever the zoom level changes.
   */
  React.useEffect(() => {
    mapRef.current.leafletElement.on('zoomend', () => {
      storeZoomLevel(mapRef.current.leafletElement.getZoom());
    });
  }, [mapRef.current.leafletElement]);

  // TODO: We destroy the layer if it's hidden. Is there a more performant way?
  if (!displayed) return null;

  return (
    <GeoJSON
      key={hashObject({ regionLabelData, zoomLevel })}
      pointToLayer={pointToLayer}
      data={regionLabelData.data}
    />
  );
};

const mapStateToProps = (state) => ({
  displayed: state.options.regionLabelsEnabled,
});
const mapDispatchToProps = (_dispatch) => ({});
const RegionLabelLayer = connect(mapStateToProps, mapDispatchToProps)(_RegionLabelLayer);

export default RegionLabelLayer;
