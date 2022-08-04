// Initialize and add the map
let map;

function initMap() {
    const Cordoba = { lat: -31.420083, lng:-64.188776};
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 12,
      center: Cordoba,
    });

    map.data.loadGeoJson("https://github.com/g-camila/ZonaRoja/blob/798b243130a6015b8993d6d074413feeda981419/barrios2.json");
  }
  
  window.initMap = initMap;