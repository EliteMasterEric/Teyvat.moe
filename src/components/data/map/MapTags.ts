import _ from 'lodash';
import { getRecord } from 'src/components/util';
import tagData from 'src/data/core/tags.json';

type TagMetadata = {
  _comment?: string;
  name: {
    [key: string]: string;
  } & {
    _code?: string;
  };
  enabled: boolean;
};
export type Tag = keyof typeof tagData;
type TagData = Record<Tag, TagMetadata>;
const tagMetadata: TagData = tagData;

export const MapTags = _.keys(tagData) as Tag[];

/**
 * Fetch the metadata (enabled, localized name) for a given tag.
 * @param tag The tag to retrieve data for.
 * @returns The data retrieved. Null if the tag is invalid.
 */
export const getTagMetadata = (tag: Tag): TagMetadata | null => {
  return getRecord(tagMetadata, tag);
};
