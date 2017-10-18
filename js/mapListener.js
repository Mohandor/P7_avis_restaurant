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

// Fonction permettant d'ajouter des restaurants en cliquant sur la carte
map.addListener('click', function(event){
    // On unbind le submit et on le relance pour éviter qu'il ajoute plusieurs restaurants après plusieurs clicks et un seul ajout.
    $('#formRestaurant').unbind('submit').submit();
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
            starSize: starRestaurantsSize
        });

    });
});

// A chaque event 'dragend' on prend la position et on ajoute les restaurants alentours
map.addListener('dragend', function(){
    position = map.getCenter();
    addRestaurantNearby(position);
});

// Fonction pour ajouter les restaurants alentours
function addRestaurantNearby(position){
    var request = {
        location: position,
        radius:'1000',
        types: ['restaurant'],
    };
    function callback(results, status){
        if(status == google.maps.places.PlacesServiceStatus.OK){ // Si ça fonctionne
            $.each(results,function(){ // Pour chaque résultat
                var placeID = {placeId: this.place_id}; // On définit le place_id
                service.getDetails(placeID, function(results, status){ // On fait un getDetails pour avoir plus d'information
                    if (status == google.maps.places.PlacesServiceStatus.OK){ // Si ça fonctionne
                        var position = results.geometry.location; // On définit les coordonnées du restaurant
                        // On ne créait le restaurant que si il n'y a pas déjà de marker à cette position
                        var doesItExist = false;
                        $.each(markers, function(index){
                            if(this.getPosition().equals(position)){
                                doesItExist = true;
                            }
                            // Si après avoir vérifier chaque marker et qu'il n'y en a pas déjà un à cet endroit on ajoute le restaurant
                            if(((index+1) === markers.length) && (doesItExist === false)){
                                addRestaurantWithSearch(position, results)
                            }
                        });
                    }
                });
            });
        }
    };
    service.nearbySearch(request, callback);
}