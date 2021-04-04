/**
 * Loads, validates, and includes utility methods for retrieving marker data.
 */
import _ from 'lodash';

import { MSFFeature, validateFeatureData } from 'src/components/data/ElementSchema';
import { importFromContext, isDev } from 'src/components/util';

const featuresContext = require.context(
  'src/data/features/',
  true,
  /.json$/,
  'lazy-once' // webpackMode
);
// Synchronous, returns an array of gathered paths.
export const listFeatureFiles = featuresContext.keys();

// Asynchronous, resovles to the module.
export const loadFeature = async (key: string): Promise<MSFFeature | null> => {
  // This import must be relative.
  const featureData: MSFFeature = importFromContext(featuresContext, key);
  const fileName = key.split('./')[1];
  // const featureData = await import(`src/data/features/${fileName}`);

  if (isDev()) {
    // In development, validate the data before returning.
    const validation = validateFeatureData(featureData);
    if (validation == null || validation.error) {
      console.warn(`ERROR during validation of feature '${key}'`);
      console.warn(validation);
      return null;
    }
  }

  // In production, simply return the raw data.
  return featureData;
};
