// Initialize and add the map
let map;

function initMap() {
    const Cordoba = { lat: -31.420083, lng:-64.188776};
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 12,
      center: Cordoba,
    });

    map.data.addGeoJson("barrios2.geojson");
  }
  
  window.initMap = initMap;