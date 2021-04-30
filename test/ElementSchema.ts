/**
 * Contains data for map feature loading and validation.
 * This code (and thus the Joi library) should only be loaded during testing.
 * It lags too much to run this on the client, even in development.
 */
import Joi, { ValidationOptions, ValidationResult } from 'joi';
import _ from 'lodash';
import {
  clusterEnum,
  MSFFeature,
  MSFRouteGroup,
  MSF_SCHEMA_VERSION,
  respawnEnum,
  YOUTUBE_REGEX,
} from 'src/components/data/map/Element';
import { MapRegionKeys } from 'src/components/data/map/MapRegions';
import { MapTags } from 'src/components/data/map/MapTags';
import { hashObject, isDev } from 'src/components/util';

export const VALIDATION_OPTIONS: ValidationOptions = {
  abortEarly: true, // Stop validation at the first error.
  convert: false, // Throw an error if a value is not the proper data type.
  allowUnknown: false, // Throw an error when an unspecified key is found.
  skipFunctions: false, // Ignore unknown keys with a function value.
  stripUnknown: false, // Strip unknown elements from the validated object.
  presence: 'required', // Specifies the default presence. Can be overridden on a per-key basis.
  noDefaults: true, // When true, don't insert default values into the validated object.
};

/**
 * If VALIDATE_HASHES is true, the hash of each marker's coordinates will be calculated on load.
 * Set this to true to validate features before publishing.
 * Set this to false to improve performance.
 */
const VALIDATE_HASHES = isDev();

/**
 * An object of language codes.
 * English is always mandatory. Translations are optional.
 */
const localizedField = Joi.object({
  _code: Joi.string().optional(), // Code used for translation.
  en: Joi.string().required(),
}).pattern(/[a-z]{2}/, Joi.string().required());
/**
 * A path to an image in the comments folder.
 * Must start with a game region.
 */
const imagePath = Joi.string().regex(
  new RegExp(`((?:${MapRegionKeys.join('|')})/)*[-_a-zA-Z0-9]+`)
); // Exclude the file extension.
/**
 * A URL linking to a YouTube video.
 */
const youtubeUrl = Joi.string().regex(YOUTUBE_REGEX);
/**
 * The type representing a coordinate of a marker or route vector.
 */
const coordinate = Joi.array().items(Joi.number().precision(5).required()).length(2);
/**
 * The type representing a set of coordinates for a route.
 */
const coordinates = Joi.array().items(coordinate.required()).required();
/**
 * Validates that the input is a SHA1 hash.
 */
const sha1Hash = Joi.string().regex(/[\dA-F]{40}/);
/**
 * Validates that the input is a SHA1 hash, specifically of the marker's coordinates.
 *
 */
const msfId = Joi.string().valid(
  Joi.ref('coordinates', {
    adjust: (coords) => hashObject(coords, {}),
  })
);

/**
 * A list containing at least one item from the tags.json file.
 */
const tagList = Joi.array().items(Joi.alternatives(MapTags).required()).optional();

/**
 * This schema represents a marker's icon.
 */
const MSF_MARKER_ICON_SCHEMA = Joi.object({
  marker: Joi.boolean(),

  // Specify these style keys if the simple marker style is not used.
  key: Joi.string()
    .regex(/[a-z-]+/)
    .when('marker', {
      is: true,
      then: Joi.optional(),
      otherwise: Joi.required(),
    }), // Optional but allowed if marker = true. Required if marker = false.
  svg: Joi.boolean().when('marker', {
    is: true,
    then: Joi.forbidden(),
    otherwise: Joi.optional().default(false),
  }), // Defaults to false.
  iconSize: Joi.array().length(2).items(Joi.number()).when('marker', {
    is: true,
    then: Joi.forbidden(),
    otherwise: Joi.required(),
  }),
  iconAnchor: Joi.array().length(2).items(Joi.number()).when('marker', {
    is: true,
    then: Joi.forbidden(),
    otherwise: Joi.required(),
  }),
  shadowAnchor: Joi.array().length(2).items(Joi.number()).when('marker', {
    is: true,
    then: Joi.forbidden(),
    otherwise: Joi.required(),
  }),
  shadowSize: Joi.array().length(2).items(Joi.number()).when('marker', {
    is: true,
    then: Joi.forbidden(),
    otherwise: Joi.required(),
  }),
  popupAnchor: Joi.array().length(2).items(Joi.number()).when('marker', {
    is: true,
    then: Joi.forbidden(),
    otherwise: Joi.required(),
  }),
  className: Joi.string()
    .regex(/[\dA-Za-z-]+/)
    .when('marker', { is: true, then: Joi.forbidden() })
    .optional(), // Optional, but forbidden if marker = true.

  // This niche attribute is used when clusterMarkers is on but marker is false.
  clusterIcon: Joi.string()
    .regex(/[a-z-]+/)
    .when('marker', {
      is: false,
      then: Joi.optional(),
      otherwise: Joi.forbidden(),
    }), // Optional but allowed if marker = false. Otherwise forbidden.
});

/**
 * This schema represents a route in a route group.
 */
