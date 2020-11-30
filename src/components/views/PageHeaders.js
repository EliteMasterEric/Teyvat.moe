import React from 'react';

import { Helmet } from 'react-helmet';
import { t } from '../Localization';

// The base Content Security Policy. {HOST} is replaced with a list of valid hosts.
const CSP_BASE = `
  default-src 'none';
  base-uri 'self';
  block-all-mixed-content;
  child-src <HOST>;
  connect-src 'self' data: <HOST>;
  font-src <HOST>;
  frame-ancestors 'none';
  form-action 'self' <HOST>;
  frame-src <HOST>;
  img-src 'self' data: <HOST>;
  media-src 'none';
  object-src <HOST>;
  script-src <HOST>;
  style-src 'unsafe-inline' <HOST>;
`;

const LOCALHOST_URL = 'localhost:3000';
const CSP_LOCALHOST = CSP_BASE.replace(/<HOST>/g, LOCALHOST_URL);

const VALID_HOSTS = ['genshinmap.github.io', 'genshin-map-beta.netlify.app'];
const CSP_HOSTS = CSP_BASE.replace(/<HOST>/g, VALID_HOSTS.join(' '));

const PERMISSIONS_POLICY = `
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
  layout-animations 'none';
  legacy-image-formats 'none';
  magnetometer 'none';
  microphone 'none';
  midi 'none';
  navigation-override 'none';
  oversized-images 'none';
  payment 'none';
  picture-in-picture 'none';
  publickey-credentials-get 'none';
  sync-xhr 'none';
  usb 'none';
  vr  'none';
  wake-lock 'none';
  screen-wake-lock 'none';
  web-share 'none';
  xr-spatial-tracking 'none';
`;

const PageHeaders = () => {
  const debugCSP = true;

  return (
    <Helmet>
      {/* DISPLAY */}
      {/* The title of the webpage as displayed in the tab name. */}
      <title>{t('page-title')}</title>

      {/* ANALYSIS */}
      {/* Verify ownership to enable the Google Search Console. */}
      <meta name="google-site-verification" content="9b8zWzUcVmznKSwxvRUYv23icg5g8jeMBP858kYEjNs" />

      {/* SECURITY */}
      {/* Dictates how scripts can be loaded and from where. Prevents cross-site scripting attacks. */}
      <meta httpEquiv="Content-Security-Policy" content={debugCSP ? CSP_LOCALHOST : CSP_HOSTS} />
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
