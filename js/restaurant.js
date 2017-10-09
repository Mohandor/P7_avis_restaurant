// Fonction permettant l'ajout d'un restaurant dans une <li>
function addRestaurant(thatRestau, nbMarker){
    var li = $('<li/>').addClass('row').attr('tabindex', -1).appendTo($("ul")); // Création d'une li qui va dans l'ul

    // Création de la div collapsible-header avec les informations du restaurant
    var liHeader = $('<div/>').addClass('collapsible-header').appendTo(li);
    var leftCol = $('<div/>').addClass('col s8').appendTo(liHeader);
    var leftRow = $('<div/>').addClass('row').appendTo(leftCol);
    $('<div/>').addClass('col s1').text(nbMarker).appendTo(leftRow);
    $('<div/>').addClass('col s10').text(thatRestau.restaurantName).appendTo(leftRow);
    $('<div/>').addClass('col s12').text(thatRestau.address).appendTo(leftRow);
    $('<div/>').addClass('col s12 restaurantAvgRating').appendTo(leftRow);
    var newRating = $('<div/>').addClass('col s12 newRating').appendTo(leftRow);
    var btnNewRating = $('<a/>').addClass('waves-effect waves-light btn btnNewRating modal-trigger').attr('href', '#modal1').appendTo(newRating);
    $('<i/>').addClass('material-icons').text('add').appendTo(btnNewRating);


    // Ajout de l'image google street aux coordonnées qui va dans l'header
    var restaurantLocation = "location="+thatRestau.lat+","+thatRestau.long;
    var rightCol = $('<div/>').addClass('col s4 valign-wrapper').appendTo(liHeader);
    $('<img>').addClass('streetview').attr('src', '//maps.googleapis.com/maps/api/streetview?size=400x400&key=AIzaSyB48K7MnLGjHOLRg8YlZVgGg2kIj2zNrXU&'+restaurantLocation).appendTo(rightCol);
   
    // Ajout du body de notre collapsible pour les notes
    var liBody = $('<div/>').addClass('col s12').addClass('collapsible-body').appendTo(li);
    $('<div/>').addClass('row restaurantRatings').appendTo(liBody);


}

// Fonction permettant l'ajout des avis avec un objet ratings et un identifiant(nbMarker)
function addRestaurantRatings(ratings, nthChildLi){
    var rowRestaurantRatings = $('li:nth-child('+nthChildLi+')').find('.restaurantRatings');
    var colRestaurantRatings = $('<div>').addClass('col s12 colRestaurantRatings').appendTo(rowRestaurantRatings);
    $('<span/>').addClass('ratingsRestaurant').starRating({initialRating: ratings.stars, readOnly: true, starSize: 12}).appendTo(colRestaurantRatings);
    $('<span/>').addClass('commentsRestaurant').text(ratings.comment).appendTo(colRestaurantRatings);
}

// Fonction permettant de créer un nouvel objet restaurant
function createNewRestaurant(restaurantName, address, lat, long) {
   this.restaurantName = restaurantName;
   this.address = address;
   this.lat = lat;
   this.long = long;
}

// Fonction permettant de créer un nouvel objet rating
function createNewRating(stars, comment){
    this.stars = stars;
    this.comment = comment;
}

function addnewRestaurantRatings(liIndex){
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
}