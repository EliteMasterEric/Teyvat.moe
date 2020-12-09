# GenshinMap.github.io

[Instructions for use (untranslated)](https://bbs.mihoyo.com/ys/article/1328298)

To-Do status is saved to local storage.

## Credits

This map is not my creation; it was originally developed and filled out by the Chinese community, at http://www.yuanshen.site/.
/u/gbdematos downloaded the map and translated parts of it into English, and I uploaded it for public viewing on GitHub.

That said, I am open to pull requests to expand this map or add/remove features to it. If you have any concerns, [message me](https://reddit.com/message/compose/?to=EliteMasterEric).

## To-Do

I looked through the code, and it appears there are several obstacles to further development of this map:

- [ ] ALL of the location data appears to be [on one line of JavaScript](https://github.com/GenshinMap/genshinmap.github.io/blob/master/js/Item_Json.js#L205). It should ideally be moved out.
- [ ] Large parts of the code, such as those referring to categories, appear to be untranslated (for example, Anemoculus are on the layer Layer_FST). It would be useful for future development for these to be translated.

Here is a list of features yet to be developed:

- [ ] Make it easy to make pull requests to add new markers (I noticed some were missing, for example several Electro Crystal nodes)
- [ ] Make it easy to clear To-Do status of all markers of a certain subcategory (For example, you could mark all the Elite Enemies or White Iron then reset them for the next day)

## Other Maps

Here is a list of other Genshin Impact maps that are available for you to cross-reference.

* [AppSample](https://genshin-impact-map.appsample.com/#/)
* [MapGenie](https://mapgenie.io/genshin-impact/maps/teyvat)
* [Yuanshen.site](http://www.yuanshen.site/) (Chinese)
* [GameWith.net](https://gamewith.net/genshin-impact/article/show/22639)
* [Genshin.gg](https://genshin.gg/map)
