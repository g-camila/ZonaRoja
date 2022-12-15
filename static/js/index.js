let map;
//markerArr = [];

//The buttons to display the layers
function LayerControl(controlDiv, map, barrios, marker) {

  const controlUI = document.createElement("div");
  controlUI.type = "form";
  controlUI.style.backgroundColor = "#fff";
  controlUI.style.border = "2px solid #fff";
  controlUI.style.borderRadius = "3px";
  controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
  controlUI.style.marginTop = "8px";
  controlUI.style.marginLeft = "10px";
  controlUI.style.textAlign = "left";
  controlUI.style.color = "rgb(25,25,25)";
  controlUI.style.fontFamily = "Roboto,Arial,sans-serif";
  controlUI.style.fontSize = "16px";
  controlUI.style.lineHeight = "38px";
  controlUI.style.paddingLeft = "5px";
  controlUI.style.paddingRight = "5px";
  controlDiv.appendChild(controlUI);

  const controlText1 = document.createElement("input");
  controlText1.id = "markerLayer";
  controlText1.name = "layer"
  controlText1.type = "radio";
  controlUI.appendChild(controlText1);

  const label1 = document.createElement("label");
  label1.setAttribute("for", "radio");
  label1.innerHTML = "Register crime";
  controlUI.appendChild(label1);

  controlText1.onchange = function() {
    if (this.checked) {
      marker.setMap(map);
      barrios.setMap(null);
      }
  };

  const controlText2 = document.createElement("input");
  controlText2.id = "mapLayer";
  controlText2.name = "layer"
  controlText2.type = "radio";
  controlUI.appendChild(controlText2);

  const label2 = document.createElement("label");
  label2.setAttribute("for", "radio");
  label2.innerHTML = "See map";
  controlUI.appendChild(label2);

  controlText2.onchange = function() {
    if (this.checked) {
        marker.setMap(null);
        barrios.setMap(map);
    }
  };
};


//This function will run when the site is loaded
function initMap() {

  //Initialize the map
    const Cordoba = { lat: -31.417083, lng:-64.189796};
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 12,
      center: Cordoba,
    });
    //const geocoder = new google.maps.Geocoder();

    //show the neighbourhoods
    var barrios = new google.maps.Data()
    barrios.loadGeoJson("barrios/barrios_id.json");
    console.log(barrios);
    barrios.setStyle(function(feature){
      return{
      //choose color according to id
        fillColor: getColor(feature.getProperty('id')),
        fillOpacity: 0.7,
        strokeColor: getColor(feature.getProperty('id')),
        strokeWeight: 1,
      }
    });
    barrios.setMap(map);

    barrios.addListener("click", function(e) {
      alert(e.feature.getProperty("Name"));
    });
    //set style when mouse hovers on neighbourhood
    barrios.addListener('mouseover', function(e) {
      barrios.overrideStyle(e.feature, {
        strokeColor: 'white',
        strokeWeight: 2,
        zIndex: 2
      });
    });
    barrios.addListener('mouseout', function(e) {
      barrios.revertStyle();
    });

    //initalize new marker
    let marker = new google.maps.Marker({
      position: Cordoba,
      map:map,
      });
    marker.setMap(null);

    //set info window
    let contentString = '<div id="content">' +
    '<div id="siteNotice">' +
    "</div>" +
     '<div id="bodyContent">' +
        '<form>' +
            '<button type="button" class="btn btn-primary" data-bs-toggle="offcanvas" data-bs-target="#staticBackdrop" aria-controls="staticBackdrop">' + 
            'Register' + '</button>' +
        '</form>' +
      "</div>" +
    "</div>";

    //add events for clicks in map, such as
    //changing position of marker, and showing infowindow
    var b_contains = false;
    google.maps.event.addListener(map, 'click', function(event){
      if (document.getElementById("markerLayer").checked) {

        let infowindow = new google.maps.InfoWindow({
          content: contentString,
        });

        //document.getElementById("map").style.cursor = "crosshair";
        position = event.latLng
        marker.setMap(map);
        marker.setPosition(position);

        marker.addListener("click", () => {
          infowindow.open({
          anchor: marker,
          map,
          shouldFocus: false,
          });
        });

        infowindow.open(map, marker);
        document.getElementById("coordenadas").value = position;

        //console.log("antes")
        b_contains = false;
        barrios.forEach(function(feature) {
          //console.log("antes de if")
          if (feature.getGeometry().getType() == "MultiPolygon") {
            // simplifying assumption, depends on data
            // just check first linear ring
            //console.log(feature.getGeometry().getArray()[0].getAt(0).getArray())
            var poly = new google.maps.Polygon({
              paths: feature.getGeometry().getArray()[0].getAt(0).getArray()
              //path: feature.getGeometry().getAt(0).getArray()
            });
            b_contains = b_contains || google.maps.geometry.poly.containsLocation(marker.getPosition(),poly)
            if (google.maps.geometry.poly.containsLocation(marker.getPosition(),poly)) {
              // if inside polygon, create an infowindow with some information from the GeoJson
              document.getElementById("barrio").value = feature.getProperty("Name");
              document.getElementById("barrio_id").value = feature.getProperty("id");
            }
          }
        })
        if (!(b_contains)){
          document.getElementById("barrio").value = "";
          document.getElementById("barrio_id").value = "";
        }
        
      }
    });


  const LayerControlDiv = document.createElement("div");
  LayerControl(LayerControlDiv, map, barrios, marker);
  map.controls[google.maps.ControlPosition.LEFT_TOP].push(LayerControlDiv);


  //decide color
  function getColor(id){
    var colors = [
      '#d7191c',
      '#fdae61',
      '#ffffbf',
      '#a6d96a',
      '#1a9641'];
  
    return id >= 400 ? colors[4] :
        id > 300 ? colors[3] :
        id > 200 ? colors[2] :
        id > 100 ? colors[1] :
        colors[0];
  };
};

window.initMap = initMap;