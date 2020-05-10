(function ($) {

	$(document).ready(function(){

		//hide navbar
		$(".navscroll").hide();
		//fade in navbar
		$(function () {
			$(window).scroll(function () {
				if ($(this).scrollTop() > 100) {
					$('.navscroll').fadeIn();
					$('.jumbo').prop( "disabled", true );
				} else {
					$('.navscroll').fadeOut();
					$('.jumbo').prop( "disabled", false );
				}
			});
		});

	});

}(jQuery));