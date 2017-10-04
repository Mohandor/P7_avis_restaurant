starSelect.init();

// Call Json à notre fichier test.json où sont stockés les données des restaurants
$.getJSON('data/test.json', function(data){ 
    $.each(data, function(index){ // Pour chaque objet dans notre fichier
        var nbMarker = (index+1).toString(); // On définit l'id
        addMarker(this.lat, this.long, nbMarker, this.restaurantName, index); // On ajoute le marker sur la map
        addRestaurant(this, nbMarker); // On ajoute le restaurant sur notre colonne à gauche
        var sumRatings = 0; // On définit la variable de total des avis à 0
        $.each(this.ratings, function(){ // Pour chaque objet ratings de chaque data 
            addRestaurantRatings(this, nbMarker); // On ajoute les avis à ce restaruant
            sumRatings = this.stars + sumRatings; // On ajout les notes à sumRatings
        });
        var avgRatings = sumRatings/this.ratings.length; // Calcul de la note moyenne
        $('li').last().find('.restaurantAvgRating').starRating({ // Ajout de la note moyenne à ce restaurant
            initialRating: avgRatings,
            readOnly: true,
            starSize: 20
        });
    });
});

var liIndex = '';

$(document).ready(function(){
	$('#starsForm').starRating({initialRating: 2.5, starSize: 25, disableAfterRate: false});
    $('#modal1').modal({
    	ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
        liIndex = $(trigger).closest('li').index();
        return liIndex;
      	}
	});
	$('#modal2').modal();
});

$('#formRating').submit(function(){
	$('#modal1').modal('close'); // On ferme le modal
	var stars = Number($('#starsForm').starRating('getRating')); // On prend la valeur du nouvel avis
	var comment = $('#newRatingForm').val(); // On prend la val de l'input
	var rating = new createNewRating(stars, comment); // On créait un objet rating avec ces valeus
	addRestaurantRatings(rating, (liIndex+1)); // On ajoute ce nouvel avis au restaurant correspondant
	$('#starsForm').starRating('setRating', 2.5); // On remet la valeur de base du starRating à 2.5
	$('#newRatingForm').val(''); // On remet la valeur de l'input du formulaire en vide

	// On recalcule la nouvelle moyenne du restaurant et on met à jours le starRating
	var sumRatings = 0; 
	$('li:nth-child('+(liIndex+1)+')').find('.restaurantRatings').children('.s4').each(function(){
		sumRatings = sumRatings + Number($(this).starRating('getRating'));
	})
	// On arrondi à 0.5 car le plugin ne supporte que des entiers et demis. 
	var avgRatings = Math.round(2*(sumRatings / $('li:nth-child('+(liIndex+1)+')').find('.restaurantRatings').children('.s4').length))/2;
	$('li:nth-child('+(liIndex+1)+')').find('.restaurantAvgRating').starRating('setRating', avgRatings);
});

$('#formRestaurant').submit(function(){
	$('#modal2').modal('close'); // On ferme le modal
	var restaurantName = $('#newRestaurantName').val(); // On prend la val de l'input
	var address = $('#newRestaurantAddress').val(); // On prend la val de l'input

	function codeAddress(restaurantName, address){
		geocoder.geocode( { 'address': address}, function(results, status) {
      		if (status == 'OK') {
      			var lat = results[0].geometry.location.lat();
      			var long = results[0].geometry.location.lng();
      			var newRestaurant = new createNewRestaurant(restaurantName, address, lat, long);
 				var indexLi = $('li').length;
 				addRestaurant(newRestaurant, (indexLi+1));
 				addMarker(newRestaurant.lat, newRestaurant.long, (indexLi+1).toString(), newRestaurant.restaurantName, indexLi);
 				$('li').last().find('.restaurantAvgRating').starRating({ // Ajout de la note moyenne à ce restaurant
		            initialRating: 0,
		            readOnly: true,
		            starSize: 20
	      		});
	      		} else {
        		alert('Geocode was not successful for the following reason: ' + status);
      		}
   		});
 	}
 	codeAddress(restaurantName,address);

	$('#newRestaurantName').val('');
	$('#newRestaurantAddress').val('');

});