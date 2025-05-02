mapboxgl.accessToken = mapApi;

const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/streets-v12',
  center: mapCoordinates.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
  zoom: 13 // starting zoom
});




new mapboxgl.Marker({color:"red",rotation:30})
.setLngLat(mapCoordinates.geometry.coordinates)
.setPopup(new mapboxgl.Popup({offset: 25})
.setHTML(`<b>${mapCoordinates.location}</b><p>exact location provided after booking</p>`))
.addTo(map);