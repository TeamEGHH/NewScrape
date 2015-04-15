$( ".filter-medium, .filter-tag" ).click(function() {
	$(this).toggleClass('clicked');
});

function checkFilters(){
	var filterArray = [1]; //ugly hack
	var subFilterArray = [1]; //ugly hack
	$('.clicked').each(function(){
		var id = $(this).attr('id').split('-')[1];
		if (id == 'sub') {
			var subfilterId = $(this).attr('id').split('-')[2];
			subFilterArray.push(subfilterId.toLowerCase());
		}
		else{
			var filterId = id;
			filterArray.push(filterId);
		}
		//var filterId = $(this).attr('id').split('-')[1];
		//var index = filterArray.indexOf(filterId);	
	});
	//alert(subfilterArray);
	$.get("/filterArray/" + filterArray + ";" + subFilterArray);
	console.log(filterArray);
	document.cookie = "mainfilter=" + filterArray;
	document.cookie = "subfilter=" + subFilterArray;
}

$( ".filter-save" ).click(function() {
	checkFilters();
	location.reload();
});

