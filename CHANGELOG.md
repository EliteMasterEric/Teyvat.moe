# Changelog

# 0.2.0

First major release of the rework, featuring a new interface developed in React.

- Most resource types unavailable as markers currently.
- Added support

# 0.2.1

- Renamed Plants/Animals because the label was too long.
- Added exporters for revised and legacy data.
- Fixed bug where local storage data was being stored improperly.
- Added data for Shrines.

# 0.2.2

- Fixed issue with exporter switching latitude and longitude.

# 0.3.0

- Implemented localization support for interface and all features and routes.
- Marking now displays the timestamp on the popup.
- Revised editor popup to a form.
- Various bug fixes I think.
- Feature data:
  - @Lapis256: Added Mondstadt and Liyue Statues of the Seven.
  - @EliteMasterEric: Added Wei, and stubs for Geo Sigils and Crates.
  - @EliteMasterEric: Imported most chest data from Yuanshen.site.

# 0.4.0

- Added 'respawn' parameter to feature data JSON to track respawn time.
- Added new Summary subtab under the About tab.
  - This tab displays a progress bar for all features which are currently displayed and have at least one marker complete.
  - It includes an options menu, allowing users to pan to a random uncompleted marker, clear all markers of the feature, or clear the markers which are expired (if the respawn time is configured for that feature).
- Added missing localization for popups.

# 0.4.5

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
- Renamed Wei to [Unusual Hillichurl](https://genshin.mihoyo.com/en/news/detail/6526).

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
  - @EliteMasterEric: Added several Magical Crystal Chunk locations for Mondstadt and Liyue.
- Fixed the Bishu Plain Liyue Statue of the Seven rendering off the map.
- Fixed a bug where the Submit Editor Data form had missing text in the dropdowns.
- Fixed bug where panning far enough could display parallel universes.
- Fixed ESLint issues preventing the map from building.
