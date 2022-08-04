// Initialize and add the map
function initMap() {
    const Cordoba = { lat: -31.420083, lng:-64.188776};
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 12,
      center: Cordoba,
    });
    const marker = new google.maps.Marker({
      position: Cordoba,
      map: map,
    });
  }
  
  window.initMap = initMap;