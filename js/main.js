/*
 * Global variables. Marked with _g wich indicates that it
 * is a global variable.
 */
var g_menu, g_menu_pos, g_image_header;

$(document).ready(function() {
    /*
     * Fetch data from mongodb and append the data
     * to index.html
     */
    function fetch_and_display() {
        $.get("/loadnews", function(data) {
            var json = $.parseJSON(data);
            start:
                success:
                writeHTML(json).done(function() {

                    htmlEffects(json);
                });
        });
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
        $("#freewall").append(template(data));
        return $.ajax();
    }

    /*
     * Helper function for fetch_and_display:
     * jQuery effects, ran after all the html data
     * has been loaded.
     */
    function htmlEffects(data) {
        g_menu = $('#header'); //The header div
        g_menu_pos = g_menu.offset(); //The position of the header div
        g_image_header = $('.image-header');

        g_wall.container.find('.brick img').load(function() {
            g_wall.fitWidth();
        });

        //This is done to avoid prevoius odd behaviour of the medium-and-time class
        //positioning. So we add the position after everything has been loaded.
        $('.medium-and-time').addClass('medium-and-time-pos');
    }

    /*
     * Listens for desired events
     */
    function listener() {
        //Listen for scroll
        $(window).scroll(function() {
            //Load more data if we hit the bottom of the page
            function dataLoad() {
                if ($(window).scrollTop() == $(document).height() - $(window).height()) {
                    fetch_and_display();
                }
            }

            //Make header fixed to top while scrolling
            function headerScroll() {
                if ($(this).scrollTop() >= g_menu_pos.top) {
                    g_menu.addClass('header-container', 2000, 'easeInBack');
                    g_image_header.addClass('image-header-scroll', 2000, 'easeInBack');
                } else if ($(this).scrollTop() <= g_menu_pos.top) {
                    g_menu.removeClass('header-container', 2000, 'easeInBack');
                    g_image_header.removeClass('image-header-scroll', 2000, "easeInBack");
                }
            }
            dataLoad();
            headerScroll();
        });

        $(window).resize(function() {
            g_menu = $('#header'); //The header div
            g_menu_pos = g_menu.offset(); //The position of the header div
            g_image_header = $('.image-header');
        });
    }

    /*
     * Main function to keep track of function calling
     */
    function main() {
        fetch_and_display();
        listener();
    }

    //Kick things off
    main();
});
