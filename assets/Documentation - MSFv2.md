# Marker Storage Format version 2 (MSFv2)

The goal of this new data format is to make IDs univeral (non-incremental), remove boilerplate that was only used by GeoJSON and could be inferred (such as type), and add new capabilities (such as attribution and importing).

Generating marker ID:

1. Take the coordinates of the marker or route, in JSON format, accuracy of 5 decimal places. Spaces near brackets, and after commas.
   Marker: `[ -38.50948, 61.18835 ]`
   Route: `[ [ -38.50948, 61.18835 ], [ -39.50948, 63.18835 ] ]`
2. Convert this string to an MD5-hash.
   Marker: `da85a9737bd103df3af3a0ce2c88d030`
   Route: `eab42b7df181412c97108dcc079c6570`
3. Use it as the ID.

Final data format example:

```javascript
{
  /*
   * coordinates {Number[]}: The coordinates of the feature.
   *   Preserve 5 decimal places of precision, more is not needed.
   *   Routes use Number[][].
   */
  "coordinates": [ -38.50948, 61.18835 ],

  /*
   * id {String}: Value which uniquely identifies the marker.
   *   32 hexadecimal characters. Currently an MD5 hash of the coordinates.
   *   Used to track collection progress.
   *   Abbreviate using the first 7 characters.
   */
  "id": "da85a9737bd103df3af3a0ce2c88d030",

  /*
   * importIds {Object}: Value which identifies this map's marker with other map's markers.
   *   May be empty or unspecified. If unspecified, there is no corresponding marker on other maps.
   *   Can be used to migrate old user data, or import data from other sites.
   *   One ID here can correspond to multiple markers on GenshinMap,
   *   or one marker on GenshinMap may correspond to multiple markers on other sites.
   */
  "importIds": {
    /*
     * yuanshen {String[]}: The corresponding marker ID(s) on https://yuanshen.site/.
     */
    "yuanshen": ["26_107"],
    /*
     * appsample {String[]}: The corresponding marker ID(s) on https://genshin-impact-map.appsample.com/.
     */
    "appsample": ["9017"],
    /*
     * gm_legacy {String[]}: The corresponding marker ID(s) for GenshinMap
     *   before the MSFv2 migration.
     */
    "gm_legacy": ["107"]
    /*
     * gm_msfv2 {String[]}: The corresponding marker ID(s) for GenshinMap
     *   after migration.
     */
    "gm_msfv2": [ "c5af392a12e33beea997ff2fe2ab7177" ]
  },

  /*
   * popupTitle {String}: The title used on the popup, above the media.
   */
  "popupTitle": {
    "en": ""
  },
  /*
   * popupContent {String}: The description used on the popup, below the media.
   */
  "popupContent": {
    "en": ""
  },
  /*
   * popupAttribution {String}: The individual, creator, or site that provided this marker.
   *   Used on popups.
   */
  "popupAttribution": "Yuanshen.site",
  /*
   * popupMedia {String}: The media to display on the popup.
   *   Can be one of the following:
   *   - The location of an image file, relative to `public/comments`.
   *       The image will be displayed, in WEBP or PNG depending on browser support.
   *   - A link to a YouTube video.
   *       An embed of the video will be displayed.
   */
  "popupMedia": "https://www.youtube.com/watch?v=K-8qa6a7QRs"
},
```
