import { apiResponse } from './apiResponse';
import './style.css'
import { Loader } from "@googlemaps/js-api-loader";
import axios from 'axios';


async function initMap() {
  // Request needed libraries.
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  const map = new Map(document.getElementById("map"), {
    center: { lat: parseFloat(apiResponse.parameters.lat), lng: parseFloat(apiResponse.parameters.lng) },
    zoom: parseInt(apiResponse.parameters.zoom),
    mapId: "4504f8b37365c3d0",
    disableDefaultUI: true,
  });

  function createMarker({ lat, lng, number }) {

    const circle = document.createElement("div");

    circle.className = "circle";
    circle.textContent = number;

    const marker = new AdvancedMarkerElement({
      map,
      position: { lat, lng },
      content: circle,
    });

    return marker;
  }


  const query = document.getElementById("submit");

  query.addEventListener('click', (e) => {
    let businessId = document.getElementById('businessId').value;
    let keyword = document.getElementById('keyword').value;
    let nearBy = document.getElementById('near').value;

    const options = {
      method: 'GET',
      url: 'https://local-rank-tracker.p.rapidapi.com/places',
      params: {
        query: keyword,
        near: nearBy,
      },
      headers: {
        'X-RapidAPI-Key': '4b2dbca1d5msh9865f07a7ca1fd1p1f5599jsna29ef4e76b08',
        'X-RapidAPI-Host': 'local-rank-tracker.p.rapidapi.com'
      }
    };

    try {
      const response = axios.request(options);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }

    if (initMap && results) {
      results.forEach(result => {
        createMarker({
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lng),
          number: parseInt(result.rank)
        })
      });



    } else {
      return
    }
  })

}

let results = apiResponse.data.results;
console.log(results);

// https://rapidapi.com/letscrape-6bRBa3QguO5/api/local-rank-tracker



initMap();

// Configurar la solicitud fetch

//   method: 'GET',
//   headers: {
//     'Content-Type': 'application/json'
//     // Puedes agregar más encabezados según sea necesario
//   },
//   body: JSON.stringify(data)
// })
//   

