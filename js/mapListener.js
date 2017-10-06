// Fonction permettant de retirers les restaurants de la liste et marker de la carte si ils ne sont pas sur la map affichée et vis versa
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

map.addListener('click', function(event){
    var markerPosition = event.latLng; // La position du click
    $('#modal2').modal('open'); // On ouvre le modal d'ajout de restaurant

    // Geocodage pour récupérer l'adresse de l'endroit où l'on a cliqué
    geocoder.geocode({'location': markerPosition}, function(results, status) {
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
        var lat = markerPosition.lat(); // Lat du click
        var long = markerPosition.lng(); // Lng du click
        // On créait un nouvel objet restaurant avec les données obtenues
        var newRestaurant = new createNewRestaurant(restaurantName, address, lat, long);
        console.log(newRestaurant);
        var liLength = $('li').length; // Longueur des balises <li>
        addRestaurant(newRestaurant, (liLength+1)); // On ajoute le restaurant
        addMarker(markerPosition, (liLength+1).toString(), restaurantName, liLength); // On ajoute le marker du restaurant
        $('li').last().find('.restaurantAvgRating').starRating({ // Ajout de la note moyenne à ce restaurant
            initialRating: 0,
            readOnly: true,
            starSize: 20
        });
        // On remet les valeurs du modal à 0
        $('#newRestaurantName').val(''); 
        $('#newRestaurantAddress').val('');
    });
});