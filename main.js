let map;
let marker;
let results;

async function initMap({ lat, lng, zoom }) {
  const { Map } = await google.maps.importLibrary("maps");
  map = new Map(document.getElementById("map"), {
    center: { lat: parseFloat(lat), lng: parseFloat(lng) },
    zoom: parseInt(zoom),
    mapId: "4504f8b37365c3d0",
    disableDefaultUI: true,
  });
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  marker = AdvancedMarkerElement;
}

function createMarker({ lat, lng, number, marker }) {

  const circle = document.createElement("div");
  circle.textContent = 'NaN';
  circle.className = "circle";
  if (number > 0) {
    circle.style.backgroundColor = '#189b25';
    if (number > 3 && number < 10) circle.style.backgroundColor = '#da640b';
    if (number >= 10) circle.style.backgroundColor = '#b8000a';
    circle.textContent = number;
  }
  const createMarker = new marker({
    map,
    position: { lat, lng },
    content: circle,
  });
}

function fetchData({ urlApi, query, placeId, lat, lng, grid, zoom }) {
  const url = `${urlApi}?place_id=${placeId}&query=${query}&lat=${lat}&lng=${lng}&grid_size=${grid}&radius=1&zoom=${zoom}`;
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': import.meta.env.VITE_API_KEY,
      'X-RapidAPI-Host': 'local-rank-tracker.p.rapidapi.com'
    }
  };
  return fetch(url, options)
}

const button = document.getElementById("submit");

const API = 'https://local-rank-tracker.p.rapidapi.com/grid'

button.addEventListener('click', (e) => {
  let businessId = document.getElementById('businessId').value;
  let keyword = document.getElementById('keyword').value;
  let grid = document.getElementById('grid').value;
  let lat = document.getElementById('lat').value;
  let lng = document.getElementById('lng').value;
  let zoom = document.getElementById('zoom').value;
  button.textContent = 'Generating markers...';
  fetchData({
    urlApi: API,
    query: keyword,
    placeId: businessId,
    lat,
    lng,
    zoom,
    grid,
  })
    .then(response => response.json())
    .then(response => {
      results = response.data.results;
      results.forEach(result => {
        createMarker({
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lng),
          number: parseInt(result.rank),
          marker: marker,
        })
      })
      button.textContent = 'Markers generated'
    })
    .catch(err => console.error(err))

  initMap({
    lat,
    lng,
    zoom,
  });

})
