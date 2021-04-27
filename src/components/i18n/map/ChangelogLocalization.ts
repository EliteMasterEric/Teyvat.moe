/**
 * Contains methods which facilitate translation between languages.
 * Relies on 2-letter locales.
 */

import _ from 'lodash';
import { i18n } from 'next-i18next';

import { ChangelogData } from 'src/components/data/map/ChangelogSchema';

export const getChangelogData = (): ChangelogData | null => {
  // i18next can store and return entire arrays of data.
  return i18n != null ? i18n.t('map-changelog:data', { returnObjects: true }) : null;
};
