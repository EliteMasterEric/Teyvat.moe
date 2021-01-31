/**
 * Contains methods and components which facilitate image rendering,
 * including WebP support detection and a lazy loading, WebP-sensitive image component.
 */

import clsx from 'clsx';
import React from 'react';
import { LazyLoadComponent } from 'react-lazy-load-image-component';

// A 1 pixel by 1 pixel transparent image.
export const BLANK_IMAGE =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

// Cache the result of supportsWebP.
let support;
/**
 * Calculates whether the browser supports webp images, which are more web performant.
 *
 * NOTE: Only one method works: https://codesandbox.io/s/react-webp-test-kf8rw?file=/src/index.js:412-950
 */
export const supportsWebP = async () => {
  if (typeof support !== 'undefined') return support;

  // If the browser doesn't has the method createImageBitmap, you can't display webp format
  if (!window.createImageBitmap) {
    support = false;
    return support;
  }

  // Base64 representation of a white point image
  const webpData =
    'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoCAAEAAQAcJaQAA3AA/v3AgAA=';

  // Retrieve the Image in Blob Format
  const blob = await fetch(webpData).then((r) => r.blob());

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

/**
 * Returns the image extension to use.
 * Built on a React state, so only valid in component body.
 * @param {boolean} block If true, useImageExtension will be null until the value is determined.
 *   Else, the value will be the default extension.
 */
export const useImageExtension = (block = false) => {
  const defaultValue = 'png';
  const [value, setValue] = React.useState(block ? null : defaultValue);

  // // Load once.
  React.useEffect(async () => {
    let mounted = true;
    // Fetch the preferences from local storage, by key.
    const result = await supportsWebP();
    if (mounted) setValue(result ? 'webp' : defaultValue);
    return () => {
      mounted = false;
    };
  }, []);

  return value;
};

/**
 * React still has no standard solution for everything you need.
 * This component handles lazy loading, placeholdering, and more.
 * @param {*} scrollPosition Call trackWindowScroll on the higher order component to add a 'scrollPosition'
 *   property you can pass to this to reduce performance issues.
 */
// The current placeholder is an empty span.
const defaultPlaceholder = <span style={{ width: 64, height: 64 }} />;
export const Image = ({
  srcPNG,
  srcWebP = null,
  className = '',
  alt = '',
  scrollPosition = undefined,
  placeholder = defaultPlaceholder,
  ...others
}) => {
  return (
    <LazyLoadComponent scrollPosition={scrollPosition} placeholder={placeholder}>
      <picture>
        {srcWebP ? <source srcSet={srcWebP} type="image/webp" /> : null}
        <source srcSet={srcPNG} />
        <img {...others} alt={alt} className={clsx(className)} src={srcPNG} />
      </picture>
    </LazyLoadComponent>
  );
};

/**
 * React still has no standard solution for everything you need.
 * This component handles lazy loading, placeholdering, and more.
 * @param {*} scrollPosition Call trackWindowScroll on the higher order component to add a 'scrollPosition'
 *   property you can pass to this to reduce performance issues.
 */
export const VectorImage = ({
  srcSVG,
  className = '',
  placeholder = defaultPlaceholder,
  alt = '',
  scrollPosition = undefined,
  ...others
}) => {
  return (
    <LazyLoadComponent scrollPosition={scrollPosition} placeholder={placeholder}>
      <img {...others} alt={alt} className={clsx(className)} src={srcSVG} />
    </LazyLoadComponent>
  );
};
