import _ from 'lodash';

import { MapFeatures } from '~/components/data/MapFeatures';
import { fromPairsToArrays } from '~/components/Util';
import { MSFImportKey, MSFImportSite, MSFMarkerKey } from '~/components/data/ElementSchema';

/**
 * Trawls the list of markers, scans for any markers that have corresponding IDs
 * for the given site
 * @param {String} importKey The name of the site to import from.
 *  Currently 'gm_legacy', 'gm_msfv2', 'appsample', 'mapgenie', etc.
 */
export const buildImportMapping = (
  importKey: MSFImportSite
): Record<MSFImportKey, MSFMarkerKey[]> => {
  // Build mappings of keys to values, ignoring empty entries.
  const markersByFeature = _.keys(MapFeatures)
    .map((featureKey) => {
      return MapFeatures[featureKey].data.map((marker) => {
        const entry: [MSFMarkerKey, MSFImportKey[] | null] = [
          <MSFMarkerKey>`${featureKey}/${marker.id}`,
          marker.importIds?.[importKey] ?? null,
        ];
        return entry; // feature/id = [keys]
      });
    })
    .filter(_.size);

  const markersFlattened: [MSFMarkerKey, MSFImportKey[]][] = _.flatten(markersByFeature).filter(
    (entry) => {
      return _.size(entry) && _.size(entry[1]);
    }
  );

  const inverseMarkerDictionary = fromPairsToArrays(
    _.flatten(
      markersFlattened.map((entry) => {
        const [gmKey, importValues] = entry;
        return <[MSFImportKey, MSFMarkerKey][]>importValues.map((value) => [value, gmKey]);
      })
    )
  ) as Record<MSFImportKey, MSFMarkerKey[]>;

  return inverseMarkerDictionary;
};
