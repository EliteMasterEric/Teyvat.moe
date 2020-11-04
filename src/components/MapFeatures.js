/**
 * The file lists all the Map features, regions, routes, and categories.
 * It directs how they are rendered on the map, how they display in the filter list,
 * and where the data for them is loaded from.
 */
import _ from 'lodash';
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
export const getFilterIconURL = (key) => iconsContext(`./filter/${key}.png`).default;

export const createMapIcon = ({ key, marker = false, done = false, svg = false, ...options }) => {
  if (marker) {
    // Use the marker image.
    const iconUrl = getFilterIconURL(key);

    // This part is a little complex.
    // As a neat hack, the marker"s shadow is offset and used to implement the frame.
    // That way, the marker can be a separate icon from the image representing the item.
    const shadowUrl = iconsContext(
      `./map_${done ? 'done' : 'base'}/marker.${svg ? 'svg' : 'png'}`,
      true
    ).default;

    return L.icon({
      className: `map-marker-${key}`,
      iconUrl,
      shadowUrl, // Default value. Use options to override.
      iconSize: [24, 23], // size of the icon
      shadowSize: [40, 40], // size of the shadow
      iconAnchor: [12, 34.5], // point of the icon which will correspond to marker"s location
      shadowAnchor: [20, 40], // the same for the shadow
      popupAnchor: [0, -34.5], // point from which the popup should open relative to the iconAnchor
      ...options,
    });
  }
  // Else, don"t use the marker image.
  const iconUrl = iconsContext(
    `./map_${done ? 'done' : 'base'}/${key}.${svg ? 'svg' : 'png'}`,
    true
  ).default;

  return L.icon({
    className: `map-marker-${key}`,
    iconUrl,
    shadowUrl: '',
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
  //   name: "Khaenriah",
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
 * Imported directly by listing the files from the Features folder.
 */
const featuresContext = require.context('../data/features/', true, /.json$/);
export const MapFeatures = Object.fromEntries(
  featuresContext.keys().map((relativePath) => {
    const [_dot, featureRegion, featureCategory, featureName] = relativePath.split('/');
    const featureData = {
      ...featuresContext(relativePath),
      region: featureRegion,
      category: featureCategory,
    };

    // crystal-chunk -> CrystalChunk
    const correctedName = featureName
      .split('.')[0] // Remove file extension.
      .split('-') // Break by words.
      .map((s) => s.charAt(0).toUpperCase() + s.substr(1)) // Convert to Title case.
      .join(''); // Rejoin.

    // CrystalChunk -> mondstadtCrystalChunk
    const fullName = `${featureRegion}${correctedName}`; // Prefix with region.
    console.log(fullName);
    console.log(featureData);

    return [fullName, featureData];
  })
);

export const getFeatureKeysByFilter = (region, category) => {
  return Object.keys(MapFeatures).filter((key) => {
    const feature = MapFeatures[key];
    return (
      (feature?.region ?? 'mondstadt') === region && (feature?.category ?? 'special') === category
    );
  });
};

/**
 * Metadata regarding the map features.
 * Imported directly by listing the files from the Features folder.
 */
const routesContext = require.context('../data/routes/', true, /.json$/);
export const MapRoutes = Object.fromEntries(
  routesContext.keys().map((relativePath) => {
    const [_dot, routeRegion, routeCategory, routeName] = relativePath.split('/');
    const routeData = {
      ...routesContext(relativePath),
      region: routeRegion,
      category: routeCategory,
    };

    // crystal-chunk -> CrystalChunk
    const correctedName = routeName
      .split('.')[0] // Remove file extension.
      .split('-') // Break by words.
      .map((s) => s.charAt(0).toUpperCase() + s.substr(1)) // Convert to Title case.
      .join(''); // Rejoin.

    // CrystalChunk -> mondstadtCrystalChunk
    const fullName = `${routeRegion}${correctedName}`; // Prefix with region.
    console.log(fullName);
    console.log(routeData);

    return [fullName, routeData];
  })
);

export const getRouteKeysByFilter = (region, category) => {
  return Object.keys(MapRoutes).filter((key) => {
    const route = MapRoutes[key];
    return (route?.region ?? 'mondstadt') === region && (route?.category ?? 'special') === category;
  });
};
