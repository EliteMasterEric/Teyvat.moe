import _ from 'lodash';
import MapCategoryRawData from 'src/data/core/categories.json';

export type MapCategoryKey = keyof typeof MapCategoryRawData;

export interface MapCategory {
  nameKey: string;
  enabled: boolean;
  style: {
    fullWidth?: boolean;
    disabled: {
      bg: string;
      text: string;
    };
    enabled: {
      bg: string;
      text: string;
    };
  };
}

const MapCategories: Record<MapCategoryKey, MapCategory> = MapCategoryRawData;
export const getMapCategory = (key: MapCategoryKey): MapCategory => {
  const result = MapCategories[key] ?? null;
  if (result == null) throw new Error(`Invalid map category key ${key}`);
  return result;
};
export const MapCategoryKeys = _.keys(MapCategoryRawData) as MapCategoryKey[];
export const isCategoryKey = (value: string): value is MapCategoryKey =>
  value in MapCategoryRawData;
