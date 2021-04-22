import { divIcon as LeafletDivIcon, icon as LeafletIcon } from 'leaflet';
import _ from 'lodash';

import { getNextImageUrl } from 'src/components/interface/Image';

export const createClusterIcon = ({
  key,
  marker = false,
  clusterIcon = '',
  extension = 'png',
}: {
  key: string;
  marker?: boolean;
  clusterIcon?: string;
  extension?: string;
}): any => {
  if (marker) {
    return extension != 'png'
      ? `/images/icons/filter/${key}.${extension}`
      : getNextImageUrl(`/images/icons/filter/${key}.png`, 24, 24);
  } else {
    return extension != 'png'
      ? `/images/icons/filter/${clusterIcon}.${extension}`
      : getNextImageUrl(`/images/icons/filter/${clusterIcon}.png`, 24, 24);
  }
};

export const createMapIcon = ({
  key,
  marker = false,
  done = false,
  ext: extension = 'png',
  ...options
}: {
  key: string;
  marker?: boolean;
  done?: boolean;
  ext?: string;
}): L.Icon | L.DivIcon => {
  if (marker) {
    // Use the marker image.
    const iconUrl =
      extension != 'png'
        ? `/images/icons/filter/${key}.${extension}`
        : getNextImageUrl(`/images/icons/filter/${key}.png`, 24, 24);

    // This part is a little complex.
    // As a neat hack, the marker"s shadow is offset and used to implement the frame.
    // That way, the marker can be a separate icon from the image representing the item.
    const shadowUrl = `/images/icons/marker/marker_${done ? 'green' : 'white'}_bg.svg`;

    const iconHTML = `<div class='map-marker-container'>
      <img style='width: 40px; height: 40px;' class='map-marker-shadow' alt="" src="${shadowUrl}"/>
      <img style='width: 24px; height: 24px;' class='map-marker-img' alt="" src='${iconUrl}'/>
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
  const iconUrl = `/images/icons/map/${key}.${extension}`;

  return LeafletIcon({
    className: `map-marker-${key}`,
    iconUrl,
    shadowUrl: '',
    ...options,
  });
};

export const editorMarker = LeafletIcon({
  className: `map-marker-editor`,
  iconUrl: 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==', // Transparent pixel.
  shadowUrl: '/images/icons/marker/marker_white_bg.svg', // Default value. Use options to override.
  iconSize: [24, 24], // size of the icon
  shadowSize: [40, 40], // size of the shadow
  iconAnchor: [12, 34.5], // point of the icon which will correspond to marker's location
  shadowAnchor: [20, 40], // the same for the shadow
  popupAnchor: [0, -34.5], // point from which the popup should open relative to the iconAnchor
});
export const editorMarkerHighlight = LeafletIcon({
  className: `map-marker-editor`,
  iconUrl: 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==', // Transparent pixel.
  shadowUrl: '/images/icons/marker/marker_green_bg.svg', // Default value. Use options to override.
  iconSize: [24, 24], // size of the icon
  shadowSize: [40, 40], // size of the shadow
  iconAnchor: [12, 34.5], // point of the icon which will correspond to marker's location
  shadowAnchor: [20, 40], // the same for the shadow
  popupAnchor: [0, -34.5], // point from which the popup should open relative to the iconAnchor
});
