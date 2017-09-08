function initMap() {
 	var myPosition = {lat: 48.763, lng: 2.309};
  	var map = new google.maps.Map(document.getElementById('mapCol'), {
    	zoom: 15,
    	center: myPosition
  	});
  	var marker = new google.maps.Marker({
    	position: myPosition,
    	map: map
	  });
}