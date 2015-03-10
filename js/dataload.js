$(document).ready(function () {
    $.get("/loadnews", function (data) {
        var json = $.parseJSON(data);
        displayData(json);
    });

    function displayData(data) {
        var source = $("#row_template").html();
        var template = Handlebars.compile(source);
        $(".okkar").append(template(data));
    }
});
