/**
 * The file lists all the Map features, regions, routes, and categories.
 * It directs how they are rendered on the map, how they display in the filter list,
 * and where the data for them is loaded from.
 */
import _ from 'lodash';
import {
  listFeatureKeys,
  listRouteKeys,
  loadFeature,
  loadRoute,
  localizeFeature,
  localizeRoute,
} from './MapFeaturesData';

/*
 * List of ingame regions.
 */
export const MapRegions = {
  mondstadt: {
    nameKey: 'region-mondstadt',
    enabled: true,
  },
  liyue: {
    nameKey: 'region-liyue',
    enabled: true,
  },
  inazuma: {
    nameKey: 'region-inazuma',
    enabled: false,
  },
  sumeru: {
    nameKey: 'region-sumeru',
    enabled: false,
  },
  fontaine: {
    nameKey: 'region-fontaine',
    enabled: false,
  },
  natlan: {
    nameKey: 'region-natlan',
    enabled: false,
  },
  snezhnaya: {
    nameKey: 'region-snezhnaya',
    enabled: false,
  },
  khaenriah: {
    nameKey: 'region-khaenriah',
    enabled: false,
  },
};

/**
 * Metadata regarding the map categories.
 */
export const MapCategories = {
  monster: {
    nameKey: 'category-monster',
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
    nameKey: 'category-boss',
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
    nameKey: 'category-nature',
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
    nameKey: 'category-special',
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
    nameKey: 'category-ore',
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
    nameKey: 'category-chest',
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
export const MapFeatures = Object.fromEntries(
  listFeatureKeys()
    .map((relativePath) => {
      const [_dot, featureRegion, featureCategory, featureName] = relativePath.split('/');
      const baseFeatureData = loadFeature(relativePath);
      if (baseFeatureData == null) return null; // Validation failed.
      const featureData = localizeFeature({
        ...baseFeatureData,
        region: featureRegion,
        category: featureCategory,
      });

      // crystal-chunk -> CrystalChunk
      const correctedName = featureName
        .split('.')[0] // Remove file extension.
        .split('-') // Break by words.
        .map((s) => s.charAt(0).toUpperCase() + s.substr(1)) // Convert to Title case.
        .join(''); // Rejoin.

      // CrystalChunk -> mondstadtCrystalChunk
      const fullName = `${featureRegion}${correctedName}`; // Prefix with region.

      return [fullName, featureData];
    })
    .filter((value) => value) // Filter out nullable values
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
export const MapRoutes = Object.fromEntries(
  listRouteKeys()
    .map((relativePath) => {
      const [_dot, routeRegion, routeCategory, routeName] = relativePath.split('/');
      const baseRouteData = loadRoute(relativePath);
      if (baseRouteData == null) return null; // Validation failed.
      const routeData = localizeRoute({
        ...baseRouteData,
        region: routeRegion,
        category: routeCategory,
      });

      // crystal-chunk -> CrystalChunk
      const correctedName = routeName
        .split('.')[0] // Remove file extension.
        .split('-') // Break by words.
        .map((s) => s.charAt(0).toUpperCase() + s.substr(1)) // Convert to Title case.
        .join(''); // Rejoin.

      // CrystalChunk -> mondstadtCrystalChunk
      const fullName = `${routeRegion}${correctedName}`; // Prefix with region.
      return [fullName, routeData];
    })
    .filter((value) => value) // Filter out nullable values
);

export const getRouteKeysByFilter = (region, category) => {
  return Object.keys(MapRoutes).filter((key) => {
    const route = MapRoutes[key];
    return (route?.region ?? 'mondstadt') === region && (route?.category ?? 'special') === category;
  });
};
