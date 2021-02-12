# Changelog

# 0.2.0 React Rework

First major release of the rework, featuring a new interface developed in React.

- Most resource types unavailable as markers currently.

# 0.2.1

- Renamed Plants/Animals because the label was too long.
- Added exporters for revised and legacy data.
- Fixed bug where local storage data was being stored improperly.
- Added data for Shrines.

# 0.2.2

- Fixed issue with exporter switching latitude and longitude.

# 0.3.0 Localization Support

- Implemented localization support for interface and all features and routes.
- Marking now displays the timestamp on the popup.
- Revised editor popup to a form.
- Various bug fixes I think.
- Feature data:
  - @Lapis256: Added Mondstadt and Liyue Statues of the Seven.
  - @MasterEric: Added Wei, and stubs for Geo Sigils and Crates.
  - @MasterEric: Imported most chest data from Yuanshen.site.

# 0.4.0 Summary Tab

- Added 'respawn' parameter to feature data JSON to track respawn time.
- Added new Summary subtab under the About tab.
  - This tab displays a progress bar for all features which are currently displayed and have at least one marker complete.
  - It includes an options menu, allowing users to pan to a random uncompleted marker, clear all markers of the feature, or clear the markers which are expired (if the respawn time is configured for that feature).
- Added missing localization for popups.

# 0.4.5 Data Importer

- Reimplemented popups on routes.
- Reworked the Preferences handling.
  - Before this point I've been kinda dumb and making breaking changes to the data format without updating the vesrion, mostly assuming nobody uses the app. This updates locks in GenshinMap Data Version 1. Any future changes to the structure of the DEFAULT_MAP_PREFERENCES must now require updating DataImport.
- Added new data importer. You can now transfer data by exporting a string and importing it.
- Added legacy data importer. You can now transfer data from Yuanshen.site, including chest data!
  - If you were using GenshinMap before the rework, press the Export Legacy Data button, copy that, then paste into the Import Legacy Data dialog.
- Added data migration. If the data format used by the app has changed, it will be imported.
  - If there is an error during this process, a value will be stored in local storage. Recovery functions can be added later as needed.
- New features (currently empty):
  - mondstadtLuminescentSpine
  - liyueLuminescentSpine
  - mondstadtCrystalCore
  - liyueCrystalCore
  - liyueBambooShoot
  - liyueGoldenLoach
