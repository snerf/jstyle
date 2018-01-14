$.fn.slider = function() {
	var $this = $(this),
    	slider = $this.find('.slider'),
		html = slider.html(),
		w = parseInt(slider.width()),
		arr_left = $this.find('span.arr-left'),
		arr_right = $this.find('span.arr-right');
		
		slider.html(html+html+html);
		slider.css('margin-left', -w);
		
		arr_left.click(function() {
			slideF(1);	
		});
		arr_right.click(function() {
			slideF(-1);
		});
		function slideF(n) {
			if (slider.is(':animated')) return false;
			if (parseInt(slider.css('margin-left')) == 0 || parseInt(slider.css('margin-left')) <= parseInt(slider.width()/3*2*(-1))) {
				slider.css('margin-left', -w);	
			}
			slider.animate({
				'margin-left' : parseInt(slider.css('margin-left')) + 153*n
			}, 500);
		}
}
$(document).ready(function() {
	$('.wrap-slider').each(function() {
		$(this).slider();
	});	
});