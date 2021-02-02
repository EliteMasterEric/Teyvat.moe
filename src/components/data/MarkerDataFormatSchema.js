/**
 * Contains data for map feature loading and validation.
 */

import Joi from 'joi';
import _ from 'lodash';

import MapRegions from '~/components/data/MapRegions';
import { hashObject, isDev } from '~/components/Util';

export const YOUTUBE_REGEX = /^(?:https?:\/\/)?(?:(?:www\.)?youtube\.com\/watch\?v=|youtu\.?be\/)([-_a-zA-Z0-9]+)(?:&.+)?$/;

// A path to an image in the comments folder.
const imagePath = Joi.string().regex(
  new RegExp(`((?:${Object.keys(MapRegions).join('|')})/)*[-_a-zA-Z0-9]+`)
); // Exclude the file extension.
const youtubeUrl = Joi.string().regex(YOUTUBE_REGEX);

// An object of language codes.
// English is always mandatory. Translations are optional.
const localizedField = Joi.object({
  en: Joi.string().required(),
}).pattern(/[a-z]{2}/, Joi.string().required());
const optionalLocalizedField = Joi.object({
  en: Joi.string(),
}).pattern(/[a-z]{2}/, Joi.string());
const clusterEnum = ['off', 'on', 'variable'];
const respawnEnum = ['none', 'boss'];
const coordinate = Joi.array().items(Joi.number().precision(5).required()).length(2);

// If set to true, the hash of each set of coordinates will be calculated on load.
// For every marker and route. Set this to true during development then turn it off after.

const sha1Hash = Joi.string().regex(/[A-Z0-9]{40}/);
// The ID must be a SHA1 hash of the 'coordinates' sibling key.
const msfId = Joi.string().valid(
  Joi.ref('coordinates', {
    adjust: (coords) => hashObject(coords, {}),
  })
);

const MSF_MARKER_SCHEMA = Joi.object({
  coordinates: coordinate.required(),
  id: isDev() ? msfId.required() : sha1Hash,

  // Add the ability to correlate this marker with other markers.
  // Note that this is a many-to-many relationship.
  importIds: {
    // https://yuanshen.site/
    yuanshen: Joi.array()
      .items(
        Joi.string()
          .regex(/[0-9]+_[0-9]+/)
          .required()
      )
      .optional(),
    // https://genshin-impact-map.appsample.com/#/
    appsample: Joi.array()
      .items(
        Joi.string()
          .regex(/[0-9]+/)
          .required()
      )
      .optional(),
    // https://mapgenie.io/genshin-impact/maps/teyvat
    mapgenie: Joi.array()
      .items(
        Joi.string()
          .regex(/[0-9]+/)
          .allow('')
        // .required()
      )
      .optional(),
    // GenshinMap before Marker Storage Format added.
    // Used to migrate data over.
    gm_legacy: Joi.array()
      .items(
        Joi.string()
          .regex(/[a-zA-Z]+\/[0-9]+/)
          .required()
      )
      .optional(),
    // GenshinMap after Marker Storage Format added.
    // Used to allow for renaming of markers.
    gm_msfv2: Joi.array().items(sha1Hash.required()).optional(),
  },

  popupTitle: optionalLocalizedField.optional(),
  popupContent: optionalLocalizedField.optional(),
  popupMedia: Joi.alternatives(imagePath.allow(''), youtubeUrl).optional(),

  popupAttribution: Joi.string().default('Unknown'),
});

const MSF_ROUTE_SCHEMA = Joi.object({
  coordinates: Joi.array().items(coordinate.required()).required(),
  id: isDev() ? msfId.required() : sha1Hash,

  routeColor: Joi.string().default('#d32f2f'),
  routeText: Joi.string().default('  ►  '),

  importIds: {
    gm_legacy: Joi.array()
      .items(
        Joi.string()
          .regex(/[a-zA-Z]+\/[0-9]+/)
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

const MSF_ICON_SCHEMA = Joi.object({
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

export const MSF_FEATURE_SCHEMA = Joi.object({
  // A number equal to 2, used to indicate version changes.
  // Version changes are only needed for breaking changes, like restructuring,
  // not for new options that can be given optional defaults.
  format: 2,

  // Whether the feature is enabled or not. Now a mandatory boolean.
  enabled: Joi.boolean(),

  // The localized name of the feature.
  name: localizedField.required(),

  // The localized description of the feature.
  description: localizedField.required(),

  // Whether to cluster markers on the map.
  cluster: Joi.string()
    .valid(...clusterEnum)
    .optional()
    .default('off'),

  // Whether the feature respawns, and how often.
  respawn: Joi.alternatives(Joi.number().integer().positive(), Joi.string().valid(...respawnEnum))
    .optional()
    .default('none'),

  icons: {
    // A key for a file
    filter: Joi.string()
      .regex(/[-a-zA-Z0-9]+/)
      .required(),
    base: MSF_ICON_SCHEMA.required(),
    done: MSF_ICON_SCHEMA.required(),
  },

  // Array of markers.
  data: Joi.array()
    .items(MSF_MARKER_SCHEMA) // Array can be empty.
    .unique((a, b) => a.id === b.id), // IDs must be unique.
});

export const MSF_ROUTES_SCHEMA = Joi.object({
  // A number equal to 2, used to indicate version changes.
  // Version changes are only needed for breaking changes, like restructuring,
  // not for new options that can be given optional defaults.
  format: 2,

  // Whether the feature is enabled or not. Now a mandatory boolean.
  enabled: Joi.boolean(),

  // The localized name of the feature.
  name: localizedField.required(),

  // The localized description of the feature.
  description: localizedField.optional(),

  icons: {
    // A key for a file
    filter: Joi.string()
      .regex(/[-a-zA-Z0-9]+/)
      .required(),
  },

  // Array of markers.
  data: Joi.array()
    .items(MSF_ROUTE_SCHEMA) // Array can be empty.
    .unique((a, b) => a.id === b.id), // IDs must be unique.
});
