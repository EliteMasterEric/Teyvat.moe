import { Typography } from '@material-ui/core';
import { FunctionComponent, memo } from 'react';

import sanitizeHTML from 'sanitize-html';

type SafeHTMLProps = Omit<React.ComponentProps<typeof Typography>, 'children'> & {
  children: string | null;
};
/**
 * This component renders the internal text while supporting HTML tags.
 * Strips any unsafe tags such as scripts for security.
 * Renders the same output for the same inputs.
 *
 * @param children The child element should be only text.
 * @param other You can pass other parameters, such as className, and they will be used by the
 */
export const SafeHTML: FunctionComponent<SafeHTMLProps> = memo(({ children, ...other }) => {
  if (children == null) return null;

  const options = {
    allowedTags: ['b', 'i', 'em', 'strong', 'a'],
    allowedAttributes: {
      a: ['href'],
    },
    allowedIframeHostnames: ['www.youtube.com'],
  };

  // Never fear, no danger here! We sanitized this text before rendering it.
  // eslint-disable-next-line react/no-danger
  return (
    <Typography dangerouslySetInnerHTML={{ __html: sanitizeHTML(children, options) }} {...other} />
  );
});
