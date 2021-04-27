export type AuthGoogleProfile = {
  googleId: string;
  imageUrl: string;
  email: string;
  name: string;
  givenName: string;
  familyName: string;
};

export type AuthState = {
  /**
   * Integration with Google.
   */
  google: {
    /**
     * If false, disable the Google sign-in button.
     * Used when GAPI experiences a fatal error.
     */
    enabled: boolean;
    /**
     * Starts as false, becomes true when the client loads.
     */
    initialized: boolean;
    /**
     * When the login is successful, a profile object is returned.
     * isSignedIn can be deduced by `profile != null`.
     */
    profile: AuthGoogleProfile | null;
    /**
     * Whether a save or load operation is in progress.
     * Give an indication to the user based on this value.
     */
    inProgress: boolean;
  };
  github: {
    /**
     * I false, disable GitHub integration.
     */
    enabled: boolean;
  };
};
