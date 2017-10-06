starSelect.init();

// Call Json à notre fichier test.json où sont stockés les données des restaurants
$.getJSON('data/test.json', function(data){ 
    $.each(data, function(index){ // Pour chaque objet dans notre fichier
        var nbMarker = (index+1).toString(); // On définit l'id
        var markerPosition = {lat: this.lat, lng: this.long};
        addMarker(markerPosition, nbMarker, this.restaurantName, index); // On ajoute le marker sur la map
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

// On définit une variable liIndex et à chaque fois que l'on clique sur l'on trigger le modal 1 on modifie liIndex
var liIndex = '';
$(document).ready(function(){
	$('#starsForm').starRating({initialRating: 2.5, starSize: 25, disableAfterRate: false});
    $('#modal1').modal({
    	ready: function(modal, trigger) { 
        liIndex = $(trigger).closest('li').index();
        return liIndex;
      	}
	});
	$('#modal2').modal();// On active le modal2
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
	// On arrondi à 0.5 car le plugin ne supporte que des entiers et demis et on met à jours la note moyenne du restaurant
	var avgRatings = Math.round(2*(sumRatings / $('li:nth-child('+(liIndex+1)+')').find('.restaurantRatings').children('.s4').length))/2;
	$('li:nth-child('+(liIndex+1)+')').find('.restaurantAvgRating').starRating('setRating', avgRatings);
});
