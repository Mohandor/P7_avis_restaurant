var markers = new Array();

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
    markers.push(marker);
}

// Fonction permettant l'ajout d'un restaurant dans une <li>
function addRestaurant(thatRestau, nbMarker){
    var li = $('<li/>').addClass('row').appendTo($("ul")); // Création d'une li qui va dans l'ul

    // Création de la div collapsible-header avec les informations du restaurant
    var liHeader = $('<div/>').addClass('collapsible-header').appendTo(li);
    var leftCol = $('<div/>').addClass('col s8').attr('id', "infoRestaurant"+nbMarker).appendTo(liHeader);
    var leftRow = $('<div/>').addClass('row').appendTo(leftCol);
    $('<div/>').addClass('col s1').text(nbMarker).appendTo(leftRow);
    $('<div/>').addClass('col s10').text(thatRestau.restaurantName).appendTo(leftRow);
    $('<div/>').addClass('col s12').text(thatRestau.address).appendTo(leftRow);
    $('<div/>').addClass('col s12 restaurantAvgRating').appendTo(leftRow);

    // Ajout de l'image google street aux coordonnées qui va dans l'header
    var restaurantLocation = "location="+thatRestau.lat+","+thatRestau.long;
    var rightCol = $('<div/>').addClass('col s4 valign-wrapper').appendTo(liHeader);
    $('<img>').addClass('streetview').attr('src', '//maps.googleapis.com/maps/api/streetview?size=400x400&key=AIzaSyB48K7MnLGjHOLRg8YlZVgGg2kIj2zNrXU&'+restaurantLocation).appendTo(rightCol);
   
    // Ajout du body de notre collapsible pour les notes
    var liBody = $('<div/>').addClass('col s12').addClass('collapsible-body').appendTo(li);
    $('<div/>').addClass('row restaurantRatings').appendTo(liBody);

}

// Fonction permettant l'ajout des avis avec un objet ratings et un identifiant(nbMarker)
function addRestaurantRatings(ratings, indexLi){
    var rowRestaurantRatings = $('li:nth-child('+indexLi+')').find('.restaurantRatings');
    $('<div/>').addClass('col s4').starRating({initialRating: ratings.stars, readOnly: true, starSize: 12}).appendTo(rowRestaurantRatings);
    $('<div/>').addClass('col s8').text(ratings.comment).appendTo(rowRestaurantRatings);

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
        $('li').last().find('.restaurantAvgRating').starRating({ // Ajout de la note moyenne à ce restaurant
            initialRating: avgRatings,
            readOnly: true,
            starSize: 20
        });
    });
});

