/**
 * Contains data for map feature loading and validation.
 */

import Joi from 'joi';
import L from 'leaflet';
import _ from 'lodash';

import { MSF_FEATURE_SCHEMA, MSF_ROUTES_SCHEMA } from '~/components/data/MarkerDataFormatSchema';
import { BLANK_IMAGE } from '../interface/Image';
import { importFromContext } from '../Util';

const localizedField = Joi.object().pattern(/[-a-zA-Z0-9]+/, Joi.string().allow(''));

const imagePath = Joi.string()
  .regex(/([-a-zA-Z0-9]+\/)*[-_a-zA-Z0-9]+/)
  .allow(''); // Exclude the file extension.

const geoJSONCoordinate = Joi.array().items(Joi.number().required()).length(2);

const geoJSONMarker = Joi.object({
  id: Joi.number().integer().positive(),
  type: 'Feature',
  geometry: {
    type: 'Point',
    coordinates: geoJSONCoordinate.required(),
  },
  properties: {
    popupTitle: localizedField.required(),
    popupContent: localizedField.required(),
    popupMedia: imagePath.required(),
  },
});

const geoJSONRoute = Joi.object({
  id: Joi.number().integer().positive(),
  type: 'Feature',
  geometry: {
    type: 'LineString',
    coordinates: Joi.array().items(geoJSONCoordinate).min(2),
  },
  properties: {
    popupTitle: localizedField.required(),
    popupContent: localizedField.required(),
    popupMedia: imagePath.required(),
  },
});

const markerStyle = Joi.object({
  marker: Joi.boolean().optional().default(false), // Optional.

  // Specify these style keys if the simple marker style is not used.
  key: Joi.string()
    .regex(/[-a-z]+/)
    .when('marker', { is: true, then: Joi.optional(), otherwise: Joi.required() }), // Optional but allowed if marker = true. Required if marker = false.
  svg: Joi.boolean().when('marker', {
    is: true,
    then: Joi.forbidden(),
    otherwise: Joi.optional().default(false),
  }), // Defaults to false.
  iconSize: Joi.array()
    .length(2)
    .items(Joi.number())
    .when('marker', { is: true, then: Joi.forbidden(), otherwise: Joi.required() }),
  iconAnchor: Joi.array()
    .length(2)
    .items(Joi.number())
    .when('marker', { is: true, then: Joi.forbidden(), otherwise: Joi.required() }),
  shadowAnchor: Joi.array()
    .length(2)
    .items(Joi.number())
    .when('marker', { is: true, then: Joi.forbidden(), otherwise: Joi.required() }),
  shadowSize: Joi.array()
    .length(2)
    .items(Joi.number())
    .when('marker', { is: true, then: Joi.forbidden(), otherwise: Joi.required() }),
  popupAnchor: Joi.array()
    .length(2)
    .items(Joi.number())
    .when('marker', { is: true, then: Joi.forbidden(), otherwise: Joi.required() }),
  className: Joi.string()
    .regex(/[-a-zA-Z0-9]+/)
    .when('marker', { is: true, then: Joi.forbidden() })
    .optional(), // Optional, but forbidden if marker = true.

  // This niche attribute is used when clusterMarkers is on but marker is false.
  clusterIcon: Joi.string()
    .regex(/[-a-z]+/)
    .when('marker', { is: false, then: Joi.optional(), otherwise: Joi.forbidden() }), // Optional but allowed if marker = false. Otherwise forbidden.
});

const LEGACY_FEATURE_SCHEMA = Joi.object({
  name: localizedField.required(),
  description: localizedField.optional(),
  cluster: Joi.boolean(),
  enabled: Joi.boolean().optional().default(true),
  respawn: Joi.number().integer().positive().optional().default(-1),
  icons: {
    filter: Joi.string()
      .regex(/[-a-zA-Z0-9]+/)
      .required(),
    base: markerStyle.required(),
    done: markerStyle.required(),
  },
  data: Joi.array()
    .items(geoJSONMarker) // Array can be empty.
    .unique((a, b) => a.id === b.id), // IDs must be unique.
});

const LEGACY_ROUTE_SCHEMA = Joi.object({
  name: localizedField.required(),
  enabled: Joi.boolean().optional().default(true),
  icons: {
    filter: Joi.string()
      .regex(/[-a-zA-Z0-9]+/)
      .required(),
  },
  data: Joi.array()
    .items(geoJSONRoute) // Array can be empty.
    .unique((a, b) => a.id === b.id), // IDs must be unique.
});

