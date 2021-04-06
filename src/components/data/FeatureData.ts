/**
 * Loads, validates, and includes utility methods for retrieving marker data.
 */
import _ from 'lodash';

import { MSFFeature } from 'src/components/data/Element';
import { importFromContext, isDev } from 'src/components/util';

const featuresContext = require.context(
  'src/data/features/',
  true,
  /.json$/,
  'lazy-once' // webpackMode
);
// Synchronous, returns an array of gathered paths.
export const listFeatureFiles = () => featuresContext.keys();

// Asynchronous, resovles to the module.
export const loadFeature = async (key: string): Promise<MSFFeature | null> => {
  // This import must be relative.
  // It is a promise here since we are lazy loading the data.
  const featureData: MSFFeature = await importFromContext(featuresContext, key);

  if (isDev()) {
    // In development, validate the data before returning.
    // Load this async so Joi only gets used in development.
    const { validateFeatureData } = await import(
      /* webpackChunkName: "schema-validation" */
      /* webpackMode: "lazy" */
      'src/components/data/ElementSchema'
    );

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
