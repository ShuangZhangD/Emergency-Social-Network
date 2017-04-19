var GoogleMap = {
    success : false
};

GoogleMap["location"] = {
    valid: false,
    latitude: 39.9390731,
    longitude: 116.11726
};

function loadMapError(err) {
    console.log("Load Map error");
    GoogleMap["success"] = false;
    getLocation(function (location) {
        console.log("loadMapError - getLocation");
    });
}

function initMap() {
    // Create a map object and specify the DOM element for display.
    getLocation(function (location) {
        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: location.latitude, lng: location.longitude},
            scrollwheel: false,
            zoom: 16
        });
        GoogleMap["map"] = map;
        console.log(map);
        GoogleMap["success"] = true;
    });
    
}

var getLocation = function (successCallback) {
    var location = {
        valid: true,
        latitude: 39.9390731,
        longitude: 116.11726
    };
    GoogleMap["location"] = location;
    successCallback(location);
}