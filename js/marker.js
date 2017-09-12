function addMarker(a,b,c, d){
    var markerPosition = {lat: a, lng: b};
    var marker = new google.maps.Marker({
        position: markerPosition,
        label: c,
        title: d,
        map: map
    });
}

function addRestaurant(ceRestau, nbMarker){
    var restaurantLocation = "location="+ceRestau.lat+","+ceRestau.long;
    $('<div/>').addClass('row').addClass('section').attr('id', "restaurant"+nbMarker).appendTo($("#restaurantInfoCol"));
    $('<div/>').addClass('col s1').text(nbMarker).appendTo($("#"+"restaurant"+nbMarker));
    $('<div/>').addClass('col s11').text(ceRestau.restaurantName).appendTo($("#"+"restaurant"+nbMarker));
    $('<div/>').addClass('col s12').text(ceRestau.address).appendTo($("#"+"restaurant"+nbMarker));
    $('<img>').addClass('col s12').attr('src', '//maps.googleapis.com/maps/api/streetview?size=400x400&key=AIzaSyB48K7MnLGjHOLRg8YlZVgGg2kIj2zNrXU&'+restaurantLocation).appendTo($("#"+"restaurant"+nbMarker));
}


$.getJSON('data/test.json', function(data){ 
/*    $.each(data, function(idx, obj){ 
        $.each(obj, function(key, value){
            console.log(key + ": " + value);
        });
    });*/
    var nbRestaurants = data.length;

    for (i=0; i<nbRestaurants; i++){
        var ceRestau = eval("data["+i+"]");
        var nbMarker = (i+1).toString();
        addMarker(ceRestau.lat, ceRestau.long, nbMarker, ceRestau.restaurantName);
        addRestaurant(ceRestau, nbMarker);
    }
});

