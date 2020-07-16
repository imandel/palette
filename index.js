import mapboxgl from 'mapbox-gl';
import ColorThief from 'colorthief';

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
map.addControl(
  new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true,
    },
    trackUserLocation: true,
  }),
);

map.on('click', (e) => {
  fetch(`https://a.mapillary.com/v3/images?closeto=${e.lngLat.lng},${e.lngLat.lat}&radius=200&client_id=WE9TUWdsODlUOUtpZHhMS0paMFRkQTpjNWJmMjA1MDJhOTM4Y2I0&per_page=20`)
    .then((response) => response.json())
    .then((data) => {
      if (data.features.length > 0) {
        const { key } = data.features[Math.floor(Math.random() * data.features.length)].properties || undefined;
        img.src = `https://images.mapillary.com/${key}/thumb-320.jpg`;
      } else {
        const curPallete = [...palette.childNodes];
        initPalette.forEach((color, i) => {
          curPallete[i].style.backgroundColor = color;
        });
      }
    });
});
