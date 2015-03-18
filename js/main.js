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

  $(function(){

  // Instantiate MixItUp:

  $('#Container').mixItUp();

  

  $(document).ready(function() {
      $(".fancybox").fancybox();
>>>>>>> 9582e60adbdc3f2e97e60c1fb3b235b3fe5f3574
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
