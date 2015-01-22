var latLonArray = [];
var latitudes = [];
var longitudes = [];
var speeds = [];
var times = [];
var distances = [];
var start;

var myLatLng

function setStart(startTime) {
    this.start = startTime;
}

function initialise() {

    var mapOptions = {
        zoom: 15,
        center: myLatLng
    }

    var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

    var markerStart = new google.maps.Marker({
        position: latLonArray[0],
        map: map,
        title: "Starting Point"
    });

    var markerEnd = new google.maps.Marker({
        position: latLonArray[latLonArray.length-1],
        map: map,
        title: "Finish Point"
    });

    var path = new google.maps.Polyline({
        path: latLonArray,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
    });

    path.setMap(map);

}

function showPosition(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    var currSpeed = 0;

    if (isNaN(position.coords.speed) != true) {
        currSpeed = position.coords.speed;
    }

    var currTime = position.timestamp;

    var timeElapsed = (currTime - start) / 1000;

    console.log(latitude);
    console.log(longitude);
    console.log(currSpeed);
    console.log(timeElapsed);

    $('#coords-table tbody').append('<tr> <td>' + latitude.toFixed(5) + '</td> <td>' + longitude.toFixed(5) +'</td> <td>' +timeElapsed.toFixed(1)+ '</td> </tr>');

    var tempLat = parseFloat(latitude);
    var tempLon = parseFloat(longitude);

    myLatLng = new google.maps.LatLng(tempLat, tempLon);

    latitudes.push(latitude);
    longitudes.push(longitude);
    speeds.push(currSpeed);
    times.push(timeElapsed);

    latLonArray.push(myLatLng);

    console.log(latLonArray);
}

google.maps.event.addDomListener(window, 'load', initialise)

function calcStats(elapsed) {

    var distTemp = 0;
    var timeSeconds = ((elapsed / 1000));

    if (latLonArray.length >= 2) {
        for (var j = 0; j < latLonArray.length - 2; j++) {
            var tempLat1 = latitudes[j];
            var tempLong1 = longitudes[j];
            var tempLat2 = latitudes[j + 1];
            var tempLong2 = longitudes[j + 1];

            var calcDistance = distance(tempLat1, tempLong1, tempLat2, tempLong2, 'K');
            distances.push(calcDistance);

            distTemp = distTemp + calcDistance;

            console.log(distance(tempLat1, tempLong1, tempLat2, tempLong2, 'K'));
            console.log(distTemp);
            
        }
    } else {
        distTemp = 0;
        console.log("distace is 0");
    }

    var speed = distTemp / timeSeconds;

    var speedkmh = speed * 3.6;

    $("#distlatlon").append(distTemp + " metres");

    $("#speedlatlon").append(speed + " m/s");

    $("#speedlatlonKMH").append(speedkmh + " km/h");

    $("#timelatlon").append(timeSeconds + " seconds");

}

function generateCharts() {

    var dataDist = {
        labels: times,
        datasets: [{
            label: "Variation in Distance",
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: distances
        }]
    };

    var dataSpd = {
        labels: times,
        datasets: [{
            label: "Variation in Speed",
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: speeds
        }]
    };

    var distChart = $("#distanceChart").get(0).getContext("2d");
    var spdChart = $("#speedChart").get(0).getContext("2d");

    var newDistChart = new Chart(distChart).Line(dataDist);
    var newSpdChart = new Chart(spdChart).Line(dataSpd);

}

function distance(lat1, lon1, lat2, lon2, unit) {
    var radlat1 = Math.PI * lat1 / 180
    var radlat2 = Math.PI * lat2 / 180
    var radlon1 = Math.PI * lon1 / 180
    var radlon2 = Math.PI * lon2 / 180
    var theta = lon1 - lon2
    var radtheta = Math.PI * theta / 180
    var disti = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    disti = Math.acos(disti)
    disti = disti * 180 / Math.PI
    disti = disti * 60 * 1.1515
    if (unit == "K") { disti = disti * 1.609344 }
    if (unit == "N") { disti = disti * 0.8684 }
    return disti * 1000;
}