const VALIDATION_OPTIONS = {
  abortEarly: true, // Stop validation at the first error.
  convert: true, // Throw an error if a value is not the proper data type.
  allowUnknown: false, // Throw an error when an unspecified key is found.
  skipFunctions: false, // Ignore unknown keys with a function value.
  stripUnknown: false, // Strip unknown elements from the validated object.
  language: {
    // Override validation messages here.
    // See the default language: https://github.com/sideway/joi/blob/v14.3.1/lib/language.js
  },
  presence: 'required', // Specifies the default presence. Can be overridden on a per-key basis.
  noDefaults: false, // When true, don't insert default values into the validated object.
};

export const validateFeatureData = (input) => {
  if (input == null) {
    console.error(`Feature is undefined!`);
    return null;
  }
  switch (input.format) {
    case 2:
      return MSF_FEATURE_SCHEMA.validate(input, { convert: true });
    case 1:
    default:
      console.error(
        `Feature (${JSON.stringify(input.name)}) using outdated MSF version: ${input.format}`
      );
      return null;
  }
};

/**
 * If valid, validation.value contains a validated data set.
 * If not valid, validation.error contains the error data.
 */
export const validateRouteData = (input) => {
  if (input == null) {
    console.error(`Route is undefined!`);
    return null;
  }
  switch (input.format) {
    case 2:
      return MSF_ROUTES_SCHEMA.validate(input, { convert: true });
    case 1:
    default:
      console.error(
        `Route (${JSON.stringify(input.name)}) using outdated MSF version: ${input.format}`
      );
      return null;
  }
};

const featuresContext = require.context('../../data/features/', true, /.jsonc?$/);
export const listFeatureKeys = () => featuresContext.keys();
export const loadFeature = (key) => {
  const featureData = importFromContext(featuresContext, key);

  const validation = validateFeatureData(featureData);
  if (validation == null || validation.error) {
    console.warn(`ERROR during validation of feature '${key}'`);
    console.warn(validation);
    return null;
  }
  return validation.value;
};

const routesContext = require.context('../../data/routes/', true, /.jsonc?$/);
export const listRouteKeys = () => routesContext.keys();
export const loadRoute = (key) => {
  const routeData = importFromContext(routesContext, key);

  const validation = validateRouteData(routeData);
  if (validation == null || validation.error) {
    console.warn(`ERROR during validation of route '${key}'`);
    console.warn(validation);
    return null;
  }
  return validation.value;
};

/**
 * Converts JSON data into a Map feature layer object.
 * @param {*} dataJSON The imported JSON, brought in using require()
 */
export const createGeoJSONLayer = (dataJSON) => {
  return L.geoJSON(dataJSON, {
    style: () => {
      // Style a (feature) based on its properties.
      return {};
    },
  });
};

// https://github.com/cyrilwanner/next-optimized-images/issues/16
const iconsContext = require.context('../../images/icons', true, /\.(png|webp|svg)/);
export const getFilterIconURL = (key, ext) => {
  if (key && key !== 'none') {
    return importFromContext(iconsContext, `./filter/${key}.${ext}`);
  }
  return BLANK_IMAGE;
};

export const createMapIcon = ({
  key,
  marker = false,
  clusterIcon = '',
  done = false,
  ext = 'png',
  ...options
}) => {
  if (marker) {
    // Use the marker image.
    const iconUrl = getFilterIconURL(key, ext);

    // This part is a little complex.
    // As a neat hack, the marker"s shadow is offset and used to implement the frame.
    // That way, the marker can be a separate icon from the image representing the item.
    const shadowUrl = importFromContext(
      iconsContext,
      `./marker/marker_${done ? 'green' : 'white'}_bg.svg`
    );

    const iconHTML = `<div class='map-marker-container'>
      <img style='width: 40px; height: 40px;' class='map-marker-shadow' alt="" src="${shadowUrl}"/>
      <img style='width: 23px; height: 23px;' class='map-marker-img' alt="" src='${iconUrl}'/>
    </div>`;

    return L.divIcon({
      className: `map-marker-${key}`,
      html: iconHTML,
      clusterIconUrl: iconUrl,
      // iconSize: [24, 23], // size of the icon,
      iconAnchor: [12, 34.5], // point of the icon which will correspond to marker"s location,
      popupAnchor: [0, -34.5], // point from which the popup should open relative to the iconAnchor,
      ...options,
    });
  }

  // Else, don't use the marker image.
  const iconUrl = importFromContext(iconsContext, `./map/${key}.${ext}`);

  // Handle the niche case where cluster = true and marker = false.
  const clusterIconUrl = getFilterIconURL(clusterIcon, ext);

  return L.icon({
    className: `map-marker-${key}`,
    iconUrl,
    clusterIconUrl,
    shadowUrl: '',
    ...options,
  });
};