- Renamed Wei to [Unusual Hilichurl](https://genshin.mihoyo.com/en/news/detail/6526).

# 0.4.10

- Added world border graphic.
  - The boundaries were drawn by hand so they may be slightly off, but not enough to matter.
  - Added option to disable world border graphic.
- Added world region labels for Mondstadt.
  - Liyue labels in progress.
  - Added option to disable world region labels.
- Reworked the editor submission; the data is now put into your clipboard, and you have to paste it in.
  - This is done to prevent a 411 error. There are limits to URL lengths but not to clipboard size (AFAIK).
- Reworked translator rendering to allow simple, safe HTML from some keys.
- Simplified the Help menu's text to include only one contribution link, and bolded it.
- Re-enabled Wei (Mondstadt) in the Feature view.
- Reworked the world map graphic generator to be much faster and create smaller images.
  - Replaced the current world map graphic in `public/tiles`.
- Added a WebP check to the Leaflet map, allowing for use of performant web images.
- Added new world features (seeking contributions!):
  - Magical Crystal Chunk (Mondstadt Ore)
  - Magical Crystal Chunk (Liyue Ore)
  - Loach Pearl (Liyue Nature)
  - Bamboo Shoot (Liyue Nature)
- Map contributions:
  - @MasterEric: Added several Magical Crystal Chunk locations for Mondstadt and Liyue.
- Fixed the Bishu Plain Liyue Statue of the Seven rendering off the map.
- Fixed a bug where the Submit Editor Data form had missing text in the dropdowns.
- Fixed bug where panning far enough could display parallel universes.
- Fixed ESLint issues preventing the map from building.

# 0.5.0 Teleporters and Chest Data

- Imported Liyue chest data from yuanshen.site, mostly manually.
- Added region labels for Liyue.
- Added new features:
  - Viewpoints (Mondstadt Special)
  - Viewpoints (Liyue Special)
- Added markers and revised existing markers for various features:

  - @MasterEric: Mondstadt Teleporters
  - @MasterEric: Mondstadt Domains
  - @MasterEric: Mondstadt Luxurious Chests (full review with descriptions)
  - @MasterEric: Mondstadt Viewpoints
  - @MasterEric: Liyue Teleporters
  - @MasterEric: Liyue Domains
  - @MasterEric: Liyue Viewpoints
  - @MasterEric: Liyue Luxurious Chests (full review with descriptions)
  - @WenshiTakahashi: Liyue Common Chest

- Added various routes:

  - @birth23: Liyue Artifact Route

- Added pictures for various features:

  - @MasterEric: Mondstadt Statues
  - @MasterEric: Mondstadt Teleporters
  - @MasterEric: Mondstadt Viewpoints
  - @MasterEric: Liyue Statues
  - @MasterEric: Liyue Teleporters
  - @MasterEric: Liyue Viewpoints
  - Genshin Impact Wiki: Mondstadt Domains
  - Genshin Impact Wiki: Liyue Domains
  - @MasterEric and bbs.mihoyo.com: Mondstadt Luxurious Chests
  - @MasterEric and bbs.mihoyo.com: Liyue Luxurious Chests
  - @WenshiTakahashi: Liyue Common Chest

- Replaced all JPG images with PNGs.
- Removed file extensions from popup images in data files; PNG or WebP will be selected accordingly.
- Added WebP versions of all images for web performance.
  - Sadly despite living in 2020 we still have to go in and add WebP handlers to every place images are referenced and include fallbacks and detection code, turning every image tag into a mess of spaghetti code.
- Optimized all filter and comment images using PNGQuant for better web performance.
- Fixed a bug where region labels could prevent clicking a marker.

# 0.5.1 v1.1 Markers

- Added markers for all 5 world bosses and 3 weekly bosses.
- Revised world border to add the Golden House.
- Added new options to show/hide features or routes while the editor is enabled.
  - Turn this on to hide clutter while mapping, and turn it off to use markers as a reference.
- Fixed issue where route vertexes could not be dragged properly.
- Added new features:
  - Childe (Liyue Boss)
- Added new markers and revised existing markers for the following features:
  - @MasterEric: Unusual Hilichurl (Wei) Mondstadt (Credit to [DoubleSwrd](https://www.youtube.com/watch?v=Vs5IY1C0iwQ))
    - Total of 7 markers
  - @MasterEric: Unusual Hilichurl (Wei) Liyue (Credit to [DoubleSwrd](https://www.youtube.com/watch?v=Vs5IY1C0iwQ))
    - Total of 12 markers
  - @MasterEric: Loach Pearl (Liyue) (Credit to [Juzzex](https://www.youtube.com/watch?v=4orUPwiOuaM&t=23s))
    - Total of 12 markers
  - @MasterEric: Bamboo Shoot (Liyue) (Credit to [taka gg](https://www.youtube.com/watch?v=DSp3IC6lQDw))
    - Total of 12 markers
- Added new routes:
  - @MasterEric: Loach Pearls (Liyue Nature)
  - @MasterEric: Bamboo Shoots (Liyue Nature)
- Added pictures for various features:
  - @MasterEric and DoubleSwrd: Unusual Hilichurl (Wei) Mondstadt
  - @MasterEric and DoubleSwrd: Unusual Hilichurl (Wei) Liyue
  - @MasterEric: Loach Pearl (Liyue)

# 0.6.0 Redux Rework

- Reworked state to use React Redux to improve major performance issues.
  - The implementation might not be the best since this is my first project using it, but it's definitely a great learning experience.
  - Seriously that was a big rework, it was like the code equivalent of your basement flooding and having to renovate the entire thing.
  - But it's also the code equivalent of putting a sauna in your basement.
- Reworked preferences handling to use Redux.
  - This updates locks in GenshinMap Data Version 2. Previous versions must be migrated to this one; any future breaking changes (structural changes count, addition of new options does not since defaults will be loaded) require creating a new version.
  - Users won't have to do anything, as migration can be done from local storage.
- Images in the Feature and Route menus now use an intelligent Image component, with lazy loading and placeholder support, for improved page performance.
- Moved attribution element so it is never hidden.
- The Summary feature menu will now close when you click an option.
- Marker background is no longer handled by a shadow. This makes markers that are closer together look cleaner (the markers don't overlap).
- Fixed rendering of route arrows to be browser compatible.
- Will no longer display feature/route categories that contain no elements.
- Will redirect the user to a different feature/route category if they switch tabs or regions and the current category would be empty.
- Revised existing markers:
  - Removed 2 redundant Wei locations in Liyue (2 markers at same spot)

# 0.6.1 Meteorite Shards

- Fixed localization not using the proper files.
- Disabled service worker for now.
- Memoized many components (as long as their inputs don't change, they don't need to be rerendered).
- Added the new "Event" category for limited time event items.
- Added schema validation to disallow duplicate markers.
- Added respawn times for the following items:

  - 3 minutes = 180 seconds
    - Anemo Hypostasis (Mondstadt Boss)
    - Cryo Regisvine (Mondstadt Boss)
    - Electro Hypostasis (Mondstadt Boss)
    - Geo Hypostasis (Liyue Boss)
    - Oceanid (Liyue Boss)
    - Pyro Regisvine (Liyue Boss)
  - 12 hours = 43,200 seconds
    - Unusual Hilichurl (Wei) (Liyue Monster)
    - Unusual Hilichurl (Wei) (Mondstadt Monster)
  - 24 hours = 86,400 seconds
    - Abyss Mage (Liyue Monster)
    - Abyss Mage (Mondstadt Monster)
    - Fatui Electro Cicin Mage (Liyue Monster)
    - Fatui Electro Cicin Mage (Mondstadt Monster)
    - Fatui Pyro Agent (Liyue Monster)
    - Fatui Skirmisher (Liyue Monster)
    - Fatui Skirmisher (Mondstadt Monster)
    - Fowl (Liyue Nature)
    - Fowl (Mondstadt Nature)
    - Geovishap Hatchling (Liyue Monster)
    - Hilichurl (Liyue Monster)
    - Hilichurl (Mondstadt Monster)
    - Hilichurl Shooter (Liyue Monster)
    - Hilichurl Shooter (Mondstadt Monster)
    - Mitachurl (Liyue Monster)
    - Mitachurl (Mondstadt Monster)
    - Raw Meat (Liyue Nature)
    - Raw Meat (Mondstadt Nature)
    - Ruin Guard (Liyue Monster)
    - Ruin Guard (Mondstadt Monster)
    - Ruin Hunter (Liyue Monster)
    - Samachurl (Liyue Monster)
    - Samachurl (Mondstadt Monster)
    - Slime (Liyue Monster)
    - Slime (Mondstadt Monster)
    - Stonehide Lawachurl (Liyue Monster)
    - Treasure Hoarder (Liyue Monster)
    - Whopperflower (Liyue Monster)
    - Whopperflower (Mondstadt Monster)
  - 48 hours = 172,800 seconds
    - Bamboo Shoot (Liyue Nature)
    - Calla Lily (Mondstadt Nature)
    - Cecilia (Mondstadt Nature)
    - Dandelion Seed (Mondstadt Nature)
    - Electro Crystal (Liyue Ore)
    - Electro Crystal (Mondstadt Ore)
    - Flaming Flower Stamen (Liyue Nature)
    - Flaming Flower Stamen (Mondstadt Nature)
    - Glaze Lily (Liyue Nature)
    - Horsetail (Liyue Nature)
    - Jueyun Chili (Liyue Nature)
    - Loach Pearl (Liyue Nature)
    - Lotus Head (Liyue Nature)
    - Mist Flower Corolla (Liyue Nature)
    - Mist Flower Corolla (Mondstadt Nature)
    - Noctilucous Jade (Liyue Ore)
    - Philanemo Mushroom (Mondstadt Nature)
    - Qingxin (Liyue Nature)
    - Silk Flower (Liyue Nature)
    - Small Lamp Grass (Mondstadt Nature)
    - Snapdragon (Liyue Nature)
    - Snapdragon (Mondstadt Nature)
    - Starconch (Liyue Nature)
    - Valberry (Mondstadt Nature)
    - Violetgrass (Liyue Nature)
    - White Iron Chunk (Liyue Ore)
    - White Iron Chunk (Mondstadt Ore)
    - Windwheel Aster (Mondstadt Nature)
    - Wolfhook (Mondstadt Nature)
  - 72 hours = 259,200 seconds
    - Crystal Chunk (Liyue Ore)
    - Crystal Chunk (Mondstadt Ore)
    - Magical Crystal Chunk (Liyue Ore)
    - Magical Crystal Chunk (Mondstadt Ore)

- Added new features:
  - @MasterEric: Meteorite Shards (Mondstadt Event) (41 total markers) (Credit to Shukaaa and Lyralei13 on Reddit for locations)
  - @MasterEric: Meteorite Shards (Liyue Event) (77 total markers) (Credit to Shukaaa and Lyralei13 on Reddit for locations)
- Added new routes:
  - @MasterEric: Meteorite Shards (Mondstadt Event) (2 total routes)
  - @MasterEric: Meteorite Shards (Liyue Event) (4 total routes)
- Added images for features:
  - @MasterEric: Wolfhook (Mondstadt Nature) (30 total images)
  - @MasterEric: Meteorite Shards (Mondstadt Event) (41 total images)
  - @MasterEric: Meteorite Shards (Liyue Event) (77 total images)

# 0.6.2

- Fixed major bug where site would not load for new users.
- Fixed duplicate markers for the following features:
  - Challenges (Liyue)
  - Seelies (Liyue)

# 0.7.0 Imgur Uploader

- Added image uploader to Editor tool.
  - The Image field takes a URL; you can also click or drag to upload an image; this will post the image on Imgur and insert the URL.
- Reworked interface to be responsive for mobile devices.
  - Added media queries to rearrange the layout for mobile devices, and tested in Chrome and Firefox using the Device Toolbar / Responsive Design Mode. If you have any suggestions or improvements to improve layout on smaller devices (rearranging the interface based on screen size is an option), please submit an issue.
- Added header with logo to the controls view.

# 0.7.1

- Fixed a bug with the rendering of markers.
- Performance and security improvements.
  - Tested the page with the following tools and implemented changes as suggested:
    - Chrome Lighthouse (https://developers.google.com/web/tools/lighthouse)
    - Mozilla Observatory (https://observatory.mozilla.org/)
    - SecurityHeaders.com (https://securityheaders.com/)
    - https://www.whatismyip.org/website-reviewer/
  - Added several alt tags to images.
  - Added Content Security policy header to prevent XSS attacks.

# 0.8.0 YouTube Embed Support

- Rename Image in Editor to Media.
  - This triggered a breaking change to how editor data was stored, triggering a Preferences version update to GM_003.
  - Added migration for GM_003.
- Added support for YouTube embeds in popups.
  - By using a YouTube URL instead of an image, you can display a tutorial video instead of a picture.
- Added a language override to the Options menu, defaulting to whatever your browser reports.
- Added a hover tooltip explaining the Media field.
- Redid localization.
  - Localization services are now hosted through POEditor.
  - Reorganized the i18n keys.
  - Rewrote the i18n `README.md` file to match the changes to the i18n file.
- Fixed a bug where dropdown selectors would display a console error.
- Added validation for popup Media.
- Added an additional region for Dragonspine internally, currently hidden.
  - For ease of browsing, features and routes in Dragonspine will be in their own region.
- With this update, the repository will be switching the displayed branch for users from gh-pages-legacy to gh-pages, as it is considered feature complete for the purposes of early testing.

# 0.8.1

- Fixed a bug where the Region tabs were not visible.
- Fixed a bug where all languages displayed as English.
- Fixed a bug where embeds would not load due to the content security policy.
- Fixed a bug where popups would not render at the correct width.

# 0.8.2

- Added region tab buttons to the small screen view.
- Added media for the following features:
  - @MasterEric: Anemoculus
    - Video guides for most markers by Jasilo
    - Screenshots for remaining markers by @MasterEric
  - @MasterEric: Geoculus
    - Video guides for all markers by: Jasilo, Ultima Kira, Jonooit, dslockhart, HardcoreTeam
  - @MasterEric: Statues (Mondstadt)
    - Screenshots by @MasterEric had bad URLs.
  - @MasterEric: Shrines (Liyue)
    - Existing images weren't being referenced.
- Markers now always appear above the world border and region labels.
- Fixed a bug where the Region tabs were not visible on larger resolutions.
- Fixed a bug which caused the legacy importer to not load data properly, or to crash the app.
- Fixed a bug where the page would not update the export dialog until the page is refreshed.
- Fixed a bug where the Language dropdown would display as blank rather than the current language.

# 0.8.3 French and Russian

- Added translations for French and Russian. Thanks to the following POEditor users for contributing:
  - French: Joshua, kevin, Lapis128.256
  - Russian: iDevi, Rin, Juila, SnK
- [Legacy site has been rehosted and is available here.](https://genshinmap.github.io/legacy)
  - It is highly recommended that you simply report any issues you have, rather than sticking with the "legacy" site, which will NOT receive any maintenance or new markers.
- Added error status messages to the import popups to help users diagnose issues more easily.
- Fixed a bug which caused the clipboard to not be populated on Google Chrome when submitting editor data.
- Fixed a bug where Editor field performance would dip if the user had a lot of markers.
- Fixed a bug where importing legacy data containing invalid keys would break completely. Now, the invalid keys will be ignored.
- Fixed a bug where browsers which did not support Object.fromEntries would crash.

# 0.8.4

- Improved mapping for features
  - @MasterEric: Added titles to most of the 1800 or so markers that were missing them (only ids, but allows for easy identification).
  - @MasterEric: Mapped Magical Crystal Chunks (Mondstadt) with 18 total locations, with screenshots.
  - @MasterEric: Mapped 3 Common Chest (Mondstadt) locations, with screenshots.
  - @MasterEric: Mapped 2 Exquisite Chest (Mondstadt) locations, with screenshots.
  - @MasterEric: Mapped 1 Dandy (Liyue) location, with screenshot.
  - @MasterEric: Removed 1 offscreen marker from Whopperflower (Liyue).
  - @crisrufo: Mapped 1 Common Chest (Mondstadt).
  - @specklet: Mapped 16 + 1 Common Chest (Mondstadt) locations, with screenshots.
  - @sgtoutlaw: Mapped 1 Fatui Skirmisher (Liyue) with screenshot.
  - @sgtoutlaw: Mapped 2 Whopperflower (Liyue).
  - @1Devi: Mapped 1 Precious Chest (Liyue) with screenshot.
  - @FilthyCrimeBoi: Mapped 75 Raw Meat (Mondstadt) locations.
  - @Makishimu120: Mapped 1 Common Chest (Liyue) with screenshot.
- Removed first issue message as it was just kinda annoying.
- Renamed Wei to Unusual Hilichurl, and updated its icon.
- Added app version display at the top of the options menu. Pulls from package.json.
- Added some icons for upcoming types for 1.2, courtesy of HoneyHunterWorld.
- Developed make_media_local.py script to make importing markers easier.
- New localization strings:
  - options-subtitle-format: Displays the application version at the top of the options menu.
- Removed legacy site from subpath (as added in v0.8.3) because I couldn't get it working alongside the new one.
- Fixed a bug where CSP prevented manifest.json from loading on Chrome.
- Fixed all instances of Hilichurl to read Hilichurl instead (only 1 'L').
  - This required a data storage migration.
- Fixed a bug where Editor GitHub submissions did not include the Editor label.
- Fixed a bug with a missing translation key.

## 0.8.5 has been skipped and relevant feature mapping locations were added in 0.9.0.

# 0.9.0 Dragonspine and Map Rework and Indonesian

- Displayed region for Dragonspine.
  - Once 1.2 releases on December 23rd, submissions for Dragonspine (any feature in any category, preferably with screenshots) will be accepted and greatly appreciated.
- Added preliminary map graphic for Dragonspine, coming in version 1.2.
  - Source: https://genshin.mihoyo.com/en/news/detail/7398
  - This map will be updated once the full update releases.
- Added full Indonesian translation for interface, as provided by dogeregod via the POEditor project.
- Revamped the core map rendering.
  - Users can now zoom closer while using less bandwidth on map graphics.
    - This feature involves auto-scaling tiles at higher zoom levels, but that was being done anyway.
  - Updated react-leaflet and react-leaflet-markercluster to version 3.
- Mapped 126 total feature markers:
  - @MasterEric: Mapped 1 Precious Chest (Liyue Chest) location, with screenshot.
  - @MasterEric: Mapped 2 Magical Crystal Chunk (Liyue Ore) locations, with screenshots.
  - @MasterEric: Mapped 5 Crystal Chunk (Liyue Ore) locations, with screenshots.
  - @sgtoutlaw: Mapped 4 Apple (Mondstadt Nature) locations, with screenshots.
  - @sgtoutlaw: Mapped 4 Berry (Mondstadt Nature) locations.
  - @sgtoutlaw: Mapped 1 Bird Egg (Mondstadt Nature) locations.
  - @sgtoutlaw: Mapped 5 Matsusake (Mondstadt Nature) locations.
  - @sgtoutlaw: Mapped 22 Mint (Mondstadt Nature) locations.
  - @sgtoutlaw: Mapped 26 Pinecone (Mondstadt Nature) locations.
  - @sgtoutlaw: Mapped 13 Sunsettia (Mondstadt Nature) locations.
  - @sgtoutlaw: Mapped 29 Sweet Flower (Mondstadt Nature) locations.
  - @Venryn: Mapped 3 Common Chest (Liyue Chest) locations, with screenshots.
  - @Tatsugi: Mapped 1 Exquisite Chest (Liyue Chest) locations, with screenshots.
  - @birth23: Mapped 9 Geo Sigil (Liyue Chest) locations, with screenshots.
  - @Makushimu120: Mapped 1 Crate (Liyue Chest) location, with screenshot.
- Renamed Matsusake to Matsu**t**ake.
  - This required a data storage migration to GM_005.
- Disabled the following features. The data will remain, and can be re-enabled if there is a rerun.
  - (In the event we want to reduce the space the app takes, we can archive the comment images to another project and re-add them later.)
  - Meteorite Shards (Mondstadt Event)
  - Meteorite Shards (Liyue Event)
- Invalid feature data now only displays a warning in the console, rather than crashing the app.
- The Marker IDs will now be used if a popup specifies no title.
  - Removed marker IDs from ~1800 markers where it was added manually in v0.8.4.
- Added new icons for the following features, courtesy of Honey Hunter World
  - Sunsettia
  - Bamboo Shoot
  - Butterfly Wings
  - Magical Crystal Chunk
  - Plaustrite Shard (UPCOMING)
  - Sweet Flower
- Note that the next major update will not be 1.0, but 0.10.0.

# 0.9.1: Material UI Rework and Code Cleanup

- Added an option to display marked feature progress in the Summary tab even when they are hidden on the map.
- If marked feature progress is displayed in the Summary tab when the feature is hidden on the map, there is now an option to Show that feature in the menu, where the 'Hide Feature' option was.
- Added new localization strings:
  map-summary-menu-show-feature: Label for the option to display marked feature progress in the Summary tab even when they are hidden on the map.
- Replaced many UI components with Material UI (with help from @inform880)
  - Added an internal Theme.
  - Replaced text boxes and text fields in the Editor view and popups.
  - Replaced buttons in Options menu.
  - Replaced switches in the Options menu.
- Restructured code to use absolute file paths for imports, and rearranged directory structure.
- Improved JavaDocs for many files.
- Removed extraneous packages:
  - @react-hook/media-query
  - form-data
  - gh-pages
  - localized-strings
  - react-leaflet-draw
  - react-placeholder
  - redux-thunk
  - salesman.js
  - react-switch

# 0.9.2: Error Handling, Continued Material UI Rework

- Added a new page which displays when the page experiences a crash, allowing users to submit a crash report to GitHub.
- Replaced dropdowns and sliders with Material UI equivalents.
- Reworked map to fix the editor after the changes in v0.9.0.
- @inform880: Replaced import, export, and clear data popups, as well as submit and clear editor data popups, with Material UI modals.
- Reworked the following areas to use Material UI styling, layouts, and components:
  - @inform880: Import Data Popup
  - @inform880: Export Data Popup
  - @inform880: Clear Data Popup
  - @inform880: Submit Editor Data Popup
  - @inform880: Clear Editor Data Popup
  - @MasterEric: Options Tab
  - @MasterEric: Help Tab
  - @MasterEric: Editor Help Tab
  - @MasterEric: Editor Tab
- Added new localization strings:
  - popup-import-hint: Placeholder text on the input box in the Import Data popup.
  - error-handler-flavor: https://www.youtube.com/watch?v=2EwbLyG5nQI
  - error-handler-message: The message on the Error screen informing the user the app has crashed.
  - error-handler-instruction: The message on the Error screen instructing the user to submit the crash report to GitHub.
  - error-handler-submit: Submit to GitHub button
  - editor-media-url-label: Label for text box for Media URL in Editor tab.
  - editor-media-url-help: Help text for text box for Media URL in Editor tab.
  - editor-title-label: Label for the text box for Popup Title in the Editor tab.
  - editor-content-label: Label for the text box for Popup Content in the Editor tab.
  - editor-delete-tooltip: Tooltip for the Delete button on markers and routes.
  - editor-highlight-tooltip: Tooltip for the Highlight button on markers and routes.
- Removed localization strings:
  - editor-elements-media
  - editor-elements-media-placeholder
  - editor-elements-media-tooltip
  - editor-elements-title
  - editor-elements-title-placeholder
  - editor-elements-content
  - editor-elements-content-placeholder
- Removed extraneous packages
  - @material-ui/styles (included in @material-ui/core)
  - react-leaflet-editable
  - react-select-oss
  - reactjs-popup
  - rc-slider

# 0.9.3: Dragonspine

- Updated map graphics using assets extracted from Genshin Impact v1.2.
- Revised the world border to accomodate Dragonspine.
- Reworked marker icons.
  - Improved several existing marker icons to increase image quality.
  - Added new marker icons for certain elements.
- Editor controls now display 'Cancel' while drawing is active.
  - Also displays a 'Done' button while drawing routes.
- Added 6 new region labels for Dragonspine.
  - Tagged all labels with a region name, will eventually add a feature to filter them.
- Added the following markers:
  - @MasterEric: Mapped 1 Teleporter (Mondstadt) location, with screenshot.
  - @MasterEric: Mapped 10 Teleporter (Dragonspine) locations, with screenshots.
  - @MasterEric: Mapped 1 Domain (Dragonspine) location, with screenshot.
  - @MasterEric: Mapped 1 Statue of the Seven (Dragonspine) location, with screenshot.
- Reworked the following areas to use Material UI styling, layouts, and components:
  - @MasterEric: Summary Tab
  - @MasterEric: Controls Tabs
  - @MasterEric: Editor Controls
- Added new localization strings:
  - map-editor-done-tooltip: Tooltip which displays when hovering over the 'Done' button in the map controls on the left.
  - map-editor-cancel-tooltip: Tooltip which displays when hovering over the 'Cancel' button in the map controls on the left.
  - map-editor-marker-tooltip: Tooltip which displays when hovering over the 'Marker' button in the map controls on the left.
  - map-editor-route-tooltip: Tooltip which displays when hovering over the 'Route' button in the map controls on the left.
- Reworked editor data in localization; existing localization for these elements will be invalidated:
  - map-editor-help-content-a: Text which displays in the Editor Help menu.
  - map-editor-help-content-b: Text which displays in the Editor Help menu.
  - map-editor-help-content-c: Text which displays in the Editor Help menu.
  - map-editor-help-content-d: Text which displays in the Editor Help menu.
  - map-editor-help-content-e: Text which displays in the Editor Help menu.
  - map-editor-help-content-f: Text which displays in the Editor Help menu.
- Fixed a bug where routes could not be deleted.
- Fixed a bug where clicking the editor controls would pass through to click the map, causing accidental marker and route placement.
- Fixed a bug where editor controls would not clean up incomplete routes after cancelling.

# 0.9.4 Crimson Agate

- Added the following markers:
  - @MasterEric and @maciejpk: Mapped 79 Crimson Agate, 58 of which have a screenshot or video.
- The following feature types now display by default to new users:
  - Crimson Agate (Dragonspine)
  - Domains (Dragonspine)
  - Teleporters (Dragonspine)
  - Statues of the Seven (Dragonspine)
- Tweaked a Dragonspine teleporter to be more accurate.
- Fixed a bug where progress bars in the Summary tab were always displaying 0%.

# 0.9.5 Tab Rework and Bug Fixes

- Redid Map Controls tabs to use icons with tooltips, rather than text.
  - This should help display on smaller screens and in languages with longer text.
- Moved the Help and Summary subtabs into their own tabs, then removed the About tab.
  - This should make navigating easier.
- Redid region buttons to use CSS styling rather than images.
  - Uses element vector images created by /u/SnooDogs3804 on Reddit.
  - This replaces 64 PNG images with 8 SVGs!
- Updated language strings from POEditor, including partial translations for Japanese and German
  - Strings are still missing for new strings, or outdated for others (mainly the Editor Tab help text). Please contribute if you can!
- Fixed a bug where `Mt. Aozang` was misspelled as `Mt. Aiozag`.
- Fixed a bug where the North Qingyun Peak teleporter had the wrong position.
- Fixed a bug where many Crimson Agate images would not display (wrong image format).
- Fixed a bug where invisible region tabs blocked clicking the map.
- Fixed a bug where the animation on region tabs would not play when the map controls closed.
- Fixed a bug where switching language would cause buttons to not update language until interacted with.
- Fixed a bug where switching languages would not cause Feature and Route buttons to update.

# 0.9.6 Map Clustering Rework, Material UI Cleanup

- Redid several UI elements to use Material UI for styling.
  - Redid open/close banner to use CSS and SVG icons instead of ugly PNGs.
  - Redid main controls panel to use Material UI for styling.
  - Redid Region button container (on the left).
  - The only element of the UI not using Material styling is the Category buttons.
- Redid the "small mode" close and region buttons to use the new UI elements.
- Marker clusters now display other other marker types.
- Marker clusters now display individual markers on click, at any zoom level.
- Marker graphics have been revamped to use SVGs in all cases.
- Markers now recluster when zooming in.
- Markers now decluster to their original positions, rather than a generic circle.
- Fixed a bug where markers listed in the editor Elements tab would start at the 0th index.
- Fixed a bug where popup titles and content would display as `[object Object]`

# [ALPHA] 0.10.0 Marker Data Format Rework

- Marker data is now stored in a new format which will make the importing of new features easier.
  - TODO: Old completion data currently is not migrated, it's just sitting hidden in the user's data. Add functionality to migrate by IDs.
  - Some markers are still being stored in the old format.
- Popups for features stored in the new format now display a switch to enable/disable completed status, as an alternative to double clicking the marker.
- Migrated the following features to the new marker data format:
  - Andrius (Mondstadt): Migrated 1 marker.
  - Anemo Hypostasis (Mondstadt): Migrated 1 marker.
  - Anemoculus (Mondstadt): Migrated 65 markers, and added import IDs for Yuanshen.site.
  - Apple (Mondstadt): Migrated 4 markers, and added import IDs for Yuanshen.site.
  - Childe (Liyue): Migrated 1 marker.
  - Crimson Agate (Dragonspine): Migrated 79 markers, and added import IDs for Yuanshen.site. (This took absurdly long.)
  - Cryo Regisvine (Mondstadt): Migrated 1 marker.
  - Domain (Dragonspine): Migrated 1 marker.
  - Domain (Liyue): Migrated 8 markers.
  - Domain (Mondstadt): Migrated 8 markers.
  - Dvalin (Mondstadt): Migrated 1 marker.
  - Electro Hypostasis (Mondstadt): Migrated 1 marker.
  - Geo Hypostasis (Liyue): Migrated 1 marker.
  - Geoculus (Mondstadt): Migrated 131 markers, and added import IDs for Yuanshen.site.
  - Oceanid (Liyue): Migrated 1 marker.
  - Pyro Regisvine (Liyue): Migrated 1 marker.
  - Statue (Dragonspine): Migrated 1 marker.
  - Statue (Liyue): Migrated 5 markers.
  - Statue (Mondstadt): Migrated 4 markers.
  - Teleporter (Dragonspine): Migrated 10 markers.
  - Teleporter (Liyue): Migrated 40 markers.
  - Teleporter (Mondstadt): Migrated 22 markers.
  - Viewpoint (Liyue): Migrated 17 markers.
  - Viewpoint (Mondstadt): Migrated 10 markers.
- Added new markers:
  - Yuanshen.site: Imported 8 Apple (Mondstadt) locations.
  - Yuanshen.site: Imported 14 Chilled Meat (Dragonspine) locations.
  - Yuanshen.site: Imported 2 Crimson Agate (Dragonspine) locations (1 addition, 1 correction).
- Modified data on popups:
  - Yuanshen.site: Imported 80 Crimson Agate (Dragonspine) Chinese descriptions.
  - Crimson Agate (Dragonspine): All markers now have text descriptions, YouTube embeds, and AppSample IDs (for future importing attempts).
- Added a Close button to popups.
- Removed the "Export Legacy Data" button.
- Localization key modifications:
  - New keys:
    - map-popup-completed-label: Displayed on the popup next to the completed status switch.
    - options-import-yuanshen: Displayed next to the button for "Import from Yuanshen.site" (previously Import Legacy Data)
    - options-export-data: Import Data, previously "options-export-new"
    - options-import-data: Export Data, previously "options-import-new"
    - popup-import-data-content: Popup content when importing data.
    - popup-import-yuanshen-content: Popup content when importing Yuanshen.site data.
  - Removed keys:
    - options-export-old
    - options-import-old
    - options-export-new
    - options-import-new
    - popup-import-old-content
    - popup-import-new-content
- Completed markers now display with a green highlight to distinguish them when opacity is 1.

# [ALPHA] 0.10.1 Yuanshen Import and Debug View

- Added new map Debug view, which can be enabled in the Options. Currently only displays the coordinates at the cursor but more info can be implemented in the future.
- Added a new description field for features and routes. This is a one or two sentence explanation of the feature or route.
  - Like attribution, this will appear in the interface later at some point.
- Created some new scripts to help with the process of importing data from Yuanshen.site.
- Migrated 737 markers from the following features to the new marker data format:
  - Abyss Mage (Liyue): Migrated 34 markers and added Yuanshen.site import IDs.
  - Abyss Mage (Mondstadt): Migrated 7 markers and added Yuanshen.site import IDs.
  - Berry (Mondstadt): Migrated 4 markers and added Yuanshen.site import IDs.
  - Bamboo Shoot (Liyue): Migrated 12 markers and added Yuanshen.site import IDs.
  - Crystal Chunk (Mondstadt): Migrated 46 markers and added Yuanshen.site import IDs.
  - Fatui Electro Cicin Mage (Liyue): Migrated 10 markers and added Yuanshen.site import IDs.
  - Magical Crystal Chunk (Mondstadt): Migrated 18 markers and added Yuanshen.site import IDs.
  - Meteorite Shard (Liyue): Migrated 77 markers (NO YUANSHEN.SITE IDS).
  - Meteorite Shard (Mondstadt): Migrated 41 markers (NO YUANSHEN.SITE IDS).
  - Shrine (Liyue): Migrated 10 markers and added Yuanshen.site import IDs.
  - Shrine (Mondstadt): Migrated 10 markers and added Yuanshen.site import IDs.
  - White Iron Chunk (Mondstadt): Migrated 64 markers and added Yuanshen.site import IDs.
  - Bird Egg (Mondstadt): Migrated 1 markers and added Yuanshen.site import IDs.
  - Calla Lily (Mondstadt): Migrated 40 markers and added Yuanshen.site import IDs.
  - Fatui Electro Cicin Mage (Liyue): Migrated 10 markers and added Yuanshen.site import IDs.
  - Fatui Pyro Agent (Liyue): Migrated 8 markers and added Yuanshen.site import IDs.
  - Fatui Skirmisher (Liyue): Migrated 21 markers and added Yuanshen.site import IDs.
  - Geovishap Hatchling (Liyue): Migrated 15 markers and added Yuanshen.site import IDs.
  - Ruin Guard (Liyue): Migrated 15 markers and added Yuanshen.site import IDs.
  - Ruin Hunter (Liyue): Migrated 5 markers and added Yuanshen.site import IDs.
  - Samachurl (Liyue): Migrated 1 marker and added Yuanshen.site import IDs.
  - Slime (Liyue): Migrated 177 markers and added Yuanshen.site import IDs.
  - Treasure Hoarder (Liyue): Migrated 53 markers and added Yuanshen.site import IDs.
  - Unusual Hilichurl (Liyue): Migrated 10 markers and added Yuanshen.site import IDs.
  - Whopperflower (Liyue): Migrated 48 markers and added Yuanshen.site import IDs.
- Added 220 new markers:
  - Yuanshen.site: Whopperflower (Liyue): Imported 12 locations.
  - Yuanshen.site: Treasure Hoarder (Liyue): Imported 1 location.
  - Yuanshen.site: Samachurl (Liyue): Imported 47 locations.
  - Yuanshen.site: Slime (Liyue): Imported 3 locations
  - Yuanshen.site: Abyss Mage (Dragonspine): Imported 4 location.
  - Yuanshen.site: Abyss Mage (Liyue): Imported 1 location.
  - Yuanshen.site: Abyss Mage (Mondstadt): Imported 1 location.
  - Yuanshen.site: Bamboo Shoot (Liyue): Imported 8 locations.
  - Yuanshen.site: Berry (Mondstadt): Imported 47 locations.
  - Yuanshen.site: Bird Egg (Liyue): Imported 11 location.
  - Yuanshen.site: Bird Egg (Mondstadt): Imported 2 location.
  - Yuanshen.site: Calla Lily (Mondstadt): Imported 11 locations.
  - Yuanshen.site: Fatui Skirmisher (Liyue): Imported 4 locations.
  - Yuanshen.site: Geovishap Hatchling (Liyue): Imported 18 locations.
  - Yuanshen.site: Samachurl (Liyue): Imported 47 locations.
  - Yuanshen.site: White Iron Chunk (Mondstadt): Imported 3 locations.
- Hid the following markers due to lack of data. Feel free to help if you can!
  - Iron Chunk (Mondstadt)
  - Iron Chunk (Liyue)
  - Bird Egg (Liyue)
- Localization of features:
  - @MasterEric: Added 148 English descriptions to features.
  - @alkmaar: Translated 31 Mondstadt features to Russian.
  - @Likanion: Translated 27 Mondstadt nature features to Russian.
  - @MasterEric: Copied Russian translations to 57 features.
- Localization key changes:
  - New keys:
    - popup-export-data-content: The content of the "Export Data" box. Moved from `popup-export-new-content`.
    - options-display-debug: Whether to display the Debug view.
    - debug-title: The "DEBUG" text at the top of the Debug view.
    - respawn-259200: Localized display for respawning 'every 3 days'. Will be used in a future interface.
    - respawn-176800: Localized display for respawning 'every 2 days'. Will be used in a future interface.
    - respawn-86400: Localized display for respawning 'every day'. Will be used in a future interface.
    - respawn-43200: Localized display for respawning 'every 12 hours'. Will be used in a future interface.
    - respawn-180: Localized display for respawning 'after 3 minutes'. Will be used in a future interface.
    - respawn-boss: Localized display for respawning 'on monday at 4 am'. Will be used in a future interface.
    - respawn-none: Localized display for respawning 'never'. Will be used in a future interface.
  - Removed keys:
    - popup-export-old-content
    - popup-export-new-content
- Markers can now be cleared while the Editor is enabled.
- Fixed a bug where new version markers could not be double clicked to mark as completed.
- Fixed several bugs with rendering of clustered markers.

# [ALPHA] 0.10.2 Permalinks, Notifications, and Imports

- Added functionality to navigate to a marker via permalink.
- Added a button to popups to copy the permalink.
- Made the Completed switch smaller using an icon/tooltip to make space for the permalink button.
- Added functionality to display notifications/toasts to the user.
- Adjusted clustering on many markers.
- Migrated 1,495 markers.
  - Cecilia (Mondatadt): Migrated 37 markers, and added Yuanshen.site import IDs.
  - Cor Lapis (Liyue): Migrated 104 markers, and added Yuanshen.site import IDs.
  - Crystal Chunk (Liyue): Migrated 127 markers, and added Yuanshen.site import IDs.
  - Dandelion Seed (Mondstadt): Migrated 47 markers, and added Yuanshen.site import IDs.
  - Electro Crystal (Liyue): Migrated 5 markers, and added Yuanshen.site import IDs.
  - Fatui Electro Cicin Mage (Mondstadt): Migrated 4 markers, and added Yuanshen.site import IDs.
  - Fatui Skirmisher (Mondstadt): Migrated 5 markers, and added Yuanshen.site import IDs.
  - Fish (Liyue): Migrated 9 markers, and added Yuanshen.site import IDs.
  - Flaming Flower Stamen (Liyue): Migrated 4 markers, and added Yuanshen.site import IDs.
  - Flaming Flower Stamen (Mondstadt): Migrated 12 markers, and added Yuanshen.site import IDs.
  - Fowl (Liyue): Migrated 6 markers, and added Yuanshen.site import IDs.
  - Fowl (Mondstadt): Migrated 9 markers, and added Yuanshen.site import IDs.
  - Glaze Lily (Liyue): Migrated 35 markers, and added Yuanshen.site import IDs.
  - Horsetail (Liyue): Migrated 25 markers, and added Yuanshen.site import IDs.
  - Jueyun Chili (Liyue): Migrated 43 markers, and added Yuanshen.site import IDs.
  - Loach Pearl (Liyue): Migrated 11 markers, and added Yuanshen.site import IDs.
  - Lotus Head (Liyue): Migrated 50 markers, and added Yuanshen.site import IDs.
  - Magical Crystal Chunk (Liyue): Migrated 6 markers, and added Yuanshen.site import IDs.
  - Mint (Mondstadt): Migrated 22 markers, and added Yuanshen.site import IDs.
  - Mist Flower Corolla (Liyue): Migrated 8 markers, and added Yuanshen.site import IDs.
  - Mist Flower Corolla (Mondstadt): Migrated 4 markers, and added Yuanshen.site import IDs.
  - Mitachurl (Liyue): Migrated 59 markers, and added Yuanshen.site import IDs.
  - Mitachurl (Mondstadt): Migrated 22 markers, and added Yuanshen.site import IDs.
  - Noctilucous Jade (Liyue): Migrated 46 markers, and added Yuanshen.site import IDs.
  - Philanemo Mushroom (Mondstadt): Migrated 49 markers, and added Yuanshen.site import IDs.
  - Pinecone (Mondstadt): Migrated 27 markers, and added Yuanshen.site import IDs.
  - Qingxin (Liyue): Migrated 17 markers, and added Yuanshen.site import IDs.
  - Raw Meat (Liyue): Migrated 12 markers, and added Yuanshen.site import IDs.
  - Raw Meat (Mondstadt): Migrated 93 markers, and added Yuanshen.site import IDs.
  - Ruin Guard (Mondstadt): Migrated 6 markers, and added Yuanshen.site import IDs.
  - Silk Flower (Liyue): Migrated 15 markers, and added Yuanshen.site import IDs.
  - Small Lamp Grass (Mondstadt): Migrated 75 markers, and added Yuanshen.site import IDs.
  - Snapdragon (Liyue): Migrated 6 markers, and added Yuanshen.site import IDs.
  - Snapdragon (Mondstadt): Migrated 7 markers, and added Yuanshen.site import IDs.
  - Starconch (Liyue): Migrated 69 markers, and added Yuanshen.site import IDs.
  - Sunsettia (Mondstadt): Migrated 13 markers, and added Yuanshen.site import IDs.
  - Sweet Flower (Mondstadt): Migrated 31 markers, and added Yuanshen.site import IDs.
  - Unusual Hilichurl (Mondstadt): Migrated 6 markers, and added Yuanshen.site import IDs.
  - Valberry (Mondstadt): Migrated 19 markers, and added Yuanshen.site import IDs.
  - Violetgrass (Liyue): Migrated 121 markers, and added Yuanshen.site import IDs.
  - White Iron Chunk (Liyue): Migrated 110 markers, and added Yuanshen.site import IDs.
  - Whopperflower (Mondstadt): Migrated 21 markers, and added Yuanshen.site import IDs.
  - Windwheel Aster (Mondstadt): Migrated 65 markers, and added Yuanshen.site import IDs.
  - Wolfhook (Mondstadt): Migrated 33 markers, and added Yuanshen.site import IDs.
- Imported 1,883 markers from Yuanshen.site:
  - Apple (Liyue): Imported 5 new markers.
  - Berry (Dragonspine): Imported 1 new markers.
  - Berry (Liyue): Imported 18 new markers.
  - Carrot (Mondstadt): Imported 45 new markers.
  - Cor Lapis (Liyue): Imported 9 new markers.
  - Crab (Liyue): Imported 26 new markers.
  - Crab (Mondstadt): Imported 63 new markers.
  - Crystal Core (Dragonspine): Imported 31 new markers.
  - Crystal Core (Liyue): Imported 41 new markers.
  - Crystal Core (Mondstadt): Imported 62 new markers.
  - Dandelion Seed (Mondstadt): Imported 3 new markers.
  - Fatui Electro Cicin Mage (Dragonspine): Imported 5 new markers.
  - Fatui Pyro Agent (Mondstadt): Imported 5 new markers.
  - Fatui Skirmisher (Dragonspine): Imported 19 new markers.
  - Fatui Skirmisher (Mondstadt): Imported 8 new markers.
  - Flaming Flower Stamen (Liyue): Imported 18 new markers.
  - Flaming Flower Stamen (Mondstadt): Imported 23 new markers.
  - Fowl (Liyue): Imported 33 new markers.
  - Fowl (Mondstadt): Imported 127 new markers.
  - Frog (Liyue): Imported 10 new markers.
  - Frog (Mondstadt): Imported 19 new markers.
  - Lizard Tail (Liyue): Imported 6 new markers.
  - Lizard Tail (Mondstadt): Imported 10 new markers.
  - Loach Pearl (Liyue): Imported 9 new markers.
  - Lotus Head (Liyue): Imported 12 new markers.
  - Luminescent Spine (Liyue): Imported 24 new markers.
  - Luminescent Spine (Mondstadt): Imported 45 new markers.
  - Magical Crystal Chunk (Liyue): Imported 19 new markers.
  - Mint (Mondstadt): Imported 180 new markers.
  - Mist Flower Corolla (Liyue): Imported 36 new markers.
  - Mist Flower Corolla (Mondstadt): Imported 11 new markers.
  - Mitachurl (Dragonspine): Imported 14 new markers.
  - Mitachurl (Liyue): Imported 3 new markers.
  - Mitachurl (Mondstadt): Imported 4 new markers.
  - Mushroom (Liyue): Imported 7 new markers.
  - Mushroom (Mondstadt): Imported 135 new markers.
  - Pinecone (Liyue): Imported 11 new markers.
  - Pinecone (Mondstadt): Imported 178 new markers.
  - Qingxin (Liyue): Imported 65 new markers.
  - Radish (Mondstadt): Imported 15 new markers.
  - Raw Meat (Liyue): Imported 85 new markers.
  - Raw Meat (Mondstadt): Imported 82 new markers.
  - Ruin Grader (Dragonspine): Imported 1 new markers.
  - Samachurl (Dragonspine): Imported 1 new markers.
  - Samachurl (Mondstadt): Imported 18 new markers.
  - Slime (Dragonspine): Imported 9 new markers.
  - Slime (Mondstadt): Imported 120 new markers.
  - Small Lamp Grass (Mondstadt): Imported 7 new markers.
  - Snapdragon (Liyue): Imported 25 new markers.
  - Snapdragon (Mondstadt): Imported 16 new markers.
  - Starconch (Liyue): Imported 7 new markers.
  - Sunsettia (Liyue): Imported 16 new markers.
  - Sweet Flower (Liyue): Imported 10 new markers.
  - Sweet Flower (Mondstadt): Imported 100 new markers.
  - Violetgrass (Liyue): Imported 11 new markers.
  - White Iron Chunk (Liyue): Imported 1 new markers.
  - Whopperflower (Dragonspine): Imported 16 new markers.
  - Whopperflower (Mondstadt): Imported 2 new markers.
  - Windwheel Aster (Mondstadt): Imported 1 new markers.
- Hid the following markers due to lack of data. Feel free to help if you can!
  - Carrot (Liyue)
  - Radish (Liyue)
- Localization key changes:
  - New keys:
    - map-popup-copy-permalink-label: Tooltip on the button to copy a permalink in a marker popup.
    - notification-permalink-fail-id: Notification which displays when navigating via permalink fails due to an unknown ID.
    - notification-permalink-feature: Notification which displays when navigating to a feature via permalink.
    - notification-permalink-route: Notification which displays when navigating to a route via permalink.
- Fixed a bug where the Completed switch's status would not match the state of the marker.
- Fixed a bug where navigating via permalink would not display the feature if it was currently hidden.
- Fixed a bug where opening of a popup when the category has no completed markers would cause a crash.

# [ALPHA] 0.10.3 Chest Imports and Route Migration

- The v0.10.0 versions have been notated as ALPHA versions. Marker data is not currently migrated from older versions of the map which use different IDs for markers. Please test them to ensure proper functionality but be aware that there may be issues if you use these versions to store progress.
- Map Debug View now includes a text field. Pasting a partial or full marker ID here will locate and navigate to it on the map.
- Help menu now displays a count of markers and routes in the first paragraph.
- Fixed a bug causing routes to not render properly.
- Redid the map graphics to undo an optimization which lowered overall quality at higher zoom levels.
- Fixed an issue where the map seams were visible on higher zoom levels.
- JSON files (including I18N and features) have been replaced with JSONC files.
  - JSONC is a format which is a variant of JSON, which allows for single-line and multi-line comments.
  - Added a Webpack loader to handle converting these JSONC files to JSON objects.
- Disabled features due to lack of data.
  - Hilichurl (Mondstadt)
  - Hilichurl Shooter (Mondstadt)
  - Hilichurl Shooter (Liyue)
  - Stonehide Lawachurl (Liyue)
  - Fish (Mondstadt)
- Migrated routes.
  - Cecilia (Mondstadt)
  - Loach Pearl (Liyue)
  - Bamboo Shoot (Liyue)
  - Hilichurl (Liyue)
  - Artifacts (Liyue)
- Migrated 1,441 markers.
  - Matsutake (Mondstadt): Migrated 32 markers.
  - Matsutake (Liyue): Migrated 9 markers.
  - Hilichurl (Liyue): Migrated 2 markers.
  - Common Chest (Mondstadt): Migrated 225 markers, and added Yuanshen.site import IDs.
  - Exquisite Chest (Mondstadt): Migrated 202 markers, and added Yuanshen.site import IDs.
  - Precious Chest (Mondstadt): Migrated 9 markers, and added Yuanshen.site import IDs.
  - Luxurious Chest (Mondstadt): Migrated 9 markers, and added Yuanshen.site import IDs.
  - Common Chest (Liyue): Migrated 535 markers, and added Yuanshen.site import IDs.
  - Exquisite Chest (Liyue): Migrated 327 markers, and added Yuanshen.site import IDs.
  - Precious Chest (Liyue): Migrated 70 markers, and added Yuanshen.site import IDs.
  - Luxurious Chest (Liyue): Migrated 21 markers, and added Yuanshen.site import IDs.
- Imported 307 new markers.
  - Note: Many of these Common Chests are actually higher rarities, since they could not be sorted automatically.
  - Common Chest (Mondstadt): Imported 41 new chests from Yuanshen.site.
  - Common Chest (Dragonspine): Imported 226 new chests from Yuanshen.site.
  - Common Chest (Liyue): Imported 40 new chests from Yuanshen.site.
- Localization key changes:
  - Modified keys:
    - map-about-help-content-a: Now gives a general description of the app and a counter of markers and routes.

# [ALPHA] v0.10.4 Data Migration

- Added user preferences migration to move user completion data to the new marker storage format.
  - Completion from v0.9 was previously not visible in v0.10.
- Fixed a bug where the map was using Spherical Mercator projection, causing distances farther from the origin to be skewed.
  - Apparently the mapping library the site uses defaults to assuming you're displaying a map of Earth, and therefore calculates distances as thought the map were based on a sphere.
  - This required making a script to realign all the points on the map. If any of them seem skewed, please make an issue requesting a correction.
- Redid importer for Yuanshen.site to work with new marker storage format.
- Update the Editor to place markers in MSFv2 format.
  - Added Description field to Editor Submission.
- Updated localization files:
  - meta-page-title-full: Removed [BETA] tag to make the title more concise
  - popup-submit-editor-data-description: 

# 0.10.5 Finalized v0.10 Release

Here is a summary of major changes from v0.10.0-v0.10.4:
- All Crimson Agates now have text descriptions and YouTube embeds.
- Imported over 2,500 markers from Yuanshen.site, including chests from Dragonspine.
  - Note that since Yuanshen.site does not distinguish between chest rarities by default, these still need to be sorted.
- Markers submitted via the editor are now much easier to add to the main site.
- Performed some of the backend work required to implement importers for AppSample and MapGenie.
- Popups now display a switch to enable/disable completion status.
- Added functionality to convey information to the user via "toast" notifications in the bottom-left corner.
- Markers and routes can now be navigated to directly via hyperlink.
  - The feature of the linked marker will be made visible if it isn't already.
  - Popups now include a button to copy a hyperlink to the clipboard.
- Added new Map Debug view (available to enable in the options) which displays the coordinates at the cursor.

# 0.10.6 Minor Bug Fixes

- Fixed an issue that prevented the page from building properly.
- Fixed an issue that caused the page from displaying as a blank white screen.

# 0.10.7 Changelog Tab and Translations
- Added a changelog tab to display partial information from this document in the app.
- Made improvements to error reporting.
  - The GitHub crash reporter will now attempt to export the user's current preferences and add them to the issue template.
  - The GitHub crash reporter will now apply a sourcemap to the stack trace, if available
    - NOTE: Make sure that sourcemaps are available on Netlify. This may require a Webpack change.
  - These changes should help in the task of replicating and resolving issues.
- Localization changes:
  - map-controls-tab-changelog: The name of the Changelog tab in the interface.
- Imported translations as provided via GitHub:
  - @Alkmaaar: Translated several Mondstadt features.
  - @xRitax: Translated Andrius to Japanese.
  - @luanvilarim: Translated many features to Portuguese. 
- Cleaned up and reformatted feature and route files.
- Fixed some warnings which appeared in the browser console.
  - The `MouseEvent.mozPressure is deprecated` issue cannot be resolved and should be ignored. See: https://github.com/Leaflet/Leaflet/issues/3943
- Fixed a bug where, in certain languages, some features would display with blank names.

# 0.10.8 More Fixes

- Editor data is now migrated to MSFv2.
  - Incremented preferences version to GM_007.
- Added localization strings:
  - editor: The name of the Editor.
  - message-editor-import-success: The popup which appears when importing Editor data.
  - error-handler-component-message: The message displayed on the Component error handler, where {component} will be replaced with the translated name of the specific component which failed.
- Fixed an issue where many markers had not had their images imported.
  - This imports over 300 chest and other images from Yuanshen.site.
- Hid AppSample and MapGenie importers (they are still in development).
- Fixed a bug which caused a "can't use useLeafletContext() outside a MapContainer" error.
  - Ported from NPM to Yarn to allow forcing dependency resolution.
  - There's a bug which prevents upgrading to berry.
- Fixed a bug where routes would change color when placed.
  - This is part of an upcoming feature which will allow recoloring routes.
- Even more improved error handling and reporting.
  - Created a component error wrapper, currently applied to the Editor tab of the Map controls. If it crashes, only that part of the UI will display the error handler.
- Fixed an issue where test markers appeared on the corners of the map.
- Made additions and modifications to existing markers:
  - @specklet: Added new images and descriptions for 13 chests around Stormbearer Point.

# 0.10.9

- Fixed the category buttons in the feature tap not using material components.
- Updated the following features:
  - Mondstadt (Domain): Cleaned up the positions to be more accurate.
  - Mondstadt (Statue of the Seven): Cleaned up the positions to be more accurate.
  - [ ] Mondstadt (Teleporter):
  - [ ] Mondstadt (Shrine):
  - [ ] Liyue (Domain):
  - [ ] Liyue (Statue):
  - [ ] Liyue (Teleporter):
  - [ ] Liyue (Shrine):
  - [ ] Mondstadt Bosses
    - [ ] Positions
    - [ ] Descriptions
  - [ ] Liyue Bosses
    - [ ] Positions
    - [ ] Descriptions
- [ ] World Border fixes
- [ ] Map Graphic changes
- [ ] Editor route editing fix
- Fixed some issues with routes in the editor.
- Fixed a bug where opening a marker popup would reset the completion time.
- Fixed a bug where the editor would output bad coordinates.



- Removed the "Cluster Markers" option from the editor submission form.
- Created localization keys:
  - social-visit-github: Visit us on GitHub
  - social-visit-discord: Visit us on Discord
- Removed localization keys:
  - popup-submit-editor-data-subtitle-b
  - popup-submit-editor-data-cluster-markers
