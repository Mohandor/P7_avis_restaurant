// On définit deux variables map et geocoder et la fonction d'initiation de la map
var map, geocoder, service;
function initMap(){
	var OCPosition = {lat: 48.8747648, lng: 2.348376};
	map = new google.maps.Map(document.getElementById('mapCol'), {
	zoom: 16,
	center: OCPosition
	});
	geocoder = new google.maps.Geocoder();
    service = new google.maps.places.PlacesService(map);
    

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            map.setCenter(pos);
            addRestaurantNearby(pos);
        },function() {
                handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
        addRestaurantNearby();
    }

    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        var infoWindow = new google.maps.InfoWindow({map: map});
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
            'Error: The Geolocation service failed.' :
            'Error: Your browser doesn\'t support geolocation.');
    }


}

// On définit un tableau markers
var markers = new Array();
// Fonction qui permet d'ajouter un marker avec la position, un label, le nom du restaurant et l'indexLi correspondant
function addMarker(markerPosition, label, title, indexLi){
    var marker = new google.maps.Marker({
        position: markerPosition,
        label: label,
        title: title,
        map: map
    });
    markers.push(marker); // Le marker est pushé dans notre talbeau
    // A chaque click on ouvre le collapsible correspondant
    marker.addListener('click', function(){
    $('.collapsible').collapsible('open', indexLi);
    $('li:nth-child('+label+')').focus();
});
}