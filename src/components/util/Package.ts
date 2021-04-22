// Ensure the app version is defined in only one location.
import packageJson from 'package.json';

/**
 * Fetches the current application version from the package.json file.
 * @returns {string} The package version.
 */
export const getApplicationVersion = (): string => {
  return packageJson.version;
};
