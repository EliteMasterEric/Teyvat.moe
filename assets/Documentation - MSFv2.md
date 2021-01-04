# Marker Storage Format version 2 (MSFv2)

The goal of this new data format is to make IDs easier to handle (non-incremental), remove boilerplate that was only used by GeoJSON and could be inferred (such as type), and add new capabilities (such as attribution and importing).

Generating marker ID:

1. Take the coordinates of the marker or route, as an array, limiting accuracy to 5 decimals.

- Marker: `[ -38.50948, 61.18835 ]`
- Route: `[ [ -38.50948, 61.18835 ], [ -39.50948, 63.18835 ] ]`

2. Convert this string to a SHA1-hash using the `object-hash` library.

- Marker

* JSON Data: `[ -38.50948, 61.18835 ]`
* Object Hash flatten -> `array:2:number:-38.50948number:61.18835`
* SHA1 Hash -> `67AF58A74B7A1952D1FFF8BFF67CBA34773AEEE2`

- Route

* JSON Data: `[ [ -38.50948, 61.18835 ], [ -39.50948, 63.18835 ] ]`
* Object Hash flatten -> `array:2:array:2:number:-38.50948number:61.18835array:2:number:-39.50948number:63.18835`
* SHA1 Hash -> `A86FCE1719E3646DD11BB1570FCD4E1640E6B6D6`

3. Use it as the ID.

Final data format example.:

```javascript
{
  /*
   * cluster {Boolean}: Whether to display this feature or route to the user.
   *   Optional. Allowed on markers or routes.
   *   Defaults to true.
   */
  "enabled": true,
  /*
   * name {Object} The display name of the feature or route.
   *   Localized. Format has not changed since the first marker storage format.
   */
  "name": { "en": "Crimson Agate" },
  /*
   * cluster {String}: Whether to cluster markers of this type.
   *   Optional. Only allowed on markers.
   *   Possible values are:
   *   - 'off' (no clustering, default)
   *   - 'on' (close clustering)
   *   - 'variable' (far clustering based on zoom level)
   */
  "cluster": 'off',
  /*
   * cluster {Number}: How long it takes markers of this type to respawn, in seconds.
   *   Optional. Only allowed on markers.
   *   Used for the Clear Respawned Markers option.
   *   Defaults to -1, indicating no respawn.
   */
  "respawn": -1,
  /*
   * name {Object} Data used to display markers.
   *   Mandatory on markers, not used on routes.
   *   Format has not changed since the first marker storage format.
   */
  "icons": {
    ...
  },

  /*
   * data {Marker[]} An array of markers for this feature,
   *   or routes for this route group.
   */
  "data": [
    {
      /*
       * coordinates {Number[]}: The coordinates of the feature.
       *   Mandatory value. Used on markers and routes.
       *   Routes use Number[][].
       *   Preserve 5 decimal places of accuracy, more is not needed.
       */
      "coordinates": [ -38.50948, 61.18835 ],

      /*
       * id {String}: Value which uniquely identifies the marker.
       *   Mandatory value. Used on markers and routes.
       *   40 hexadecimal characters. Currently a SHA1 hash of the coordinates.
       *   An ID must be used to track collection progress.
       *   Abbreviate using the first 7 characters.
       */
      "id": "67AF58A74B7A1952D1FFF8BFF67CBA34773AEEE2",

      /*
       * routeColor {String}: The color of the route.
       *   Optional value. Only allowed on routes.
       *   Defaults to a red color.
       */
      "routeColor": "#dafada",

      /*
       * routeText {String}: The text which displays over the route.
       *   Optional value. Only allowed on routes.
       *   Defaults to `  ►  `
       */
      "routeText": "  ★  ",

      /*
       * importIds {Object}: Value which identifies this map's marker with other map's markers or previous versions' routes.
       *   Optional value. Used on both markers and routes.
       *   A blank value indicates no corresponding data.
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
       * popupTitle {Object}: The title used on the popup, above the media.
       *   Optional value. Used on both markers and routes.
       *   Localized object. Keys are language names and values are the string to display.
       */
      "popupTitle": {
        "en": ""
      },
      /*
       * popupContent {Object}: The description used on the popup, below the media.
       *   Optional value. Used on both markers and routes.
       *   Localized object. Keys are language names and values are the string to display.
       */
      "popupContent": {
        "en": ""
      },
      /*
       * popupAttribution {String}: The individual, creator, or site that provided this marker.
       *   Optional value. Used on both markers and routes.
       *   Used on popups.
       */
      "popupAttribution": "Yuanshen.site",
      /*
       * popupMedia {String}: The media to display on the popup.
       *   Optional value. Used on both markers and routes.
       *   Blank or missing values display no media in the popup.
       *   Can be one of the following:
       *   - The location of an image file, relative to `public/comments`.
       *       The image will be displayed, in WEBP or PNG depending on browser support.
       *   - A link to a YouTube video.
       *       An embed of the video will be displayed.
       */
      "popupMedia": "https://www.youtube.com/watch?v=K-8qa6a7QRs"
    }
  ]
}
```
