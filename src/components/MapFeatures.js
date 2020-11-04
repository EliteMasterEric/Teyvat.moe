/**
 * The file lists all the Map features, regions, routes, and categories.
 * It directs how they are rendered on the map, how they display in the filter list,
 * and where the data for them is loaded from.
 */
import L from 'leaflet';

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

// eslint-disable-next-line import/no-dynamic-require
const getFeatureData = (key) => require(`../data/features/${key}.json`);
const getRouteData = (key) => require(`../data/routes/${key}.json`);

const iconsContext = require.context('../images/icons', true);
const getFilterIconURL = (key) => iconsContext(`./filter/${key}.png`).default;

const createMapIcon = ({ key, done = false, svg = false, ...options }) => {
  const iconUrl = iconsContext(
    `./map_${done ? 'done' : 'base'}/${key}.${svg ? 'svg' : 'png'}`,
    false
  ).default;

  return L.icon({
    className: `map-marker-${key}`,
    iconUrl,
    shadowUrl: '',
    ...options,
  });
};
const createMarkerMapIcon = ({ key, done = false, svg = false, ...options }) => {
  const iconUrl = getFilterIconURL(key);

  // This part is a little complex.
  // As a neat hack, the marker's shadow is offset and used to implement the frame.
  // That way, the marker can be a separate icon from the image representing the item.
  const shadowUrl = iconsContext(
    `./map_${done ? 'done' : 'base'}/marker.${svg ? 'svg' : 'png'}`,
    false
  ).default;

  return L.icon({
    className: `map-marker-${key}`,
    iconUrl,
    shadowUrl, // Default value. Use options to override.
    iconSize: [24, 23], // size of the icon
    shadowSize: [40, 40], // size of the shadow
    iconAnchor: [12, 34.5], // point of the icon which will correspond to marker's location
    shadowAnchor: [20, 40], // the same for the shadow
    popupAnchor: [0, -34.5], // point from which the popup should open relative to the iconAnchor
    ...options,
  });
};

/*
 * List of Regions:
 * mondstadt
 * liyue
 * POSSIBLE FUTURE REGIONS:
 * inazuma
 * sumeru
 * fontaine
 * natlan
 * snezhnaya
 * khaenriah
 */

export const MapRegions = {
  mondstadt: {
    name: 'Mondstadt',
    enabled: true,
  },
  liyue: {
    name: 'Liyue',
    enabled: true,
  },
  inazuma: {
    name: 'Inazuma',
    enabled: false,
  },
  sumeru: {
    name: 'Sumeru',
    enabled: false,
  },
  fontaine: {
    name: 'Fontaine',
    enabled: false,
  },
  natlan: {
    name: 'Natlan',
    enabled: false,
  },
  snezhnaya: {
    name: 'Snezhnaya',
    enabled: false,
  },
  // khaenriah: {
  //   name: 'Khaenriah',
  //   enabled: false,
  // },
};

/**
 * Metadata regarding the map categories.
 */
export const MapCategories = {
  monster: {
    name: 'Monster',
    style: {
      width: '33%',
      disabled: {
        bg: '#9e9e9e',
        text: '#000',
      },
      enabled: {
        bg: '#c62828',
        text: '#FFF',
      },
    },
  },
  boss: {
    name: 'Boss',
    style: {
      width: '33%',
      disabled: {
        bg: '#9e9e9e',
        text: '#000',
      },
      enabled: {
        bg: '#d84315',
        text: '#FFF',
      },
    },
  },
  nature: {
    name: 'Nature',
    style: {
      width: '33%',
      disabled: {
        bg: '#9e9e9e',
        text: '#000',
      },
      enabled: {
        bg: '#4caf50',
        text: '#000',
      },
    },
  },
  special: {
    name: 'Special',
    style: {
      width: '33%',
      disabled: {
        bg: '#9e9e9e',
        text: '#000',
      },
      enabled: {
        bg: '#DDAABB',
        text: '#000',
      },
    },
  },
  ore: {
    name: 'Ore',
    style: {
      width: '33%',
      disabled: {
        bg: '#9e9e9e',
        text: '#000',
      },
      enabled: {
        bg: '#00bcd4',
        text: '#000',
      },
    },
  },
  chest: {
    name: 'Chest',
    style: {
      width: '33%',
      disabled: {
        bg: '#9e9e9e',
        text: '#000',
      },
      enabled: {
        bg: '#795548',
        text: '#FFF',
      },
    },
  },
};

/**
 * Metadata regarding the map features.
 */
