import { divIcon as LeafletDivIcon, icon as LeafletIcon } from 'leaflet';
import _ from 'lodash';

import { BLANK_IMAGE } from 'src/components/interface/Image';
import { importFromContext } from 'src/components/util';

// https://github.com/cyrilwanner/next-optimized-images/issues/16
const iconsContext = require.context('../../images/icons', true, /\.(png|webp|svg)/);
export const getFilterIconURL = (key: string, ext: string): any => {
  if (key && key !== 'none') {
    return importFromContext(iconsContext, `./filter/${key}.${ext}`);
  }
  return BLANK_IMAGE;
};

export const createClusterIcon = ({
  key,
  marker = false,
  clusterIcon = '',
  ext = 'png',
}: {
  key: string;
  marker?: boolean;
  clusterIcon?: string;
  ext?: string;
}): any => {
  if (marker) {
    return getFilterIconURL(key, ext);
  } else {
    return getFilterIconURL(clusterIcon, ext);
  }
};

export const createMapIcon = ({
  key,
  marker = false,
  done = false,
  ext = 'png',
  ...options
}: {
  key: string;
  marker: boolean;
  done: boolean;
  ext: string;
}): L.Icon | L.DivIcon => {
  if (marker) {
    // Use the marker image.
    const iconUrl = getFilterIconURL(key, ext);

    // This part is a little complex.
    // As a neat hack, the marker"s shadow is offset and used to implement the frame.
    // That way, the marker can be a separate icon from the image representing the item.
    const shadowUrl = importFromContext(
      iconsContext,
      `./marker/marker_${done ? 'green' : 'white'}_bg.svg`
    );

    const iconHTML = `<div class='map-marker-container'>
      <img style='width: 40px; height: 40px;' class='map-marker-shadow' alt="" src="${shadowUrl}"/>
      <img style='width: 24.25px; height: 24.25px;' class='map-marker-img' alt="" src='${iconUrl}'/>
    </div>`;

    return LeafletDivIcon({
      className: `map-marker-${key}`,
      html: iconHTML,
      iconSize: [40, 40], // size of the icon,
      iconAnchor: [20, 40], // point of the icon which will correspond to marker"s location,
      popupAnchor: [0, -35], // point from which the popup should open relative to the iconAnchor,
      ...options,
    });
  }

  // Else, don't use the marker image.
  const iconUrl = importFromContext(iconsContext, `./map/${key}.${ext}`);

  return LeafletIcon({
    className: `map-marker-${key}`,
    iconUrl,
    shadowUrl: '',
    ...options,
  });
};
