# [MapGenie](https://mapgenie.io/genshin-impact/maps/teyvat)

## Output map marker locations

```javascript
window.store.getState().map.locationsByCategory
```

Contains an object of feature IDs, where each marker includes the name, title, image, and lat/lng location.

## Get completed markers

```javascript
Object.keys(window.store.getState().user.foundLocations)
```

Outputs an array of completed marker IDs.
