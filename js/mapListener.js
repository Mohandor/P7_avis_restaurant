// Fonction permettant de retirer les restaurants de la liste si les markers n'y sont pas et inverssement
map.addListener('bounds_changed', function(){ // Quand les limites de la map change
    $.each(markers, function (index, marker){ // Pour chaque markers
        if(map.getBounds().contains(marker.getPosition()) && marker.getVisible()){ // Si le marker est sur la map et qu'il est visible
            marker.getVisible(true);
            $('li:nth-child('+(index+1)+')').removeClass('hide');
        } else { // Sinon
            marker.getVisible(false);
            $('li:nth-child('+(index+1)+')').addClass('hide');
        }
    });  
});

// 
map.addListener('click', function(event){
    // On remet les valeurs du modal à 0
    $('#newRestaurantName').val(''); 
    $('#newRestaurantAddress').val('');
    var clickPosition = event.latLng; // La position du click
    $('#modal2').modal('open'); // On ouvre le modal d'ajout de restaurant

    // Geocodage pour récupérer l'adresse de l'endroit où l'on a cliqué et la mettre dans l'input du modal
    geocoder.geocode({'location': clickPosition}, function(results, status) {
        if (status === 'OK') {
            if (results[0]) {               
                $('#newRestaurantAddress').val(results[0].formatted_address);
        } else {
            window.alert('No results found');
        }
    } else {
        window.alert('Geocoder failed due to: ' + status);
        }
    });

    // Action quand on submit le modal
    $('#formRestaurant').submit(function(){
        $('#modal2').modal('close'); // On ferme le modal
        var restaurantName = $('#newRestaurantName').val(); // On prend la val de l'input
        var address = $('#newRestaurantAddress').val(); // On prend la val de l'input
        var lat = clickPosition.lat(); // Lat du click
        var long = clickPosition.lng(); // Lng du click
        // On créait un nouvel objet restaurant avec les données obtenues
        var newRestaurant = new createNewRestaurant(restaurantName, address, lat, long);
        console.log(newRestaurant);
        var liLength = $('li').length; // Longueur des balises <li>
        addRestaurant(newRestaurant, (liLength+1)); // On ajoute le restaurant
        addMarker(clickPosition, (liLength+1).toString(), restaurantName, liLength); // On ajoute le marker du restaurant
        $('li').last().find('.restaurantAvgRating').starRating({ // Ajout de la note moyenne à ce restaurant
            initialRating: 0,
            readOnly: true,
            starSize: 20
        });

    });
});

// Fonction pour ajouter les restaurants alentours
function addRestaurantNearby(){
    mapCenterPosition = map.getCenter();
    var request = {
        location: mapCenterPosition,
        radius:'1000',
        types: ['restaurant'],
        //rankBy: google.maps.places.RankBy.DISTANCE
    };
    function callback(results, status){
        if(status == google.maps.places.PlacesServiceStatus.OK){
            $.each(results,function(){
                var placeID = {placeId: this.place_id};
                service.getDetails(placeID, function(results, status){
                    if (status == google.maps.places.PlacesServiceStatus.OK){
                        var ratings = [];
                        var restaurantName = results.name;
                        var address = (results.formatted_address).slice(0, -8);
                        var lat = results.geometry.location.lat();
                        var lont = results.geometry.location.lng();
                        var location = results.geometry.location;
                        var liIndex = $('li').length;
                        var nbMarker = (liIndex+1).toString();
                        var restaurant = new createNewRestaurant(restaurantName, address, lat, lont);
                        addMarker(location, nbMarker, restaurantName, liIndex);
                        addRestaurant(restaurant, nbMarker);
                        var sumRatings = 0;
                        $.each(results.reviews, function(){
                            var stars = this.rating;
                            var comment = this.text;
                            sumRatings = sumRatings + stars ;
                            var rating = new createNewRating(stars, comment);
                            addRestaurantRatings(rating, nbMarker);
                            ratings.push(rating);
                        });
                        var avgRatings = Math.round(2*sumRatings/ratings.length)/2;
                        $('li').last().find('.restaurantAvgRating').starRating({ // Ajout de la note moyenne à ce restaurant
                            initialRating: avgRatings,
                            readOnly: true,
                            starSize: 20
                        });
                    }
                });
            });
        }
    }
    service.nearbySearch(request, callback);
}

addRestaurantNearby();
