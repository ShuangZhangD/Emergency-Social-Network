var GoogleMap = {
    success : false
};

GoogleMap["location"] = {
    valid: false,
    latitude: 37.410388499999996, 
    longitude: -122.0597295
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
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(p) {
                var location = {
                    valid: true,
                    latitude: p.coords.latitude, 
                    longitude: p.coords.longitude
                };
                GoogleMap["location"] = location;
                successCallback(location);
            },
            function(e){
                var msg = e.code + "\n" + e.message;
                console.log(msg);
            }
        );
    }
}