const MSF_ROUTE_SCHEMA = Joi.object({
  coordinates: coordinates.required(),
  id: VALIDATE_HASHES ? msfId.required() : sha1Hash,

  tags: tagList,

  routeColor: Joi.string().optional().default('#d32f2f'),
  routeText: Joi.string().optional().default('  ►  '),

  importIds: {
    gm_legacy: Joi.array()
      .items(
        Joi.string()
          .regex(/[A-Za-z]+\/\d+/)
          .required()
      )
      .optional(),
    gm_msfv2: Joi.array().items(sha1Hash.required()).optional(),
  },

  popupTitle: localizedField.optional(),
  popupContent: localizedField.optional(),
  popupMedia: Joi.alternatives(imagePath.allow(''), youtubeUrl).optional(),

  popupAttribution: Joi.string().default('Unknown'),
});

/**
 * This schema represents a marker in a feature.
 */
const MSF_MARKER_SCHEMA = Joi.object({
  id: VALIDATE_HASHES ? msfId.required() : sha1Hash,
  coordinates: coordinate.required(),

  tags: tagList,

  // Add the ability to correlate this marker with other markers.
  // Note that this is a many-to-many relationship.
  importIds: Joi.object({
    // https://yuanshen.site/
    yuanshen: Joi.array()
      .items(
        Joi.string()
          .regex(/\d+_\d+/)
          .required()
      )
      .optional(),
    // https://genshin-impact-map.appsample.com/#/
    appsample: Joi.array().items(Joi.string().regex(/\d+/).required()).optional(),
    // https://mapgenie.io/genshin-impact/maps/teyvat
    mapgenie: Joi.array()
      .items(
        Joi.string().regex(/\d+/).allow('')
        // .required()
      )
      .optional(),
    // GenshinMap before Marker Storage Format added.
    // Used to migrate data over.
    gm_legacy: Joi.array()
      .items(
        Joi.string()
          .regex(/[A-Za-z]+\/\d+/)
          .required()
      )
      .optional(),
    // GenshinMap after Marker Storage Format added.
    // Used to allow for renaming of markers.
    gm_msfv2: Joi.array().items(sha1Hash.required()).optional(),
  }).optional(),

  popupTitle: localizedField.optional(),
  popupContent: localizedField.optional(),
  popupMedia: Joi.alternatives(imagePath.allow(''), youtubeUrl).optional(),

  popupAttribution: Joi.string().default('Unknown'),
});

/**
 * This schema represents a feature containing markers.
 */
export const MSF_FEATURE_SCHEMA = Joi.object({
  // A number equal to 2, used to indicate version changes.
  // Version changes are only needed for breaking changes, like restructuring,
  // not for new options that can be given optional defaults.
  format: MSF_SCHEMA_VERSION,

  // Whether the feature is enabled or not. Now a mandatory boolean.
  enabled: Joi.boolean(),

  // The localized name of the feature.
  name: localizedField.required(),

  // The localized description of the feature.
  description: localizedField.required(),

  tags: tagList,

  // Whether to cluster markers on the map.
  cluster: Joi.string().valid(...clusterEnum),

  // Whether the feature respawns, and how often.
  respawn: Joi.alternatives(Joi.number().integer().positive(), Joi.string().valid(...respawnEnum)),

  icons: {
    // A key for a file
    filter: Joi.string()
      .regex(/[\dA-Za-z-]+/)
      .required(),
    base: MSF_MARKER_ICON_SCHEMA.required(),
    done: MSF_MARKER_ICON_SCHEMA.required(),
  },

  // Array of markers.
  data: Joi.array()
    .items(MSF_MARKER_SCHEMA) // Array can be empty.
    .unique((a, b) => a.id === b.id), // IDs must be unique.
});

/**
 * Performs schema validation on an MSF feature.
 * @param input The data to validate.
 */
export const validateFeatureData = (input: MSFFeature): ValidationResult | null => {
  if (input == null || !('format' in input) || !('name' in input)) {
    console.error(`Feature is undefined!`);
    return null;
  }
  switch (input.format) {
    case 2:
      return MSF_FEATURE_SCHEMA.validate(input, VALIDATION_OPTIONS);
    case 1:
    default:
      console.error(
        `Feature (${JSON.stringify(input.name)}) using outdated MSF version: ${input.format}`
      );
      return null;
  }
};

/**
 * This schema represents a route group containing routes.
 */
export const MSF_ROUTES_SCHEMA = Joi.object({
  format: MSF_SCHEMA_VERSION,

  // Whether the feature is enabled or not. Now a mandatory boolean.
  enabled: Joi.boolean(),

  // The localized name of the feature.
  name: localizedField.required(),

  // The localized description of the feature.
  description: localizedField.optional(),

  tags: tagList,

  icons: {
    // A key for a file
    filter: Joi.string()
      .regex(/[\dA-Za-z-]+/)
      .required(),
  },

  // Array of markers.
  data: Joi.array()
    .items(MSF_ROUTE_SCHEMA) // Array can be empty.
    .unique((a, b) => a.id === b.id), // IDs must be unique.
});

/**
 * Performs schema validation on an MSF route group.
 */
export const validateRouteData = (input: MSFRouteGroup): ValidationResult | null => {
  if (input == null || !('format' in input) || !('name' in input)) {
    console.error(`Route is undefined!`);
    return null;
  }
  switch (input.format) {
    case 2:
      return MSF_ROUTES_SCHEMA.validate(input, VALIDATION_OPTIONS);
    case 1:
    default:
      console.error(
        `Route (${JSON.stringify(input.name)}) using outdated MSF version: ${input.format}`
      );
      return null;
  }
};
