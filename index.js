let map;
markerArr = [];

function LayerControl1(controlDiv, map, barrios) {

  const controlUI = document.createElement("div");
  controlUI.style.backgroundColor = "#fff";
  controlUI.style.border = "2px solid #fff";
  controlUI.style.borderRadius = "3px";
  controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
  controlUI.style.marginTop = "8px";
  controlUI.style.marginLeft = "22px";
  controlUI.style.textAlign = "left";
  controlUI.title = "Click to toggle neighbourhood map";
  controlUI.innerText = "Show/hide map";
  controlUI.style.color = "rgb(25,25,25)";
  controlUI.style.fontFamily = "Roboto,Arial,sans-serif";
  controlUI.style.fontSize = "16px";
  controlUI.style.lineHeight = "38px";
  controlUI.style.paddingLeft = "5px";
  controlUI.style.paddingRight = "5px";
  controlDiv.appendChild(controlUI);

  const controlText = document.createElement("input");
  controlText.id = "Layer1"
  controlText.type = "checkbox";
  controlUI.appendChild(controlText);

  controlText.onchange = function() {
    if (this.checked) {
      barrios.setMap(map);
    } else {
      barrios.setMap(null);
    }
  };
};

function LayerControl2(controlDiv, map, markerArr) {

  const controlUI2 = document.createElement("div");
  controlUI2.style.backgroundColor = "#fff";
  controlUI2.style.border = "2px solid #fff";
  controlUI2.style.borderRadius = "3px";
  controlUI2.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
  controlUI2.style.marginTop = "8px";
  controlUI2.style.marginLeft = "22px";
  controlUI2.style.textAlign = "left";
  controlUI2.title = "Click to toggle markers";
  controlUI2.innerText = "Show/hide markers";
  controlUI2.style.color = "rgb(25,25,25)";
  controlUI2.style.fontFamily = "Roboto,Arial,sans-serif";
  controlUI2.style.fontSize = "16px";
  controlUI2.style.lineHeight = "38px";
  controlUI2.style.paddingLeft = "5px";
  controlUI2.style.paddingRight = "5px";
  controlDiv.appendChild(controlUI2);

  const controlText2 = document.createElement("input");
  controlText2.id = "Layer2"
  controlText2.type = "checkbox";
  controlUI2.appendChild(controlText2);

  controlText2.onchange = function() {
    if (this.checked) {
      for (let i = 0; i < markerArr.length; i++) {
        markerArr[i].setMap(map); 
        }
    } else {
        for (let j = 0; j < markerArr.length; j++) {
        markerArr[j].setMap(null);
        }
    }
  };
};

function initMap() {
    const Cordoba = { lat: -31.417083, lng:-64.189796};
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 12,
      center: Cordoba,
    });

    var barrios = new google.maps.Data ()
    barrios.loadGeoJson("barrios2.json");
    barrios.setStyle({
      fillColor:'green',
      strokeColor: 'green',
      strokeWeight: 1
    });
    barrios.setMap(map);

    google.maps.event.addListener(map, 'click', function(event){
      var marker = new google.maps.Marker({
        position: event.latLng,
        map:map,
        });
        markerArr.push(marker);
      });

  const LayerControl1Div = document.createElement("div");
  LayerControl1(LayerControl1Div, map, barrios);
  map.controls[google.maps.ControlPosition.LEFT_TOP].push(LayerControl1Div);

  const LayerControl2Div = document.createElement("div");
  LayerControl2(LayerControl2Div, map, markerArr);
  map.controls[google.maps.ControlPosition.LEFT_TOP].push(LayerControl2Div);
};


window.initMap = initMap;