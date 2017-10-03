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
	addNewRating();
});

var liIndex;
$('.btnNewRating').on('click', function(){
    liIndex = $(this).closest('li').index();
    console.log(liIndex);
});

$(document).ready(function(){
	$('#starsForm').starRating({initialRating: 0, starSize: 25, disableAfterRate: false});
    $('#modal1').modal({
    	ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
        var blabla = $(trigger).closest('li').index();
        console.log(blabla);
      	},
      	complete: function() {} // Callback for Modal close
   });
});

$('#formRating').submit(function(){
	$('#modal1').modal('close');
	var stars = Number($('#starsForm').starRating('getRating'));
	var comment = $('#newRatingForm').val();
	var rating = new createNewRating(stars, comment);
	console.log(rating);
	$('#starsForm').starRating('setRating', 0);
	$('#newRatingForm').val('');
});