import { google } from 'googleapis';
import { getGoogleAPIKey } from '~/components/preferences/api/APIKeyStorage';
import { GoogleAPIBadKeyError } from '../error';

// If modifying these scopes, API token must be updated.
const SCOPES = [
  // Allow access to a hidden app data folder.
  'https://www.googleapis.com/auth/drive.appdata',
  // Allow access to files we have made.
  'https://www.googleapis.com/auth/drive.file',
  // Thanks to scopes, only we can access the files we make,
  // and we can't access the files anyone else makes, including personal data.
];

/**
 * This is a PUBLIC API key used for Google services.
 * It is restricted by scope and by host URL. It does not need to be placed in a keystore.
 */
const CLIENT_ID = '855226670898-dhs70toiudp07m4s5thiap2bc3f0qivd.apps.googleusercontent.com';

const buildRedirectURI = () => {
  if (window == null) return '';

  return `${window.location.protocol}//${window.location.host}/googleauth`;
};

console.log(buildRedirectURI);

export const writeToAppDataFolder = () => {
  const apiKey = getGoogleAPIKey();

  if (apiKey == null) {
    throw GoogleAPIBadKeyError(apiKey);
  }
};
