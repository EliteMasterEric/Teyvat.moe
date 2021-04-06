import React, { FunctionComponent } from 'react';
// import { Helmet } from 'react-helmet-async'; // Thread safe variant prevents warnings.
// import Head from 'next/head';

import Theme from 'src/components/Theme';
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

const PageHeadersNext: FunctionComponent = () => {
  const debugCSP = isDev();

  return (
    <>
      {/* DISPLAY */}
      <meta charSet="utf-8" />
      <link rel="icon" href="/favicon.ico" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
      {/* PWA primary color */}
      <meta name="theme-color" content={Theme.palette.primary.main} />
      <meta
        name="description"
        content="Interactive map of Teyvat allows you to find Anemoculus, Geoculus, Waypoints, Regional Specialties, Chests, and more for Genshin Impact."
      />
      <link rel="apple-touch-icon" href="/images/logo.png" />
      {/*
       * manifest.json provides metadata used when your web app is installed on a
       * user's mobile device or desktop. See https://developers.google.com/web/fundamentals/web-app-manifest/
       */}
      <link rel="manifest" href="/manifest.json" />
      {/*
       * Style required for leaflet not to become absolute garbage.
       */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.css"
        integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
        crossOrigin="anonymous"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.4.1/MarkerCluster.css"
        integrity="sha512-RLEjtaFGdC4iQMJDbMzim/dOvAu+8Qp9sw7QE4wIMYcg2goVoivzwgSZq9CsIxp4xKAZPKh5J2f2lOko2Ze6FQ=="
        crossOrigin="anonymous"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.css"
        integrity="sha512-gc3xjCmIy673V6MyOAZhIW93xhM9ei1I+gLbmFjUHIjocENRsLX/QUE1htk5q1XV2D/iie/VQ8DXI6Vu8bexvQ=="
        crossOrigin="anonymous"
      />
      <link rel="stylesheet" href="/index.css" />
      <link rel="stylesheet" href="/LeafletMap.css" />

      {/*
       * ANALYSIS
       * Verify ownership to enable the Google Search Console.
       */}
      <meta name="google-site-verification" content="9b8zWzUcVmznKSwxvRUYv23icg5g8jeMBP858kYEjNs" />

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
    </>
  );
};

export default PageHeadersNext;
