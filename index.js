import mapboxgl from 'mapbox-gl';
import ColorThief from 'colorthief';
import { point } from '@turf/helpers';
import * as bearing from '@turf/bearing';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

const angles = [-90, 90];

const colorThief = new ColorThief();
const img = new Image();
const palette = document.getElementById('palette');
img.crossOrigin = 'Anonymous';
const initPalette = ['#000000', '#333333', '#555555', '#777777', '#999999', '#BBBBBB', '#FFFFFF'];
const numColors = initPalette.length;

initPalette.forEach((color) => {
  const rect = document.createElement('div');
  rect.style.flexGrow = 1;
  rect.style.backgroundColor = color;
  palette.appendChild(rect);
});

img.onload = () => {
  console.log(img.src);
  const colors = colorThief.getPalette(img, numColors);
  const curPallete = [...palette.childNodes];
  colors.forEach((color, i) => {
    curPallete[i].style.backgroundColor = `rgb(${color})`;
  });
};

mapboxgl.accessToken = 'pk.eyJ1IjoiaW1hbmRlbCIsImEiOiJjankxdjU4ODMwYTViM21teGFpenpsbmd1In0.IN9K9rp8-I5pTbYTmwRJ4Q';
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/imandel/ck9srq6r704lh1jpa3zzqzunp',
  center: [-73.946382, 40.724478],
  zoom: 12,
});

const geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  mapboxgl,
  marker: false,
});

map.addControl(geocoder);

map.addControl(
  new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true,
    },
    trackUserLocation: true,
  }),
);

map.on('click', (e) => {
  const url = `https://roads.googleapis.com/v1/snapToRoads?path=${e.lngLat.lat},${e.lngLat.lng}|${e.lngLat.lat - 0.0001},${e.lngLat.lng + 0.0001}|${e.lngLat.lat + 0.0001},${e.lngLat.lng - 0.0001}&key=AIzaSyC-i4qmwLxEasUeNjyFlOMcH4frsK98kaM`;
  let imgURL;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data.snappedPoints.length > 1) {
        const p1 = point([data.snappedPoints[0].location.longitude, data.snappedPoints[0].location.latitude]);
        const p2 = point([data.snappedPoints[1].location.longitude, data.snappedPoints[1].location.latitude]);
        const roadHeading = bearing.default(p1, p2);
        imgURL = `https://maps.googleapis.com/maps/api/streetview?size=600x300&location=${e.lngLat.lat},${e.lngLat.lng}&source=outdoor&fov=90&key=AIzaSyC-i4qmwLxEasUeNjyFlOMcH4frsK98kaM&pitch=12&heading=${roadHeading + angles[Math.floor(Math.random() * angles.length)]}`;
        img.src = imgURL;
      }
    });
});
