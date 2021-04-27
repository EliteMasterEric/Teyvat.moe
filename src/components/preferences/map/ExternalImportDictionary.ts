import _ from 'lodash';

import { MSFImportKey, MSFImportSite, MSFMarkerKey } from 'src/components/data/map/Element';
import { getMapFeature, getMapFeatureKeys } from 'src/components/data/map/MapFeatures';
import { fromPairsToArrays } from 'src/components/util';

/**
 * Trawls the list of markers, scans for any markers that have corresponding IDs
 * for the given site
 * @param {String} importKey The name of the site to import from.
 *  Currently 'gm_legacy', 'gm_msfv2', 'appsample', 'mapgenie', etc.
 */
export const buildImportMapping = (importKey: MSFImportSite): { [key: string]: MSFMarkerKey[] } => {
  // Build mappings of keys to values, ignoring empty entries.
  const markersByFeature = _.map(getMapFeatureKeys(), (featureKey) => {
    return _.filter(
      _.map(getMapFeature(featureKey).data, (marker) => {
        const entry: [MSFMarkerKey, MSFImportKey[] | null] = [
          <MSFMarkerKey>`${featureKey}/${marker.id}`,
          marker?.importIds?.[importKey] ?? null,
        ];
        return entry; // feature/id = [keys]
      }),
      (value) => !_.isNil(value)
    );
  });

  const markersFlattened = _.filter(_.flatten(markersByFeature), (entry) => {
    const importKeys = entry[1];
    return importKeys == null;
  });

  const inverseMarkerDictionary = fromPairsToArrays(
    _.flatten(
      _.filter(
        _.map(markersFlattened, (entry) => {
          const [gmKey, importValues] = entry;
          if (importValues == null) return null;
          return <[MSFImportKey, MSFMarkerKey][]>_.map(importValues, (value) => [value, gmKey]);
        }),
        (value): value is [MSFImportKey, MSFMarkerKey][] => !_.isNil(value)
      )
    )
  ) as Record<MSFImportKey, MSFMarkerKey[]>;

  return inverseMarkerDictionary;
};
