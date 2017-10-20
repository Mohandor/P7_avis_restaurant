// Fonction permettant l'ajout d'un restaurant dans une <li>
function addRestaurant(thatRestau, nbMarker){
    var li = $('<li/>').addClass('row').attr('tabindex', -1).appendTo($("ul")); // Création d'une li qui va dans l'ul

    // Création de la div collapsible-header avec les informations du restaurant
    var liHeader = $('<div/>').addClass('collapsible-header').appendTo(li);
    var leftCol = $('<div/>').addClass('col m8 s12').appendTo(liHeader);
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
    var rightCol = $('<div/>').addClass('col m4 valign-wrapper hide-on-small-only').appendTo(liHeader);
    $('<img>').addClass('streetview').attr('src', '//maps.googleapis.com/maps/api/streetview?size=400x400&key=AIzaSyB48K7MnLGjHOLRg8YlZVgGg2kIj2zNrXU&'+restaurantLocation).appendTo(rightCol);
   
    // Ajout du body de notre collapsible pour les notes
    var liBody = $('<div/>').addClass('col s12').addClass('collapsible-body').appendTo(li);
    $('<div/>').addClass('row restaurantRatings').appendTo(liBody);


}

// Fonction permettant l'ajout des avis avec un objet ratings et un identifiant(nbMarker)
function addRestaurantRatings(ratings, nthChildLi){
    var rowRestaurantRatings = $('li:nth-child('+nthChildLi+')').find('.restaurantRatings');
    var colRestaurantRatings = $('<div>').addClass('col s12 colRestaurantRatings').appendTo(rowRestaurantRatings);
    $('<div/>').addClass('ratingsRestaurant').starRating({initialRating: ratings.stars, readOnly: true, starSize: starRatingsSize}).appendTo(colRestaurantRatings);
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
    $('li:nth-child('+(liIndex+1)+')').find('.ratingsRestaurant').each(function(){
        sumRatings = sumRatings + Number($(this).starRating('getRating'));
    })
    // On arrondi à 0.5 car le plugin ne supporte que des entiers et demis et on met à jours la note moyenne du restaurant
    var avgRatings = Math.round(2*(sumRatings / $('li:nth-child('+(liIndex+1)+')').find('.ratingsRestaurant').length))/2;
    $('li:nth-child('+(liIndex+1)+')').find('.restaurantAvgRating').starRating('setRating', avgRatings);

    // On vérifie que le restaurant soit dans la fourchette de recherche et on le cache si ce n'est plus le cas
    var minStar = Number($('#starMin').starRating('getRating')); // Note minimale
    var maxStar = Number($('#starMax').starRating('getRating')); // Note maximale
    if ((avgRatings<minStar || avgRatings>maxStar)){ // Si le restaurant est en dehors de la fourchette
        $('li:nth-child('+(liIndex+1)+')').addClass('hide'); // On ajoute une classe .hide
        markers[liIndex].setVisible(false); // On fait met le marker en setVisible(false)
    }
}

// Fonction permettant l'ajout des restaurants avec la recherche de google Places
function addRestaurantWithSearch(position, results){
    var ratings = []; // on créait un tableau ratings
    var restaurantName = results.name; // Le nom
    var address = (results.formatted_address).slice(0, -8); // L'adresse minus le ", France"
    var lat = results.geometry.location.lat(); // La lat 
    var lont = results.geometry.location.lng(); // la long
    var liIndex = $('li').length; // L'index de la li qu'on va créer
    var nbMarker = (liIndex+1).toString(); // Le numéro du marker 
    var restaurant = new createNewRestaurant(restaurantName, address, lat, lont); // On créait l'objet restaurant
    addMarker(position, nbMarker, restaurantName, liIndex); // On ajoute le marker
    addRestaurant(restaurant, nbMarker); // On ajoute le restaurant
    // Si il y a des avis on les ajoutes au restaurant et on calcule la note moyenne qu'on affiche
    if ($.type(results.reviews) === "array"){
        var sumRatings = 0;
        $.each(results.reviews, function(){
            var stars = this.rating;
            var comment = this.text;
            sumRatings = sumRatings + stars;
            var rating = new createNewRating(stars, comment);
            addRestaurantRatings(rating, nbMarker);
            ratings.push(rating);
        });
        var avgRatings = Math.round(2*sumRatings/ratings.length)/2;
        $('li').last().find('.restaurantAvgRating').starRating({ // Ajout de la note moyenne à ce restaurant
            initialRating: avgRatings,
            readOnly: true,
            starSize: starRestaurantsSize
        });        
    } else { // Sinon on initie le plugin avec un initialRating à 0
        $('li').last().find('.restaurantAvgRating').starRating({ 
            initialRating: 0,
            readOnly: true,
            starSize: starRestaurantsSize
        });        
    }
    // Si le restaurant n'est pas dans la fourchette de la recherche on le cache
    var minStar = Number($('#starMin').starRating('getRating')); // Note minimale
    var maxStar = Number($('#starMax').starRating('getRating')); // Note maximale
    var thatStartRating =Number( $('li').last().find('.restaurantAvgRating').starRating('getRating'));
    if ((thatStartRating<minStar || thatStartRating>maxStar)){ // Si le restaurant est en dehors de la fourchette
        $('li').last().addClass('hide'); // On ajoute une classe .hide
        markers[liIndex].setVisible(false); // On fait met le marker en setVisible(false)
    }
}