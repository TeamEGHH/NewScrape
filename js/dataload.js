$(document).ready(function() {

    //Á eftir að gera kall á þetta til að loada fleiri fréttum þegar það er scrollað
    $.get("/loadnews", function(data) {
        var json = $.parseJSON(data);
        displayData(json).done(function() {
            $("div.blog-post").hover(
                function() {
                    $(this).find("div.content-hide").slideToggle("fast");
                },
                function() {
                    $(this).find("div.content-hide").slideToggle("fast");
                }
            );
        });
    });

    function displayData(data) {
        var source = $("#row_template").html();
        var template = Handlebars.compile(source);
        $(".article-display").append(template(data));
        return $.ajax();
    }
});
