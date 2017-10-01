var starSelect = {
	// Fonction créant l'outil permettant le tri des restaurants en fonctions des notes
	init: function(){
		var starSelectRow = $('<div/>').addClass('row').appendTo($('#starSelection')); // Création d'une row en haut de notre colonne de gauche
		$('<div/>').addClass('col s12 center-align').text('Ne montrer que les restaurants compris dans cette fourchette').appendTo(starSelectRow);
		// Création d'une div avec un starRating pour la note minime qui est de base à 0 et ne peut jamais être supérieur à la note max
		$('<div/>').addClass('col s6 center-align').attr('id', 'starMin').starRating({
			initialRating: 0,
			starSize: 20, 
			disableAfterRate: false,
			callback: function(currentRating, $el){
				if(currentRating > Number($('#starMax').starRating('getRating'))){
					$('#starMax').starRating('setRating', currentRating);
				}
			}
		}).appendTo(starSelectRow);
		// Création d'une div avec un starRating pour la note maximale qui est de base à 5 et ne peut jamais être inférieur à la note min
		$('<div/>').addClass('col s6 center-align').attr('id', 'starMax').starRating({
			initialRating: 5,
			starSize: 20,
			disableAfterRate: false,
			callback: function(currentRating, $el){
				if(currentRating < Number($('#starMin').starRating('getRating'))){
					$('#starMin').starRating('setRating', currentRating);
				}
			}
		}).appendTo(starSelectRow);
		// Ajout du bouton pour effectuer le tri
		$('<a/>').addClass('waves-effect waves-light btn center').attr('id', "btnStarSelect").text('Classer').appendTo(starSelectRow);
		$('<i/>').addClass('material-icons right').text('restaurant').appendTo($('#btnStarSelect'));

		// Fonction de l'event quand on clique sur le bouton
		$('#btnStarSelect').on('click', function(){
			var minStar = Number($('#starMin').starRating('getRating')); // Note minimale
			var maxStar = Number($('#starMax').starRating('getRating')); // Note maximale
			// On ajoute une classe 'hide' au restaurant si il n'est pas dans la fourchette et on l'enlève si il est dedans et qu'il l'a
			$('li').each(function(index){
				var thatStartRating =Number($(this).find('.restaurantAvgRating').starRating('getRating'));
				if ((thatStartRating<minStar || thatStartRating>maxStar)){
					$(this).addClass('hide');
					markers[index].setVisible(false);
				} else{
					if($(this).hasClass('hide') && map.getBounds().contains(markers[index].getPosition())){
						$(this).removeClass('hide');
						markers[index].setVisible(true);
					};
				}
			});
		});
	}
}