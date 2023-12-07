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

// async function getData({ keyword, nearBy, businessId }) {
//   const options = {
//     method: 'GET',
//     url: 'https://local-rank-tracker.p.rapidapi.com/grid',
//     params: {
//       place_id: 'ChIJoejvAr3Mj4ARtHrbKxtAHXI',
//       query: keyword,
//       lat: '37.341759',
//       lng: '-121.938314',
//       grid_size: '5',
//       radius: '1',
//       zoom: '13'
//     },
//     headers: {
//       'X-RapidAPI-Key': 'cb591c92demsh9ce0726c6e22684p1e6efcjsn6b412bd81878',
//       'X-RapidAPI-Host': 'local-rank-tracker.p.rapidapi.com'
//     }
//   };
//   try {
//     const response = await axios.request(options);
//     console.log(response);
//     return response.data;
//   } catch (error) {
//     console.error(error);
//   }
// }

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
