import React, { FunctionComponent } from 'react';
import { Helmet } from 'react-helmet-async'; // Thread safe variant prevents warnings.

import { t } from 'src/components/i18n/Localization';
import { isDev } from 'src/components/util';

// The site connects to these external APIs.
const CONNECT_HOSTS = ['https://api.imgur.com'];
// This site fetches style data from these domains.
const STYLE_HOSTS = ['https://cdnjs.cloudflare.com'];
// This site imports iframes from these domains.
const FRAME_HOSTS = ['https://www.youtube.com'];

// The base Content Security Policy.
// <HOST> is replaced with a list of valid web hosts.
// <CONNECT> is replaced with a list of domains the host connects to.
// 'frame-ancestors' is not supported when delivered via meta element.
const CSP_BASE = `
  default-src 'none';
  base-uri 'self';
  block-all-mixed-content;
  child-src 'none';
  connect-src 'self' data: <CONNECT>;
  font-src 'self';
  manifest-src 'self';
  form-action 'self';
  frame-src <FRAME>;
  img-src 'self' data: https://*;
  media-src 'none';
  object-src 'self';
  script-src 'self';
  style-src 'unsafe-inline' 'self' <STYLE>;
`
  .replace(/<CONNECT>/g, CONNECT_HOSTS.join(' '))
  .replace(/<STYLE>/g, STYLE_HOSTS.join(' '))
  .replace(/<FRAME>/g, FRAME_HOSTS.join(' '));

// Edit, append, or replace this with any pages this site will be hosted on.
const VALID_HOSTS = ['genshinmap.github.io', 'genshin-map-beta.netlify.app'];
const CSP_HOSTS = CSP_BASE.replace(/<HOST>/g, VALID_HOSTS.join(' '));

const PERMISSIONS_POLICY = `
  clipboard-write 'self';
  layout-animations 'self';

  accelerometer 'none';
  ambient-light-sensor 'none';
  autoplay 'none';
  battery 'none';
  camera 'none';
  display-capture 'none';
  document-domain 'none';
  encrypted-media 'none';
  execution-while-not-rendered 'none';
  execution-while-out-of-viewport 'none';
  fullscreen 'none';
  geolocation 'none';
  gyroscope 'none';
  legacy-image-formats 'none';
  magnetometer 'none';
  microphone 'none';
  midi 'none';
  navigation-override 'none';
  oversized-images 'none';
  payment 'none';
  picture-in-picture 'none';
  publickey-credentials-get 'none';
  screen-wake-lock 'none';
  sync-xhr 'none';
  usb 'none';
  vr  'none';
  wake-lock 'none';
  web-share 'none';
  xr-spatial-tracking 'none';
`;

const PageHeaders: FunctionComponent = () => {
  const debugCSP = isDev();

  return (
    <Helmet>
      {/* DISPLAY */}
      {/* The title of the webpage as displayed in the tab name. */}
      <title>{t('page-title-full')}</title>

      {/* SECURITY */}
      {/* Dictates how scripts can be loaded and from where. Prevents cross-site scripting attacks. */}
      <meta httpEquiv="Content-Security-Policy" content={debugCSP ? '' : CSP_HOSTS} />
      {/* States that sites should not attempt to load CSS files as JavaScript. */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      {/* Prevent sites from loading this page in an iframe. Prevents clickjacking attacks. */}
      <meta httpEquiv="X-Frame-Options" content="DENY" />
      {/* Enable primative XSS protection for older browsers. */}
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      {/* Prevents including the referrer in all links. Equivalent to including rel="noreferrer" on all links. */}
      <meta httpEquiv="Referrer-Policy" content="no-referrer" />
      {/* Blacklists certain sensitive APIs, such as microphone and geolocation access. */}
      <meta httpEquiv="Referrer-Policy" content={PERMISSIONS_POLICY} />

      {/* TODO: Expect-CT? What is it and is it helpful here? */}
    </Helmet>
  );
};

export default PageHeaders;
