let map;
markerArr = [];

//The buttons to display the layers
function LayerControl(controlDiv, map, barrios, markerArr) {

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
      for (let i = 0; i < markerArr.length; i++) {
        markerArr[i].setMap(map); 
        }
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
      for (let j = 0; j < markerArr.length; j++) {
        markerArr[j].setMap(null);
        }
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

    //show the neighbourhoods
    var barrios = new google.maps.Data ()
    barrios.loadGeoJson("barrios/barrios_id.json");
    barrios.setStyle({
      fillColor:'green',
      strokeColor: 'green',
      strokeWeight: 1
    });
    barrios.setMap(map);

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
    google.maps.event.addListener(map, 'click', function(event){
      if (document.getElementById("markerLayer").checked) {

        let infowindow = new google.maps.InfoWindow({
          content: contentString,
        });

        //document.getElementById("map").style.cursor = "crosshair";

        marker.setMap(map);
        marker.setPosition(event.latLng);

        marker.addListener("click", () => {
          infowindow.open({
          anchor: marker,
          map,
          shouldFocus: false,
          });
        });

        infowindow.open(map, marker);
        markerArr.push(marker);
      }
    });


  const LayerControlDiv = document.createElement("div");
  LayerControl(LayerControlDiv, map, barrios, markerArr);
  map.controls[google.maps.ControlPosition.LEFT_TOP].push(LayerControlDiv);
};


window.initMap = initMap;