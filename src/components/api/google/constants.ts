/**
 * This is a PUBLIC client ID used for Google services.
 * It does not need to be placed in a keystore.
 *
 * The client ID is used when performing the OAuth login requests.
 */
export const GOOGLE_API_CLIENT_ID =
  '855226670898-gpblte9d16casqg596s4rscchcn31est.apps.googleusercontent.com';
/**
 * This is a PUBLIC API key used for Google services.
 * Restrictions can be placed in the API console to limit referrers,
 * and scopes can be used to maximize user privacy.
 * It does not need to be placed in a keystore.
 *
 * The API key is used when performing the read and write requests,
 * using the token retrieved via OAuth.
 */
export const GOOGLE_API_KEY = 'AIzaSyAqa34xFFFnsYxSFIsGG76EBF7jc6GGutQ';

/**
 * The Google API library doesn't include every function for every API.
 * Instead, the client object retrieves the information
 * used to build the API object from Google's servers at runtime.
 */
export const GOOGLE_DISCOVERY_DOCS = [
  'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest', // Google Drive API.
];
/**
 * This provides a list of access scopes allowed by Google.
 */
export const GOOGLE_AUTH_SCOPES = [
  'https://www.googleapis.com/auth/drive.appdata', // Allows access to application-specific data only.
].join(' ');
/**
 * The libraries for the Google API to use.
 */
export const GOOGLE_API_LIBRARIES = ['client', 'auth2'].join(':');
