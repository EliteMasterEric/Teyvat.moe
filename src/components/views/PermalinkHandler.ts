/**
 * Contains a handler which parses the URL,
 * determines if a permalink to a marker was used,
 * and returns
 */
import { useRouter } from 'next/router';
import { useEffect, FunctionComponent } from 'react';
import { getElementPathById, getElementByPath } from 'src/components/data/Element';
import { MSFFeatureKey, MSFMarker, MSFRoute, MSFRouteGroupKey } from 'src/components/data/Element';
import { t } from 'src/components/i18n/Localization';
import {
  moveToMapPosition,
  sendNotification,
  showFeature,
  showRouteGroup,
} from 'src/components/redux/dispatch';
import { setBrowserClipboard } from 'src/components/util';
import { setPermalinkId } from 'src/components/redux/slices/ui';

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

    return;
  }

  // Get the element associated with the ID.
  const [elementType, elementName, _elementID] = elementPath.split('/');
  const element = getElementByPath(elementPath);
  if (elementPath == null) {
    console.error(`Element not found for path: ${elementPath}`);
    sendNotification(t('notification-permalink-fail-id'));
    return;
  }

  // Move to the element's position.
  if (elementType === 'route') {
    const route = element as MSFRoute;
    const routeGroupKey = elementName as MSFRouteGroupKey;
    const routeStartingMarker = route.coordinates[0];
    if (routeStartingMarker != null && routeStartingMarker.length >= 2) {
      moveToMapPosition(
        { lat: routeStartingMarker[0], lng: routeStartingMarker[1] },
        HIGHLIGHT_ZOOM_LEVEL
      );
    }
    // Display the route if it isn't already visible.
    showRouteGroup(routeGroupKey);
    sendNotification(t('notification-permalink-route'));
  } else {
    const marker = element as MSFMarker;
    const featureKey = elementName as MSFFeatureKey;
    moveToMapPosition(
      { lat: marker.coordinates[0], lng: marker.coordinates[1] },
      HIGHLIGHT_ZOOM_LEVEL
    );
    // Display the route if it isn't already visible.
    showFeature(featureKey);
    sendNotification(t('notification-permalink-feature'));
  }
};

const PermalinkHandler: FunctionComponent = () => {
  const nextRouter = useRouter();

  // Navigate to the marked permalink when the map starts.
  useEffect(() => {
    const { id } = nextRouter.query;
    // End early if 0 or 2+ IDs were specified.
    if (id == null || Array.isArray(id)) return;

    setPermalinkId(id);
  }, []);

  // Don't render anything.
  return null;
};

export default PermalinkHandler;
