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

    $scope.map = null;
    $scope.mapAvaible = false;

    // create map after get location
    //getLocation(function(location) {
      // $scope.map = tryMapMarker(location);
      // if ($scope.map) {
      //     $scope.mapAvaible = true;
      // }
    //});

    $scope.showNotification = true;

    $scope.locationResult = {
        "name" : "",
        "shelter" : []
    };

    $rootScope.$on("openMap", function () {
      /*
      $scope.map = tryMapMarker($scope.location);
      if ($scope.map) {
          $scope.mapAvaible = true;
      }
      */
        $scope.searchResult = [];

        $scope.location = GoogleMap["location"];
        $scope.mapAvaible = GoogleMap["success"] && $scope.location.valid;
        if (!$scope.location.valid) {
            // flow A3: no-location, map / no-map.
            $scope.notification = "Cannot get your location";
            console.log($scope.location);
            console.log(GoogleMap);
        }
        else {
            $http({
                method:"get",
                url:"/shelter_by_location/" + $scope.location.latitude + "/" + $scope.location.longitude
            }).success(function(res){
                if (res.success == 1) {
                    if (GoogleMap["success"]) {
                        // basic flow: location-city, map
                        $scope.showNotification = false;
                    }
                    else {
                        // flow A4: location-city, no-map
                        $scope.notification = "Map is not avaible";
                    }
                    $scope.locationResult = res.data;
                    if ($scope.mapAvaible) {
                        drawMarkerListByLocation($scope.location, res.data.shelter);
                    }
                }
                else {
                    if (res.err_type == 1) {
                        console.log("Error in DB");
                        $scope.notification = "No emergency shelters near your current location";
                    }
                    else if (res.err_type == 2 || res.err_type == 3) {
                        // flow A1: location-no-city, map
                        // flow A2: location-no-city, no-map
                        console.log("City not found or no nearby city.");
                        $scope.notification = "No emergency shelters near your current location";
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



    $scope.searchResult = [];
    $scope.search = function () {
        //$scope.shelter_search_areaalert($scope.shelter_search_area);
        var keywordList = $scope.shelter_search_area.match(/\S+/g) || [];
        if (keywordList.length <= 0 || keywordList.length > 5) {
            alertify.alert("ESN", "The keyword limit is from 1 to 5!");
            return;
        }

        $http({
            method:"get",
            url:"/shelter_search/" + encodeURIComponent($scope.shelter_search_area)
        }).success(function(res){
            console.log(res);
            if (res.success == 1) {
                $scope.searchResult = parseSearchResult(getFirst3(res.data));
                console.log($scope.searchResult);
                // if ($scope.mapAvaible && $scope.locationResult.length > 0) {
                //     drawMarkerListBySearch($scope.location, $scope.locationResult);
                // }
                if ($scope.searchResult.length <= 0) {
                    alertify.alert("ESN", "Cannot find city which name contains '" + $scope.shelter_search_area + "', please search again.");
                }
            }
            else {
                if (res.err_type == 1) {
                    console.log("Error in DB");
                }
                else {
                    console.log("Unexpected error, please try again.");
                }
            }
        }).error(function (res) {
            console.log(res);
        });
    }
});


var getFirst3 = function(data) {
    if (data.length <= 3) {
        return data;
    }
    var new_data = [];
    for (var i = 0; i < 3; i++) {
        new_data.push(data[i]);
    }
    return new_data;
}

var parseSearchResult = function(data) {
    var new_data = [];
    data.forEach(function (city) {
        if (city.shelter.length <= 0) {
            var item = {
                "city" : city.name,
                "name" : "No shelter",
                "address" : "Please go to nearby city"
            };
            new_data.push(item);
        }
        city.shelter.forEach(function (shelter) {
            var item = {
                "city" : city.name,
                "name" : shelter.name,
                "address" : shelter.address
            };
            new_data.push(item);
        });
    });
    return new_data;
}


var drawMarkerListBySearch = function(location, cityList) {
    var pos = {lat: 37.410388499999996, lng: -122.0597295, tag : "Location "};
    var data  = [];
    cityList.forEach(function (city) {
        city.shelter.forEach(function (shelter) {
            var p = {lat: shelter.location[0], lng: shelter.location[1], tag: shelter.name + ",  " + city.name + ",  " + shelter.address};
            data.push(p);
        });
    });

    drawMarkerList(location, data);
}



var drawMarkerListByLocation = function(location, shelterList) {
    var pos = {lat: 37.410388499999996, lng: -122.0597295, tag : "Location "};
    var data  = [];
    shelterList.forEach(function (shelter) {
        var p = {lat: shelter.location[0], lng: shelter.location[1], tag: shelter.name + ",  " + shelter.address};
        data.push(p);
    });
    drawMarkerList(location, data);
}

var drawMarkerList = function(location, data) {

    var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 13,
          //center: new google.maps.LatLng(37.410388499999996, -122.0597295),
          center: new google.maps.LatLng(location.latitude, location.longitude),
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
