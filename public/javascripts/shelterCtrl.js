app.controller("shelterCtrl", function($window, $scope, $rootScope, $http, mySocket) {
    
    $scope.location = {
        valid: false,
        latitude: "not appliable", 
        longitude: "not appliable"
    };

    $scope.notification = "Google Map is not avaible";
    $scope.shelter_search_area = "";

    var getLocation = function (successCallback) {
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function(p) {
                    var location = {
                        valid: true,
                        latitude: p.coords.latitude, 
                        longitude: p.coords.longitude
                    };
                    $scope.location = location;
                    successCallback(location);
                },
                function(e){
                    var msg = e.code + "\n" + e.message;
                    console.log(msg);
                }
            );
        }
    }

    $scope.showMap = true;
    $scope.showMapSearch = function (content) {
        if (content == 'Map') {
            $scope.showMap = true;
        }
        else {
            $scope.showMap = false;
        }
    }

    $scope.search = function () {
        alert($scope.shelter_search_area);
    }

    $scope.map = null;
    $scope.mapAvaible = false;

    // create map after get location
    //getLocation(function(location) {
      // $scope.map = tryMapMarker(location);
      // if ($scope.map) {
      //     $scope.mapAvaible = true;
      // }
    //});

    $scope.city = {
        "name" : "",

    };

    $rootScope.$on("openMap", function () {
      /*
      $scope.map = tryMapMarker($scope.location);
      if ($scope.map) {
          $scope.mapAvaible = true;
      }
      */
        $scope.location = GoogleMap["location"];
        $scope.mapAvaible = GoogleMap["success"] && $scope.location;
        if (!$scope.location) {
            $scope.notification = "Cannot get your location";
        }
        else {
            $http({
                method:"get",
                url:"/shelter_by_location/" + $scope.location.latitude + "/" + $scope.location.longitude
            }).success(function(res){
                if (res.success == 1) {
                    $scope.city = res.data;
                    if ($scope.mapAvaible) {
                        drawMarkerList();
                    }
                }
                else {
                    // login failed
                    if (rep.err_type == 1) {
                        console.log("Error in DB");
                    }
                    else if (rep.err_type == 2) {
                        console.log("City not found.");
                    }
                    else {
                        console.log("Unexpected error, please try again.");
                    }
                }
            }).error(function (res) {
                console.log(res);
            });
        }
        



        /*
        window.setTimeout(function () {
            //document.getElementById("map").style.height = "70%";
            window.resizeBy(50, 50); 
            console.log("time out!");
        }, 5000);
        */
      
    });


});

var drawMarkerList = function() {
    var pos = {lat: 37.410388499999996, lng: -122.0597295, tag : "Location "};
    var data  = [];
    for (var i = 0; i < 5; i++) {
        var p = {lat: 37.410388499999996 + 0.001 * i, lng: -122.0597295 + 0.001 * i, tag: "Location " + i};
        data.push(p);
    }


    var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 16,
          center: new google.maps.LatLng(37.410388499999996, -122.0597295),
          mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var infowindow = new google.maps.InfoWindow();

    var marker, i;
    console.log("Start drawing!");
    console.log(data.length);
    for (i = 0; i < data.length; i++) {
        lng = data[i].lng;
        lat = data[i].lat;
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat, lng),
            map: map
        });

        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                var contentStrings = data[i].tag;
                console.log(contentStrings);
                infowindow.setContent(contentStrings);
                infowindow.open(map, marker);
            }
        })(marker, i));
    }
}


var drawMarker = function() {

}

var tryMapMarker = function (location) {
    console.log("try create map by location");
    try {
        return mapMarker(location);
    }
    catch(err) {
        console.log("init map failed: ");
        console.log(err);
        return null;
    }
}

var mapMarker = function (location) {
    console.log(location);
    map = new OpenLayers.Map("mapdiv");
    map.addLayer(new OpenLayers.Layer.OSM());
    
    epsg4326 =  new OpenLayers.Projection("EPSG:4326"); //WGS 1984 projection
    projectTo = map.getProjectionObject(); //The map projection (Spherical Mercator)
   
    var lonLat = new OpenLayers.LonLat( location.longitude - 0.007, location.latitude + 0.007 ).transform(epsg4326, projectTo);
          
    
    var zoom=15;
    map.setCenter (lonLat, zoom);

    var vectorLayer = new OpenLayers.Layer.Vector("Overlay");
    
    // Define markers as "features" of the vector layer:
    var p1 = new OpenLayers.Geometry.Point( location.longitude, location.latitude ).transform(epsg4326, projectTo);
    /*var p1 = new OpenLayers.Geometry.Point(16.373056, 48.208333);
    var proj = new OpenLayers.Projection("EPSG:4326");
    p1 = p1.transform(proj, map.getProjectionObject());
    */
    var feature = new OpenLayers.Feature.Vector(
            p1,
            {description:'<br>You are here!<br>'} ,
            {externalGraphic: '/images/icon.png', graphicHeight: 25, graphicWidth: 21, graphicXOffset:-12, graphicYOffset:-25  }
        );    
    vectorLayer.addFeatures(feature);
    
    var feature = new OpenLayers.Feature.Vector(
            //new OpenLayers.Geometry.Point( -0.1244324, 51.5006728  ).transform(epsg4326, projectTo),
            new OpenLayers.Geometry.Point(location.longitude + 0.002, location.latitude + 0.002 ).transform(epsg4326, projectTo),
            {description:'Big Ben'} ,
            {externalGraphic: '/images/marker.png', graphicHeight: 25, graphicWidth: 21, graphicXOffset:-12, graphicYOffset:-25  }
        );    
    vectorLayer.addFeatures(feature);

    var feature = new OpenLayers.Feature.Vector(
            //new OpenLayers.Geometry.Point( -0.119623, 51.503308  ).transform(epsg4326, projectTo),
            new OpenLayers.Geometry.Point( location.longitude - 0.002, location.latitude + 0.002  ).transform(epsg4326, projectTo),
            {description:'London Eye'} ,
            {externalGraphic: '/images/marker.png', graphicHeight: 25, graphicWidth: 21, graphicXOffset:-12, graphicYOffset:-25  }
        );    
    vectorLayer.addFeatures(feature);

   
    map.addLayer(vectorLayer);
 
    
    //Add a selector control to the vectorLayer with popup functions
    /*
    var controls = {
      selector: new OpenLayers.Control.SelectFeature(vectorLayer, { onSelect: createPopup, onUnselect: destroyPopup })
    };

    function createPopup(feature) {
      feature.popup = new OpenLayers.Popup.FramedCloud("pop",
          feature.geometry.getBounds().getCenterLonLat(),
          null,
          '<div class="markerContent">'+feature.attributes.description+'</div>',
          null,
          true,
          function() { controls['selector'].unselectAll(); }
      );
      //feature.popup.closeOnMove = true;
      map.addPopup(feature.popup);
    }

    function destroyPopup(feature) {
      feature.popup.destroy();
      feature.popup = null;
    }
    
    map.addControl(controls['selector']);
    controls['selector'].activate();
    */
    return map;
}



