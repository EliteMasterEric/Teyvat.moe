/**
 * Contains a handler which parses the URL,
 * determines if a permalink to a marker was used,
 * and returns
 */
import _ from 'lodash';
import { useRouter } from 'next/router';
import { useEffect, FunctionComponent } from 'react';
import {
  getElementPathById,
  getElementByPath,
  MSFFeatureKey,
  MSFMarker,
  MSFRoute,
  MSFRouteGroupKey,
} from 'src/components/data/map/Element';
import { t } from 'src/components/i18n/Localization';
import { sendNotification } from 'src/components/redux/slices/common/notify/Dispatch';
import {
  dispatchShowFeature,
  dispatchShowRouteGroup,
} from 'src/components/redux/slices/map/displayed/Dispatch';
import {
  dispatchSetPermalinkId,
  dispatchSetMapPosition,
} from 'src/components/redux/slices/map/interface/Dispatch';
import { dispatchSetLoading } from 'src/components/redux/slices/map/loading/Dispatch';
import { setBrowserClipboard } from 'src/components/util';

const HIGHLIGHT_ZOOM_LEVEL = 9;

export const generatePermalink = (id: string): string => {
  return `${window.location.host}/?id=${id}`;
};

export const copyPermalink = (id: string): void => {
  setBrowserClipboard(generatePermalink(id));
};

export const navigateToMarkerByID = (id: string): void => {
  // Find which group has the ID.
  const elementPath = getElementPathById(id);
  if (elementPath == null) {
    console.error(`Path not found for ID: ${id}`);
    sendNotification(t('notification-permalink-fail-id'));

    dispatchSetLoading('handlePermalinks', 'error');
    return;
  }

  // Get the element associated with the ID.
  const [elementType, elementName, _elementID] = _.split(elementPath, '/');
  const element = getElementByPath(elementPath);
  if (elementPath == null) {
    console.error(`Element not found for path: ${elementPath}`);
    sendNotification(t('notification-permalink-fail-id'));

    dispatchSetLoading('handlePermalinks', 'error');
    return;
  }

  // Move to the element's position.
  if (elementType === 'route') {
    const route = element as MSFRoute;
    const routeGroupKey = elementName as MSFRouteGroupKey;
    const routeStartingMarker = route.coordinates[0];
    if (routeStartingMarker != null && routeStartingMarker.length >= 2) {
      dispatchSetMapPosition(
        { lat: routeStartingMarker[0], lng: routeStartingMarker[1] },
        HIGHLIGHT_ZOOM_LEVEL
      );
    }
    // Display the route if it isn't already visible.
    dispatchShowRouteGroup(routeGroupKey);
    sendNotification(t('notification-permalink-route'));
    dispatchSetLoading('handlePermalinks', true);
  } else {
    const marker = element as MSFMarker;
    const featureKey = elementName as MSFFeatureKey;
    dispatchSetMapPosition(
      { lat: marker.coordinates[0], lng: marker.coordinates[1] },
      HIGHLIGHT_ZOOM_LEVEL
    );
    // Display the route if it isn't already visible.
    dispatchShowFeature(featureKey);
    sendNotification(t('notification-permalink-feature'));
    dispatchSetLoading('handlePermalinks', true);
  }
};

const PermalinkHandler: FunctionComponent = () => {
  const nextRouter = useRouter();

  // Navigate to the marked permalink when the map starts.
  useEffect(() => {
    const { id } = nextRouter.query;
    // End early if 0 or 2+ IDs were specified.
    if (id == null || _.isArray(id)) return;

    dispatchSetPermalinkId(id);
  }, [nextRouter.query]);

  // Don't render anything.
  return null;
};

export default PermalinkHandler;
