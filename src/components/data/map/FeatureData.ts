/**
 * Loads, validates, and includes utility methods for retrieving marker data.
 */
import _ from 'lodash';

import { MSFFeature } from './Element';
import { importFromContext } from 'src/components/util';

const featuresContext = require.context(
  'src/data/features/',
  true,
  /.json$/,
  'lazy-once' // webpackMode
);
// Synchronous, returns an array of gathered paths.
export const listFeatureFiles = (): string[] => featuresContext.keys();

// Asynchronous, resovles to the module.
export const loadFeature = async (key: string): Promise<MSFFeature | null> => {
  // This import must be relative.
  // It is a promise here since we are lazy loading the data.
  const featureData: MSFFeature = await importFromContext(featuresContext, key);

  // In production, simply return the raw data.
  return featureData;
};
