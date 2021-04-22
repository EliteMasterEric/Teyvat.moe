/**
 * Contains methods and components which facilitate image rendering,
 * including WebP support detection and a lazy loading, WebP-sensitive image component.
 */

import _ from 'lodash';
import NextImageBase, { ImageProps } from 'next/image';
import React, { FunctionComponent } from 'react';

// A 1 pixel by 1 pixel transparent image.
export const BLANK_IMAGE =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

// Cache the result of supportsWebP.
let support: boolean;
/**
 * Calculates whether the browser supports webp images, which are more web performant.
 *
 * NOTE: Only one method works: https://codesandbox.io/s/react-webp-test-kf8rw?file=/src/index.js:412-950
 */
export const supportsWebP = async (): Promise<boolean> => {
  if (support != null) return support;

  // If the browser doesn't has the method createImageBitmap, you can't display webp format
  if (!window.createImageBitmap) {
    support = false;
    return support;
  }

  // Base64 representation of a white point image
  const webpData =
    'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoCAAEAAQAcJaQAA3AA/v3AgAA=';

  // Retrieve the Image in Blob Format
  const blob = await fetch(webpData)
    .then((r) => r.blob())
    .catch(_.constant(null));

  // If building the image blob fails, return false.
  if (blob == null) {
    support = false;
    return support;
  }

  // If the createImageBitmap method succeeds, return true, otherwise false
  return createImageBitmap(blob).then(
    () => {
      support = true;
      return support;
    },
    () => {
      support = false;
      return support;
    }
  );
};

export const getNextImageUrl = (source: string, width: number, height: number): string => {
  return `/_next/image?url=${source}&w=${width}&h=${height}&q=100`;
};

type NextImageProps = ImageProps;
export const NextImage: FunctionComponent<NextImageProps> = (props) => {
  return <NextImageBase {...props} />;
};
