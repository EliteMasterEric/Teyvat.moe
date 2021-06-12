import _ from 'lodash';
import { MSFLocalizedField } from './Element';
import MapRegionRawData from 'src/data/core/regions.json';

export type MapRegionKey = keyof typeof MapRegionRawData;

export interface MapRegion {
  name: MSFLocalizedField;
  enabled: boolean;
  color: string;
}

/**
 * This is some bullshit why do I have to do this it worked without this earlier.
 * Index signatures are so broken.
 * With the type guard we force TypeScript to think the above structure is the structure of the module
 * (which it should be able to figure out by its own but can't because it's braindead)
 */
const isMapRegionDataGood = (input: any): input is Record<MapRegionKey, MapRegion> => {
  return _.every(_.values(input), (inputRegion) => {
    return (
      inputRegion?.name != null &&
      inputRegion?.enabled != null &&
      inputRegion?.color != null &&
      inputRegion?.name?.en != null
    );
  });
};
if (!isMapRegionDataGood(MapRegionRawData)) {
  throw new Error('MapRegionData type guard failure.');
}

const MapRegions: Record<MapRegionKey, MapRegion> = MapRegionRawData;
export const getMapRegion = (key: MapRegionKey): MapRegion => {
  const result = MapRegions[key] ?? null;
  if (result == null) throw new Error(`Invalid map region key ${key}`);
  return result;
};
export const MapRegionKeys = _.keys(MapRegionRawData) as MapRegionKey[];
export const isRegionKey = (value: string): value is MapRegionKey => value in MapRegionRawData;
