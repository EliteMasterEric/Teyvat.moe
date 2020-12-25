/**
 * Helpers to improve rendering, conditionally by the user's screen size.
 * Powered by Material UI's useMediaQuery hook.
 */

import { useMediaQuery } from '@material-ui/core';

const MEDIA_QUERY_SMALL_SCREEN = 'screen and (max-width: 479px)';

/**
 * Returns whether the screen is considered small.
 * Powered by React hooks.
 */
export const isSmallScreen = () => {
  const smallScreen = useMediaQuery(MEDIA_QUERY_SMALL_SCREEN);
  return smallScreen;
};
