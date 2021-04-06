/**
 * Contains methods and components which facilitate image rendering,
 * including WebP support detection and a lazy loading, WebP-sensitive image component.
 */

import clsx from 'clsx';
import NextImageBase, { ImageProps } from 'next/image';
import React, { ReactElement, useEffect, useState, FunctionComponent } from 'react';

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
    .catch((_reason) => null);

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

type ImageExtension = 'png' | 'webp';

/**
 * @deprecated Causes major performance issues. Use NextJS image optimization instead.
 * Returns the image extension to use.
 * Built on a React state, so only valid in component body.
 * @param {boolean} block If true, useImageExtension will be null until the value is determined.
 *   Else, the value will be the default extension.
 */
export const useImageExtension = (block = false): ImageExtension | null => {
  const defaultValue: ImageExtension = 'png';
  const [value, setValue] = useState<ImageExtension | null>(block ? null : defaultValue);

  // // Load once.
  useEffect(() => {
    const onMount = async () => {
      // let mounted = true;
      // Fetch the preferences from local storage, by key.
      const result = await supportsWebP();
      console.warn(`WEBP support processing complete: ${result}`);
      //if (mounted)
      setValue(result ? 'webp' : defaultValue);
      //return () => {
      //  mounted = false;
      //};
    };
    onMount();
  }, []);

  return value;
};

export const getNextImageUrl = (src: string, width: number, height: number): string => {
  return `/_next/image?url=${src}&w=${width}&h=${height}&q=100`;
};

const defaultPlaceholder = <span style={{ width: 64, height: 64 }} />;

type NextImageProps = ImageProps;
export const NextImage: FunctionComponent<NextImageProps> = (props) => {
  return <NextImageBase {...props} />;
};
