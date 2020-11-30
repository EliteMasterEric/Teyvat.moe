import { useMediaQuery } from '@react-hook/media-query';

const MEDIA_QUERY_SMALL_SCREEN = 'screen and (max-width: 479px)';

/**
 * Returns whether the screen is considered small.
 * Powered by React hooks.
 */
export const isSmallScreen = () => {
  const smallScreen = useMediaQuery(MEDIA_QUERY_SMALL_SCREEN);
  return smallScreen;
};