export const MapFeatures = {
  /**
   * Identify each feature using a unique lowercase alphanumeric key.
   */
  anemoculus: {
    // The English name of the feature.
    name: 'Anemoculus',
    // A lowercase alphanumeric key for the feature's region.
    region: 'mondstadt',
    // A lowercase alphanumeric key for the feature's category.
    category: 'special',
    // The GeoJSON data listing all the markers.
    data: getFeatureData('anemoculus'),
    icons: {
      // The icon used by the Filter control.
      filter: getFilterIconURL('anemoculus'),
      // The icon used on the map.
      base: createMapIcon({
        key: 'anemoculus',
        svg: true,
        iconSize: [24, 24], // Size of the icon
        shadowSize: [50, 64], // Size of the shadow
        iconAnchor: [12, 12], // Point of the icon which will correspond to marker's location
        shadowAnchor: [4, 62], // The same for the shadow
        popupAnchor: [0, -12], // Point from which the popup should open relative to the iconAnchor
      }),
      // The icon used on the map (when marked as Done).
      done: createMapIcon({
        key: 'anemoculus',
        done: true,
        svg: true,
        iconSize: [24, 24], // Size of the icon
        shadowSize: [50, 64], // Size of the shadow
        iconAnchor: [12, 12], // Point of the icon which will correspond to marker's location
        shadowAnchor: [4, 62], // The same for the shadow
        popupAnchor: [0, -12], // Point from which the popup should open relative to the iconAnchor
      }),
    },
    // Whether to cluster nearby icons together when zoomed out.
    cluster: false,
  },
  geoculus: {
    name: 'Geoculus',
    region: 'liyue',
    category: 'special',
    data: getFeatureData('geoculus'),
    cluster: false,
    icons: {
      // The icon used by the Filter control.
      filter: getFilterIconURL('geoculus'),
      // The icon used on the map.
      base: createMapIcon({
        key: 'geoculus',
        svg: true,
        iconSize: [24, 24],
        shadowSize: [50, 64],
        iconAnchor: [12, 12],
        shadowAnchor: [4, 62],
        popupAnchor: [0, -12],
      }),
      done: createMapIcon({
        key: 'geoculus',
        done: true,
        svg: true,
        iconSize: [24, 24],
        shadowSize: [50, 64],
        iconAnchor: [12, 12],
        shadowAnchor: [4, 62],
        popupAnchor: [0, -12],
      }),
    },
  },
  mondstadtStatue: {
    name: 'Statue of the Seven',
    region: 'mondstadt',
    category: 'special',
    data: getFeatureData('mondstadt-statue'),
    cluster: false,
    icons: {
      // The icon used by the Filter control.
      filter: getFilterIconURL('mondstadt-statue'),
      // The icon used on the map.
      base: createMarkerMapIcon({
        key: 'mondstadt-statue',
      }),
      done: createMarkerMapIcon({
        key: 'mondstadt-statue',
        done: true,
      }),
    },
  },
  liyueStatue: {
    name: 'Statue of the Seven',
    region: 'liyue',
    category: 'special',
    data: getFeatureData('liyue-statue'),
    cluster: false,
    icons: {
      // The icon used by the Filter control.
      filter: getFilterIconURL('liyue-statue'),
      // The icon used on the map.
      base: createMarkerMapIcon({
        key: 'liyue-statue',
      }),
      done: createMarkerMapIcon({
        key: 'liyue-statue',
        done: true,
      }),
    },
  },
  mondstadtTeleporter: {
    name: 'Teleporter',
    region: 'mondstadt',
    category: 'special',
    data: getFeatureData('mondstadt-teleporter'),
    cluster: false,
    icons: {
      // The icon used by the Filter control.
      filter: getFilterIconURL('teleporter'),
      // The icon used on the map.
      base: createMarkerMapIcon({
        key: 'teleporter',
      }),
      done: createMarkerMapIcon({
        key: 'teleporter',
        done: true,
      }),
    },
  },
  liyueTeleporter: {
    name: 'Teleporter',
    region: 'liyue',
    category: 'special',
    data: getFeatureData('liyue-teleporter'),
    cluster: false,
    icons: {
      // The icon used by the Filter control.
      filter: getFilterIconURL('teleporter'),
      // The icon used on the map.
      base: createMarkerMapIcon({
        key: 'teleporter',
      }),
      done: createMarkerMapIcon({
        key: 'teleporter',
      }),
    },
  },
  mondstadtShrine: {
    name: 'Shrine',
    region: 'mondstadt',
    category: 'special',
    data: getFeatureData('mondstadt-shrine'),
    cluster: false,
    icons: {
      // The icon used by the Filter control.
      filter: getFilterIconURL('mondstadt-shrine'),
      // The icon used on the map.
      base: createMarkerMapIcon({
        key: 'mondstadt-shrine',
      }),
      done: createMarkerMapIcon({
        key: 'mondstadt-shrine',
      }),
    },
  },
  liyueShrine: {
    name: 'Shrine',
    region: 'liyue',
    category: 'special',
    data: getFeatureData('liyue-shrine'),
    cluster: false,
    icons: {
      // The icon used by the Filter control.
      filter: getFilterIconURL('liyue-shrine'),
      // The icon used on the map.
      base: createMarkerMapIcon({
        key: 'liyue-shrine',
      }),
      done: createMarkerMapIcon({
        key: 'liyue-shrine',
      }),
    },
  },
};

/**
 * Metadata regarding the map features.
 */
export const MapRoutes = {
  cecilia: {
    name: 'Cecilia',
    region: 'mondstadt',
    category: 'nature',
    data: getRouteData('cecilia'),
    icons: {
      // The icon used by the Filter control.
      filter: getFilterIconURL('cecilia'),
    },
  },
};

export const getFeatureKeysByFilter = (region, category) => {
  return Object.keys(MapFeatures).filter((key) => {
    const feature = MapFeatures[key];
    return (
      (feature?.region ?? 'mondstadt') === region && (feature?.category ?? 'special') === category
    );
  });
};

export const getRouteKeysByFilter = (region, category) => {
  return Object.keys(MapRoutes).filter((key) => {
    const feature = MapRoutes[key];
    return (
      (feature?.region ?? 'mondstadt') === region && (feature?.category ?? 'special') === category
    );
  });
};
