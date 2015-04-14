$( ".filter-medium, .filter-tag" ).click(function() {
	$(this).toggleClass('clicked');
	console.log("clicked");
});

function checkFilters(){
	var filterArray = [1]; //ugly hack
	$('.clicked').each(function(){
		var filterId = $(this).attr('id').split('-')[1];
		//var index = filterArray.indexOf(filterId);
		filterArray.push(filterId);
	});
	$.get("/filterArray/" + filterArray);
	console.log(filterArray);
	document.cookie = filterArray;
}

$( ".filter-save" ).click(function() {
	checkFilters();
	location.reload();
});

