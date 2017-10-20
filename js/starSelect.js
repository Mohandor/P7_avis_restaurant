var starSelect = {
	// Fonction créant l'outil permettant le tri des restaurants en fonctions des notes
	init: function(){
		var starSelectRow = $('<div/>').addClass('row').appendTo($('#starSelection')); // Création d'une row en haut de notre colonne de gauche
		$('<div/>').addClass('col s12 center-align').text(textSelect).appendTo(starSelectRow);
		// Création d'une div avec un starRating pour la note minime qui est de base à 0 et ne puisse jamais être supérieur à la note max
		$('<div/>').addClass('col s12 m6 center-align').attr('id', 'starMin').starRating({
			initialRating: 0,
			starSize: starSelectSize, 
			disableAfterRate: false,
			callback: function(currentRating, $el){
				if(currentRating > Number($('#starMax').starRating('getRating'))){
					$('#starMax').starRating('setRating', currentRating);
				}
			}
		}).appendTo(starSelectRow);
		// Création d'une div avec un starRating pour la note maximale qui est de base à 5 et ne puisse jamais être inférieur à la note min
		$('<div/>').addClass('col s12 m6 center-align').attr('id', 'starMax').starRating({
			initialRating: 5,
			starSize: starSelectSize,
			disableAfterRate: false,
			callback: function(currentRating, $el){
				if(currentRating < Number($('#starMin').starRating('getRating'))){
					$('#starMin').starRating('setRating', currentRating);
				}
			}
		}).appendTo(starSelectRow);
		// Ajout du bouton pour effectuer le tri
		var divBtnStarSelect = $('<div/>').addClass('col s12 center-align divBtnStarSelect').appendTo(starSelectRow);
		$('<a/>').addClass('waves-effect waves-light btn').attr('id', "btnStarSelect").text(textBtnSelect).appendTo(divBtnStarSelect);
		$('<i/>').addClass('material-icons right').text('restaurant').appendTo($('#btnStarSelect'));

		// Fonction de l'event quand on clique sur le bouton
		$('#btnStarSelect').on('click', function(){
			var minStar = Number($('#starMin').starRating('getRating')); // Note minimale
			var maxStar = Number($('#starMax').starRating('getRating')); // Note maximale
			$('li').each(function(index){ // Pour chaque restauant (<li>)
				var thatStartRating =Number($(this).find('.restaurantAvgRating').starRating('getRating'));
				if ((thatStartRating<minStar || thatStartRating>maxStar)){ // Si le restaurant est en dehors de la fourchette
					$(this).addClass('hide'); // On ajoute une classe .hide
					markers[index].setVisible(false); // On fait met le marker en setVisible(false)
				} else{
					// Si la <li> a une classe .hide est que le marker est sur la map on enlève la classe et on le met en visible true
					if($(this).hasClass('hide') && map.getBounds().contains(markers[index].getPosition())){
						$(this).removeClass('hide');
						markers[index].setVisible(true);
					// SI la <li> a une classe .hide mais que le marker n'est pas sur la map on met juste le marker en visible true
					}else if($(this).hasClass('hide')){
						markers[index].setVisible(true);
					};
				}
			});
		});
	}
}