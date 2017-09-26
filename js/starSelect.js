var starSelect = {
	init: function(){
		$('<div/>').addClass('row').attr('id', 'starSelectRow').appendTo($('#starSelection'));
		$('<div/>').addClass('col s12 center-align').text('Ne montrer que les restaurants compris dans cette fourchette').appendTo($('#starSelectRow'));
		$('<div/>').addClass('col s6').attr('id', 'starMin').starRating({
			initialRating: 0,
			starSize: 20, 
			disableAfterRate: false,
			callback: function(currentRating, $el){
				if(currentRating > Number($('#starMax').starRating('getRating'))){
					$('#starMax').starRating('setRating', currentRating);
				}
			}
		}).appendTo($('#starSelectRow'));
		$('<div/>').addClass('col s6').attr('id', 'starMax').starRating({
			initialRating: 5,
			starSize: 20,
			disableAfterRate: false,
			callback: function(currentRating, $el){
				if(currentRating < Number($('#starMin').starRating('getRating'))){
					$('#starMin').starRating('setRating', currentRating);
				}
			}
		}).appendTo($('#starSelectRow'));
		$('<a/>').addClass('waves-effect waves-light btn center').attr('id', "btnStarSelect").text('Classer').appendTo($('#starSelectRow'));
		$('<i/>').addClass('material-icons right').text('restaurant').appendTo($('#btnStarSelect'));

		$('#btnStarSelect').on('click', function(){
			var minStar = Number($('#starMin').starRating('getRating'));
			var maxStar = Number($('#starMax').starRating('getRating'));
			$('li').each(function(index){
				var nbMarker = (index+1).toString();
				var thatStartRating =Number($('#ratingsRestaurant'+nbMarker).starRating('getRating'));
				if (thatStartRating<minStar || thatStartRating>maxStar){
					$(this).addClass('hide');
				} else{
					$(this).removeClass('hide');
				}
			});
		});
	}
}

starSelect.init();