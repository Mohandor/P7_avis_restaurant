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

function addRestaurant(ceRestau, nbMarker){
    $('<li/>').addClass('row').attr('id', "restaurant"+nbMarker).appendTo($("#restaurantInfoCol"));

    $('<div/>').addClass('collapsible-header').attr('id', 'infoRestaurantHeader'+nbMarker).appendTo($("#"+"restaurant"+nbMarker));
    $('<div/>').addClass('col s8').attr('id', "infoRestaurant"+nbMarker).appendTo($("#infoRestaurantHeader"+nbMarker));
    $('<div/>').addClass('row').attr('id',"infoRestaurant"+nbMarker+"Col").appendTo($("#infoRestaurant"+nbMarker));
    $('<div/>').addClass('col s1').text(nbMarker).appendTo($("#"+"infoRestaurant"+nbMarker+"Col"));
    $('<div/>').addClass('col s10').text(ceRestau.restaurantName).appendTo($("#infoRestaurant"+nbMarker+"Col"));
    $('<div/>').addClass('col s12').text(ceRestau.address).appendTo($("#infoRestaurant"+nbMarker+"Col"));
    $('<div/>').addClass('col s12').attr('id','ratingsRestaurant'+nbMarker).appendTo($("#infoRestaurant"+nbMarker+"Col"));


    var restaurantLocation = "location="+ceRestau.lat+","+ceRestau.long;
    $('<div/>').addClass('col s4').attr('id', 'streetviewRestaurant'+nbMarker).appendTo($("#infoRestaurantHeader"+nbMarker));
    $('<img>').addClass('col s12').attr('src', '//maps.googleapis.com/maps/api/streetview?size=400x400&key=AIzaSyB48K7MnLGjHOLRg8YlZVgGg2kIj2zNrXU&'+restaurantLocation).appendTo($("#"+"streetviewRestaurant"+nbMarker));
   
    $('<div/>').addClass('col s12').addClass('collapsible-body').attr('id', "restaurant"+nbMarker+"Ratings").appendTo($("#restaurant"+nbMarker));
    $('<div/>').addClass('row').attr('id', "restaurant"+nbMarker+"RatingsRow").appendTo($("#restaurant"+nbMarker+"Ratings"));

}

function addRestaurantRatings(ratings, nbMarker){
    $('<div/>').addClass('col s3').text(ratings.stars).appendTo($('#restaurant'+nbMarker+'RatingsRow'));
    $('<div/>').addClass('col s9').text(ratings.comment).appendTo($('#restaurant'+nbMarker+'RatingsRow'));

}


$.getJSON('data/test.json', function(data){ 
    $.each(data, function(index){ 
        var nbMarker = (index+1).toString();
        addMarker(this.lat, this.long, nbMarker, this.restaurantName);
        addRestaurant(this, nbMarker);
        var sumRatings = 0;
        $.each(this.ratings, function(){
            addRestaurantRatings(this, nbMarker);
            sumRatings = this.stars + sumRatings;
        });
        var avgRatings = sumRatings/this.ratings.length;
        $('#ratingsRestaurant'+nbMarker).rateYo({rating: avgRatings});
    });
});

