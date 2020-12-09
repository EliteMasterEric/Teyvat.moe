/**
 * The file lists all the Map features, regions, routes, and categories.
 * It directs how they are rendered on the map, how they display in the filter list,
 * and where the data for them is loaded from.
 */
import _ from 'lodash';
import { listFeatureKeys, listRouteKeys, loadFeature, loadRoute } from './MapFeaturesData';
import { localizeFeature, localizeRoute } from './FeatureLocalization';

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
  dragonspine: {
    nameKey: 'region-dragonspine',
    enabled: false,
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
  event: {
    nameKey: 'category-event',
    style: {
      fullWidth: true,
      disabled: {
        bg: '#9e9e9e',
        text: '#000',
      },
      enabled: {
        bg: '#947F17',
        text: '#FFF',
      },
    },
  },
  monster: {
    nameKey: 'category-monster',
    style: {
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
export const MapFeatures = _.fromPairs(
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

/**
 * For a given region, returns a map of a category key and a boolean value,
 * false if it contains at least one valid displayed route.
 * @param {*} region
 */
export const getEmptyFeatureCategories = (region) =>
  _.fromPairs(
    _.keys(MapCategories).map((categoryKey) => {
      const firstMatching = _.find(MapFeatures, (mapFeature) => {
        return (
          mapFeature.category === categoryKey &&
          mapFeature.region === region &&
          (mapFeature.enabled ?? true)
        );
      });
      return [categoryKey, firstMatching === undefined];
    })
  );

export const getFeatureKeysByFilter = (region, category) => {
  return _.keys(MapFeatures).filter((key) => {
    const feature = MapFeatures[key];
    return (
      (feature?.region ?? 'mondstadt') === region &&
      (feature?.category ?? 'special') === category &&
      (feature?.enabled ?? true)
    );
  });
};

/**
 * Metadata regarding the map features.
 * Imported directly by listing the files from the Features folder.
 */
export const MapRoutes = _.fromPairs(
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

/**
 * For a given region, returns a map of a category key and a boolean value,
 * false if it contains at least one valid displayed route.
 * @param {*} region
 */
export const getEmptyRouteCategories = (region) =>
  _.fromPairs(
    _.keys(MapCategories).map((categoryKey) => {
      const firstMatching = _.find(MapRoutes, (mapRoute) => {
        return (
          mapRoute.category === categoryKey &&
          mapRoute.region === region &&
          (mapRoute.enabled ?? true)
        );
      });
      return [categoryKey, firstMatching === undefined];
    })
  );

export const getRouteKeysByFilter = (region, category) => {
  return Object.keys(MapRoutes).filter((key) => {
    const route = MapRoutes[key];
    return (
      (route?.region ?? 'mondstadt') === region &&
      (route?.category ?? 'special') === category &&
      (route?.enabled ?? true)
    );
  });
};
