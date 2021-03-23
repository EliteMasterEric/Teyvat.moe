/**
 * Hook helpers to improve rendering, conditionally by the user's screen size,
 * network conditions, etc.
 */

import { useMediaQuery } from '@material-ui/core';
import { useNetworkStatus } from 'react-adaptive-hooks/network';
import { useSaveData } from 'react-adaptive-hooks/save-data';

const MEDIA_QUERY_SMALL_SCREEN = 'screen and (max-width: 479px)';

/**
 * Returns whether the screen is considered small.
 * Determines whether a given media query is matched.
 *
 * Powered by a React hook developed by Material UI.
 */
export const useSmallScreen = (): boolean => {
  const smallScreen = useMediaQuery(MEDIA_QUERY_SMALL_SCREEN);
  return smallScreen;
};

/**
 * Returns whether the user's device is on a slow network.
 * Can be used to disable large/expensive embeds.
 *
 * Powered by a React hook developed by Google Chrome Labs.
 */
export const useSlowNetwork = (): boolean => {
  /**
   * slow-2g  The network is suited for small transfers only such as text-only pages. Lowest value.
   * 2g       The network is suited for transfers of small images.
   * 3g       The network is suited for transfers of large assets, such as high res images, audio, and SD video.
   * 4g       The network is suited for HD video, real-time video, etc. Highest value.
   */
  const DEFAULT = '4g'; // Value when the user's browser doesn't support the relevant API.
  const { effectiveConnectionType } = useNetworkStatus(DEFAULT);

  return ['slow-2g', '2g', '3g'].includes(effectiveConnectionType ?? DEFAULT);
};

export const useDataSaver = (): boolean => {
  /**
   * saveData is true if the user has enabled Data Saver in their Chrome for Android settings.
   */
  const DEFAULT = false; // Value when the user's browser doesn't support the relevant API.
  const { saveData } = useSaveData(DEFAULT);

  return saveData ?? DEFAULT;
};
