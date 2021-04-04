import _ from 'lodash';
import MapRegionRawData from 'src/data/core/regions.json';

export type MapRegionKey = keyof typeof MapRegionRawData;

export interface MapRegion {
  nameKey: string;
  enabled: boolean;
  color: string;
}

const MapRegions: Record<MapRegionKey, MapRegion> = MapRegionRawData;
export const getMapRegion = (key: MapRegionKey): MapRegion => {
  const result = MapRegions[key] ?? null;
  if (result == null) throw Error(`Invalid map region key ${key}`);
  return result;
};
export const MapRegionKeys = _.keys(MapRegionRawData) as MapRegionKey[];
export const isRegionKey = (value: string): value is MapRegionKey => value in MapRegionRawData;
