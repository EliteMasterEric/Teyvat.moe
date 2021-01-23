import _ from 'lodash';

import { MapFeatures } from '~/components/data/MapFeatures';

/**
 * Trawls the list of markers, scans for any markers that have corresponding IDs
 * for the given site
 * @param {String} importKey The name of the site to import from.
 *  Currently 'gm_legacy', 'gm_msfv2', 'appsample', 'mapgenie', etc.
 */
export const buildImportMapping = (importKey) => {
  if (importKey == null) throw Error('Bad importKey.');

  // Build mappings of keys to values, ignoring empty entries.
  const markersByFeature = _.filter(
    _.keys(MapFeatures).map((featureKey) => {
      return MapFeatures[featureKey].data.map((element) => {
        return [`${featureKey}/${element.id}`, element.importIds[importKey] ?? null]; // feature/id = [keys]
      });
    }),
    _.size
  );

  const markersFlattened = _.filter(_.flatten(markersByFeature), (entry) => {
    return _.size(entry) && _.size(entry[1]);
  });

  // const markerDictionary = _.fromPairs(markersFlattened);

  const inverseMarkerDictionary = _.fromPairs(
    _.flatten(
      _.map(markersFlattened, (entry) => {
        const [gmKey, importValues] = entry;
        return importValues.map((value) => [value, gmKey]);
      })
    )
  );

  return inverseMarkerDictionary;
};
