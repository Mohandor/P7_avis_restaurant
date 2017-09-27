// Fonction qui permet d'ajouter un marker avec la lat(a), la long(b), un label(c) et le nom du restaurant(d)
function addMarker(a,b,c, d){
    var markerPosition = {lat: a, lng: b};
    var marker = new google.maps.Marker({
        position: markerPosition,
        label: c,
        title: d,
        id: c,
        map: map
    });
}

// Fonction permettant l'ajout d'un restaurant dans une <li>
function addRestaurant(ceRestau, nbMarker){
    $('<li/>').addClass('row').attr('id', "restaurant"+nbMarker).appendTo($("#restaurantInfoCol")); // Création d'une li qui va dans l'ul #restaurantInfoCol

    // Création de la div collapsible-header avec les informations du restaurant
    $('<div/>').addClass('collapsible-header').attr('id', 'infoRestaurantHeader'+nbMarker).appendTo($("#"+"restaurant"+nbMarker));
    $('<div/>').addClass('col s8').attr('id', "infoRestaurant"+nbMarker).appendTo($("#infoRestaurantHeader"+nbMarker));
    $('<div/>').addClass('row').attr('id',"infoRestaurant"+nbMarker+"Col").appendTo($("#infoRestaurant"+nbMarker));
    $('<div/>').addClass('col s1').text(nbMarker).appendTo($("#"+"infoRestaurant"+nbMarker+"Col"));
    $('<div/>').addClass('col s10').text(ceRestau.restaurantName).appendTo($("#infoRestaurant"+nbMarker+"Col"));
    $('<div/>').addClass('col s12').text(ceRestau.address).appendTo($("#infoRestaurant"+nbMarker+"Col"));
    $('<div/>').addClass('col s12').attr('id','ratingsRestaurant'+nbMarker).appendTo($("#infoRestaurant"+nbMarker+"Col"));

    // Ajout de l'image google street aux coordonnées qui va dans l'header
    var restaurantLocation = "location="+ceRestau.lat+","+ceRestau.long;
    $('<div/>').addClass('col s4').attr('id', 'streetviewRestaurant'+nbMarker).appendTo($("#infoRestaurantHeader"+nbMarker));
    $('<img>').addClass('col s12').attr('src', '//maps.googleapis.com/maps/api/streetview?size=400x400&key=AIzaSyB48K7MnLGjHOLRg8YlZVgGg2kIj2zNrXU&'+restaurantLocation).appendTo($("#"+"streetviewRestaurant"+nbMarker));
   
    // Ajout du body de notre collapsible pour les notes
    $('<div/>').addClass('col s12').addClass('collapsible-body').attr('id', "restaurant"+nbMarker+"Ratings").appendTo($("#restaurant"+nbMarker));
    $('<div/>').addClass('row').attr('id', "restaurant"+nbMarker+"RatingsRow").appendTo($("#restaurant"+nbMarker+"Ratings"));

}

// Fonction permettant l'ajout des avis avec un objet ratings et un identifiant(nbMarker)
function addRestaurantRatings(ratings, nbMarker){
    $('<div/>').addClass('col s4').starRating({initialRating: ratings.stars, readOnly: true, starSize: 12}).appendTo($('#restaurant'+nbMarker+'RatingsRow'));
    $('<div/>').addClass('col s8').text(ratings.comment).appendTo($('#restaurant'+nbMarker+'RatingsRow'));

}

// Call Json à notre fichier test.json où sont stockés les données des restaurants
$.getJSON('data/test.json', function(data){ 
    $.each(data, function(index){ // Pour chaque objet dans notre fichier
        var nbMarker = (index+1).toString(); // On définit l'id
        addMarker(this.lat, this.long, nbMarker, this.restaurantName); // On ajoute le marker sur la map
        addRestaurant(this, nbMarker); // On ajoute le restaurant sur notre colonne à gauche
        var sumRatings = 0; // On définit la variable de total des avis à 0
        $.each(this.ratings, function(){ // Pour chaque objet ratings de chaque data 
            addRestaurantRatings(this, nbMarker); // On ajoute les avis à ce restaruant
            sumRatings = this.stars + sumRatings; // On ajout les notes à sumRatings
        });
        var avgRatings = sumRatings/this.ratings.length; // Calcul de la note moyenne
        $('#ratingsRestaurant'+nbMarker).starRating({ // Ajout de la note moyenne à ce restaurant
            initialRating: avgRatings,
            readOnly: true,
            starSize: 20
        });
    });
});

