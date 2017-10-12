starSelect.init();

// Call Json à notre fichier test.json où sont stockés les données des restaurants
$.getJSON('data/restaurant.json', function(data){ 
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

// On définit une variable liIndex
var liIndex = '';
$(document).ready(function(){
	// On initie le rating du modal d'ajout d'avis à 2.5
	$('#starsForm').starRating({initialRating: 2.5, starSize: 25, disableAfterRate: false});
	// On active le #modal1 avec une fonction qui change la valeur du liIndex à chaque trigger
    $('#modal1').modal({
    	ready: function(modal, trigger) { 
        liIndex = $(trigger).closest('li').index();
      	}
	});
	$('#modal2').modal();// On active le modal2
});

// Fonction qui permet l'ajout d'u avis quand on submit le formulaire du modal
$('#formRating').submit(function(){
	$('#modal1').modal('close'); // On ferme le modal
	addnewRestaurantRatings(liIndex); // Fonction qui ajout l'avis dans la <li> correspondante
});
