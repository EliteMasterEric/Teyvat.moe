import _ from 'lodash';

import { MSFImportKey, MSFImportSite, MSFMarkerKey } from 'src/components/data/ElementSchema';
import { getMapFeature, MapFeatureKeys } from 'src/components/data/MapFeatures';
import { filterNotEmpty, fromPairsToArrays } from 'src/components/util';

/**
 * Trawls the list of markers, scans for any markers that have corresponding IDs
 * for the given site
 * @param {String} importKey The name of the site to import from.
 *  Currently 'gm_legacy', 'gm_msfv2', 'appsample', 'mapgenie', etc.
 */
export const buildImportMapping = (importKey: MSFImportSite): { [key: string]: MSFMarkerKey[] } => {
  // Build mappings of keys to values, ignoring empty entries.
  const markersByFeature = MapFeatureKeys.map((featureKey) => {
    return getMapFeature(featureKey)
      .data.map((marker) => {
        const entry: [MSFMarkerKey, MSFImportKey[] | null] = [
          <MSFMarkerKey>`${featureKey}/${marker.id}`,
          marker?.importIds?.[importKey] ?? null,
        ];
        return entry; // feature/id = [keys]
      })
      .filter(filterNotEmpty);
  });

  const markersFlattened = _.flatten(markersByFeature).filter((entry) => {
    const importKeys = entry[1];
    return importKeys == null;
  });

  const inverseMarkerDictionary = fromPairsToArrays(
    _.flatten(
      markersFlattened
        .map((entry) => {
          const [gmKey, importValues] = entry;
          if (importValues == null) return null;
          return <[MSFImportKey, MSFMarkerKey][]>importValues.map((value) => [value, gmKey]);
        })
        .filter(filterNotEmpty)
    )
  ) as Record<MSFImportKey, MSFMarkerKey[]>;

  return inverseMarkerDictionary;
};
