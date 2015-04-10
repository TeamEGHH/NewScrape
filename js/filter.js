var filterArray = [];
$( ".filter-medium" ).click(function() {
	$(this).toggleClass('clicked');
	checkFilters();
});

function checkFilters(){
	var filterArray = [1];
	$('.clicked').each(function(){
		var filterId = $(this).attr('id').split('-')[1];
		filterArray.push(filterId);
	});
	$.get("/filterArray/" + filterArray, function(data) {
    });
	console.log(filterArray);
}