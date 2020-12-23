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

# 0.9.3: Continued Material UI Rework

- Revised the world border to accomodate Dragonspine.
- Reworked the following areas to use Material UI styling, layouts, and components:
  - @MasterEric: Summary Tab
  - @MasterEric: Controls Tabs
