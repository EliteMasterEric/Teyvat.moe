import React, { memo } from 'react';
import Theme from 'src/components/Theme';

const PageHeaders = memo(() => {
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

      {/*
       * PERSONAL STYLES
       */}
      <link rel="stylesheet" href="/index.css" />
      <link rel="stylesheet" href="/fonts/Teyvat.css" />

      {/*
       * ANALYSIS
       * Verify ownership to enable the Google Search Console.
       */}
      <meta name="google-site-verification" content="9b8zWzUcVmznKSwxvRUYv23icg5g8jeMBP858kYEjNs" />
    </>
  );
});

export default PageHeaders;
