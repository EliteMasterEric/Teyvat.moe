/**
 * Generates the popups displayed when clicking markers and routes
 * on the Leaflet map.
 */

import { YOUTUBE_REGEX } from '~/components/data/MarkerDataFormatSchema';
import { localizeField } from '~/components/i18n/FeatureLocalization';
import { displayUnixTimestamp, f } from '~/components/i18n/Localization';

// Capture group 1 is the video ID.

// Maximum width of the popup.
export const POPUP_WIDTH = 560;

/**
 * Generates a YouTube embed.
 * @param {*} id The YouTube video ID.
 * @param {*} width Size of the popup. Recommend a 16:9 ratio.
 * @param {*} height Size of the popup. Recommend a 16:9 ratio.
 * @param {*} start Optional, specify the start time of the video in seconds.
 * @param {*} end Optional, specify the start time of the video in seconds.
 */
export const buildYouTubeEmbed = (id, width, height, start = null, end = null) => {
  const params = [];
  if (start != null) params.push(`start=${start}`);
  if (end != null) params.push(`end=${end}`);

  return `<iframe width="${width}" height="${height}" src="https://www.youtube.com/embed/${id}${
    params.length > 0 ? `?${params.join('&')}` : ''
  }" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
};

/**
 * Displays an image or a YouTube embed, as appropriate.
 * @param {*} url
 * @param {*} imgExt
 * @param {*} allowExternal
 */
export const buildMedia = (url, imgExt, allowExternal) => {
  const isExternal = url.match(/^http(s):\/\//);

  if (isExternal) {
    const isYouTube = url.match(YOUTUBE_REGEX);
    if (isYouTube) {
      const match = YOUTUBE_REGEX.exec(url);
      if (match != null) {
        const videoId = match[1];
        return buildYouTubeEmbed(videoId, 560, 315);
      }
    }
    // Else, is another external site.
    if (allowExternal) {
      // External links are allowed in the editor view.
      return `<img class="map-marker-popup-image" src="${url}"/>`;
    }
    // External links aren't allowed in the main view.
    return `<span class="map-marker-bad-url">${url}</span>`;
  }
  // Local images are always allowed, and have the appropriate extension.
  return `<img class="map-marker-popup-image" src="/comments/${url}.${imgExt}"/>`;
};

export const buildPopup = (feature, imgExt = 'png', completionTime = -1, allowExternal = false) => {
  let text = '';
  if (!feature) return text;

  const title = localizeField(feature.properties.popupTitle);

  if (title && title !== '') {
    text = `${text}<b class="map-marker-popup-title">${title}</b>`;
  } else {
    text = `${text}<b class="map-marker-popup-title">#${feature.id}</b>`;
  }

  if (feature.properties.popupMedia) {
    if (!(typeof feature.properties.popupMedia === 'string')) {
      throw new Error('popupMedia is not a valid string.');
    }
    text = `${text}${buildMedia(feature.properties.popupMedia, imgExt, allowExternal)}`;
  }

  const content = localizeField(feature.properties.popupContent);

  if (content && content !== '') {
    text = `${text}<span class="map-marker-popup-content">${content}</span>`;
  }

  if (completionTime !== -1) {
    text = `${text}<span class="map-marker-popup-completion-time">${f(
      'map-popup-completed-format',
      {
        time: displayUnixTimestamp(completionTime),
      }
    )}</span>`;
  }

  return text;
};
