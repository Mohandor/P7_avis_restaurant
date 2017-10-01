var markers = new Array();

// Fonction qui permet d'ajouter un marker avec la lat(a), la long(b), un label(c) et le nom du restaurant(d)
function addMarker(a,b,c, d, e){
    var markerPosition = {lat: a, lng: b};
    var marker = new google.maps.Marker({
        position: markerPosition,
        label: c,
        title: d,
        map: map
    });
    markers.push(marker);
    marker.addListener('click', function(){
    $('.collapsible').collapsible('open', e);
});
}

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