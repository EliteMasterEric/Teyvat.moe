# Changelog

# 0.2.0

First major release of the rework, featuring a new interface developed in React.

- Most resource types unavailable as markers currently.

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

# 0.5.0

- Imported Liyue chest data from yuanshen.site, mostly manually.
- Added region labels for Liyue.
- Added new features:
  - Viewpoints (Mondstadt Special)
  - Viewpoints (Liyue Special)
- Added markers and revised existing markers for various features:

  - @EliteMasterEric: Mondstadt Teleporters
  - @EliteMasterEric: Mondstadt Domains
  - @EliteMasterEric: Mondstadt Luxurious Chests (full review with descriptions)
  - @EliteMasterEric: Mondstadt Viewpoints
  - @EliteMasterEric: Liyue Teleporters
  - @EliteMasterEric: Liyue Domains
  - @EliteMasterEric: Liyue Viewpoints
  - @EliteMasterEric: Liyue Luxurious Chests (full review with descriptions)
  - @WenshiTakahashi: Liyue Common Chest

- Added various routes:

  - @birth23: Liyue Artifact Route

- Added pictures for various features:

  - @EliteMasterEric: Mondstadt Statues
  - @EliteMasterEric: Mondstadt Teleporters
  - @EliteMasterEric: Mondstadt Viewpoints
  - @EliteMasterEric: Liyue Statues
  - @EliteMasterEric: Liyue Teleporters
  - @EliteMasterEric: Liyue Viewpoints
  - Genshin Impact Wiki: Mondstadt Domains
  - Genshin Impact Wiki: Liyue Domains
  - @EliteMasterEric and bbs.mihoyo.com: Mondstadt Luxurious Chests
  - @EliteMasterEric and bbs.mihoyo.com: Liyue Luxurious Chests
  - @WenshiTakahashi: Liyue Common Chest

- Replaced all JPG images with PNGs.
- Removed file extensions from popup images in data files; PNG or WebP will be selected accordingly.
- Added WebP versions of all images for web performance.
  - Sadly despite living in 2020 we still have to go in and add WebP handlers to every place images are referenced and include fallbacks and detection code, turning every image tag into a mess of spaghetti code.
- Optimized all filter and comment images using PNGQuant for better web performance.
- Fixed a bug where region labels could prevent clicking a marker.

# 0.5.1

- Added markers for all 5 world bosses and 3 weekly bosses.
- Revised world border to add the Golden House.
- Added new options to show/hide features or routes while the editor is enabled.
  - Turn this on to hide clutter while mapping, and turn it off to use markers as a reference.
- Fixed issue where route vertexes could not be dragged properly.
- Added new features:
  - Childe (Liyue Boss)
- Added new markers and revised existing markers for the following features:
  - @EliteMasterEric: Unusual Hillichurl (Wei) Mondstadt (Credit to [DoubleSwrd](https://www.youtube.com/watch?v=Vs5IY1C0iwQ))
    - Total of 7 markers
  - @EliteMasterEric: Unusual Hillichurl (Wei) Liyue (Credit to [DoubleSwrd](https://www.youtube.com/watch?v=Vs5IY1C0iwQ))
    - Total of 12 markers
  - @EliteMasterEric: Loach Pearl (Liyue) (Credit to [Juzzex](https://www.youtube.com/watch?v=4orUPwiOuaM&t=23s))
    - Total of 12 markers
  - @EliteMasterEric: Bamboo Shoot (Liyue) (Credit to [taka gg](https://www.youtube.com/watch?v=DSp3IC6lQDw))
    - Total of 12 markers
- Added new routes:
  - @EliteMasterEric: Loach Pearls (Liyue Nature)
  - @EliteMasterEric: Bamboo Shoots (Liyue Nature)
- Added pictures for various features:
  - @EliteMasterEric and DoubleSwrd: Unusual Hillichurl (Wei) Mondstadt
  - @EliteMasterEric and DoubleSwrd: Unusual Hillichurl (Wei) Liyue
  - @EliteMasterEric: Loach Pearl (Liyue)

# 0.6.0

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

# 0.6.1