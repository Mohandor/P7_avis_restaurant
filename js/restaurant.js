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
    $('<div/>').addClass('col s4').starRating({initialRating: ratings.stars, readOnly: true, starSize: 12}).appendTo(rowRestaurantRatings);
    $('<div/>').addClass('col s8').text(ratings.comment).appendTo(rowRestaurantRatings);
}

function createNewRestaurant(restaurantName, adress, lat, long) {
   this.restaurantName = restaurantName;
   this.adress = adress;
   this.lat = lat;
   this.long = long;
}

function createNewRating(stars, comment){
    this.stars = stars;
    this.comment = comment;
}

function addnewRestaurantRatings(){
    $('#modal1').modal('close');
    var stars = Number($('#starsForm').starRating('getRating'));
    var comment = $('#newRatingForm').val();
    var rating = new createNewRating(stars, comment);
    console.log(rating);
    console.log(liIndex);
    addRestaurantRatings(rating, (liIndex+1));
    $('#starsForm').starRating('setRating', 0);
    $('#newRatingForm').val('');
}