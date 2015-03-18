$(document).ready(function() {

    $('.flexslider').flexslider({
        prevText: '',
        nextText: ''
    });

    $('.testimonails-slider').flexslider({
        animation: 'slide',
        slideshowSpeed: 5000,
        prevText: '',
        nextText: '',
        controlNav: false
    });

    $(function() {
        // Instantiate MixItUp:
        $('#Container').mixItUp();

        $(document).ready(function() {
            $(".fancybox").fancybox();
        });
    });
});
