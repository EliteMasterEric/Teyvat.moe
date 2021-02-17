# [AppSample](https://genshin-impact-map.appsample.com)

## Output map marker locations

```javascript
document.getElementById('app').__vue_app__._context.provides.store._state.data.map.markers
```

Contains an object of feature IDs, which includes the name, icon (part of the URL) and the lat/lng location (origin presumed to be at the center of the map).

## Get completed markers

```javascript
document.getElementById('app').__vue_app__._context.provides.store._state.data.user.userData.doneMarkers
```

Outputs an array of completed marker IDs.