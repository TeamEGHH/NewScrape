var $loading = $('#loadingDiv').hide();

$(document)
    .ajaxStart(function() {
        $loading.show();
    })
    .ajaxStop(function() {
        $loading.hide();
    });

var wall = new freewall("#freewall");
var skip = false;
wall.reset({
    selector: '.brick',
    animate: true,
    cellW: 350,
    cellH: 'auto',
    onResize: function() {
        wall.fitWidth();
    }
});

    /*
     * Fetch data from mongodb and append the data
     * to index.html
     */
function fetch_and_display() {
    if (!skip) {
        $.get("/loadnews/0", function(data) {
            var json = $.parseJSON(data);
            success: writeHTML(json);
            skip = true;
        });
    } else {
        $.get("/loadnews/20", function(data) {
            var json = $.parseJSON(data);
            success: writeHTML(json);
        });
    }
}

    /*
     * Helper function for fetch_and_display:
     * Writes data to html using Handlebars.js
     */
function writeHTML(data) {
    //Edit time format
    for (var i = 0; i < data.length; i++) {
        data[i].time = moment(data[i].time).fromNow();
    }
    var source = $("#row_template").html();
    var template = Handlebars.compile(source);
    $.each(data, function(index, item) {
        wall.appendBlock(template(item));
        wall.fitWidth();
    });
}

    /*
     * Stuff to do when ajax is request is complete
     */
$(document).ajaxComplete(function() {

    wall.container.find('.brick img').load(function() {
        wall.fitWidth();
    });

    //This is done to avoid prevoius odd behaviour of the medium-and-time class
    //positioning. So we add the position after everything has been loaded.
    $('.medium-and-time').addClass('medium-and-time-pos');

    $(window).trigger('resize');
});

$(document).ready(function() {

    /*
     * Listens for desired events
     */

    $(window).scroll(function() {
        //Load more data if we hit the bottom of the page
        if ($(window).scrollTop() == $(document).height() - $(window).height()) {
            fetch_and_display();
        }
    });

    /*
     * Main function to keep track of function calling
     */
    function main() {
        fetch_and_display();
    }

    //Kick things off
    main();
});

$(window).trigger('resize');

