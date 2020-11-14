import React from 'react';

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
 *  Else, the value will be the default extension.
 */
export const useImageExtension = (block = false) => {
  const defaultValue = 'png';
  const [value, setValue] = React.useState(block ? null : defaultValue);

  // Load once.
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

export const Image = ({ srcPNG, srcWebP, className = '' }) => {
  return (
    <picture>
      <source srcSet={srcWebP} type="image/webp" />
      <source srcSet={srcPNG} />
      <img alt="" className={className} src={srcPNG} />
    </picture>
  );
};
