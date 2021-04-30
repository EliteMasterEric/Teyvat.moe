/**
 * Contains functions which access Google's APIs and authenticate the user.
 * Based on the functionality from react-google-login
 * @see: https://github.com/anthonyjgrove/react-google-login
 * @see: https://developers.google.com/identity/sign-in/web/reference
 */

import { gapi } from 'gapi-script';
import {
  GOOGLE_API_CLIENT_ID,
  GOOGLE_API_KEY,
  GOOGLE_API_LIBRARIES,
  GOOGLE_AUTH_SCOPES,
  GOOGLE_DISCOVERY_DOCS,
} from './Constants';
import { t } from 'src/components/i18n/Localization';
import { sendNotification } from 'src/components/redux/slices/common/notify/Dispatch';
import {
  dispatchDisableGoogleAuth,
  dispatchSetGoogleAuthProfile,
  dispatchInitializeGoogleClient,
} from 'src/components/redux/slices/map/auth/Dispatch';
import {
  getGoogleEnabled,
  getGoogleInitialized,
  getGoogleProfile,
} from 'src/components/redux/slices/map/auth/Getter';

type GoogleResponseError = {
  error: string;
  details?: string;
};

/**
 * Initialize the API library and client.
 * @param callback Called immediately when the API has finished loading successfully.
 *   Optional.
 */
export const loadGoogleAPI = (callback?: () => void): void => {
  gapi.load(GOOGLE_API_LIBRARIES, () => {
    // Called once the required JS for basic authentication
    // is loaded into memory.
    console.debug('[GOOGLE] Libraries are loaded.');

    // Initialize the client with the appropriate API key, client ID, and scopes.
    gapi.client
      .init({
        apiKey: GOOGLE_API_KEY,
        clientId: GOOGLE_API_CLIENT_ID,
        discoveryDocs: GOOGLE_DISCOVERY_DOCS,
        scope: GOOGLE_AUTH_SCOPES,
      })
      .then(() => {
        console.debug('[GOOGLE] Client is initialized.');
        // Set the flag in Redux indicating Google is ready.
        dispatchInitializeGoogleClient();

        // Attempt to automatically sign in using browser cookies (is it cookies?).
        attemptGoogleAutoSignIn();

        if (callback != null) {
          callback();
        }
      });
  });
};

const attemptGoogleAutoSignIn = () => {
  // Check if the user has already authenticated with this site.

  const authInstance = gapi.auth2.getAuthInstance();
  if (authInstance) {
    if (authInstance.isSignedIn.get()) {
      // The user is already signed in! Store the profile.
      console.debug('[GOOGLE] User has already authenticated in a previous session.');
      handleGoogleSignInSuccess(authInstance.currentUser.get());
      // TODO: Download preferences here.
    }
  } else {
    console.error('[GOOGLE] Error during auto-signin: OAuth2 library not loaded.');
  }
};

const handleGoogleSignInSuccess = (response: gapi.auth2.GoogleUser) => {
  console.debug('[GOOGLE] Received user profile info.');
  const basicProfile = response.getBasicProfile();

  dispatchSetGoogleAuthProfile({
    googleId: basicProfile.getId(),
    imageUrl: basicProfile.getImageUrl(),
    email: basicProfile.getEmail(),
    name: basicProfile.getName(),
    givenName: basicProfile.getGivenName(),
    familyName: basicProfile.getFamilyName(),
  });

  sendNotification(t('map-ui:google-login-success'));
};

const handleGoogleSignOutSuccess = () => {
  console.debug('[GOOGLE] Client sign out successful.');
  gapi.auth2.getAuthInstance().disconnect();
  dispatchSetGoogleAuthProfile(null);
  sendNotification(t('map-ui:auth-sign-out-success'));
};

const handleGoogleFailure = (response: GoogleResponseError) => {
  console.error('[GOOGLE] An error has occurred.');
  switch (response.error) {
    case 'idpiframe_initialization_failed':
      console.error('[GOOGLE] Origin has not been whitelisted for this client ID.');
      console.error(response.details);
      sendNotification(t('map-ui:auth-error-google-origin'));
      break;
    case 'popup_closed_by_user':
      console.warn('[GOOGLE] The user closed the login popup. Safe to ignore.');
      break;
    default:
      console.error('[GOOGLE] UNKNOWN FAILURE');
      console.error(response);
      sendNotification(t('map-ui:auth-error-google-generic'));
      break;
  }
  // Disable the button so nothing else breaks.
  dispatchDisableGoogleAuth();
};

export const attemptGoogleSignIn = (): void => {
  if (getGoogleEnabled()) {
    if (getGoogleInitialized()) {
      gapi.auth2
        .getAuthInstance()
        // This call will create a new Google login window.
        .signIn({
          /**
           * Prompt forces a specific mode. Leave blank to let Google choose.
           * 'consent' prompts with an allow button
           * 'select_account' prompts with an account list.
           */
          // prompt: consent,
        })
        .then(
          (response) => handleGoogleSignInSuccess(response),
          (error) => handleGoogleFailure(error)
        );
    } else {
      console.warn('[GOOGLE] Attempted to sign in when API was uninitialized.');
    }
  } else {
    console.warn('[GOOGLE] Attempted to sign in when API was disabled.');
  }
};

export const attemptGoogleSignOut = (): void => {
  if (getGoogleProfile() != null) {
    if (getGoogleInitialized()) {
      gapi.auth2
        .getAuthInstance()
        // This call will create a new Google login window.
        .signOut()
        .then(
          () => handleGoogleSignOutSuccess(),
          (error: GoogleResponseError) => handleGoogleFailure(error)
        );
    } else {
      console.warn('[GOOGLE] Attempted to sign out when API was uninitialized.');
    }
  } else {
    console.warn('[GOOGLE] Attempted to sign out when not signed in.');
  }
};
