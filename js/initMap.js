var map, geocoder;

function initMap(){
	var OCPosition = {lat: 48.8747648, lng: 2.348376};
		map = new google.maps.Map(document.getElementById('mapCol'), {
		zoom: 16,
		center: OCPosition
	});
	geocoder = new google.maps.Geocoder();
}