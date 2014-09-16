jQuery(document).ready(function( $ ) {
	
	// Campaign Monitor Ajax Submission
	$('.sign-up-form form').submit(function (e) {
	e.preventDefault();
	$.getJSON(
		this.action + "?callback=?",
		$(this).serialize(),
		function (data) {
			if (data.Status === 400) {
					alert("Error: " + data.Message);
				} else {
					$('.sign-up-form form').remove();
					$('.sign-up-form').html('<p class="success-message"><em>Thanks!</em> We&rsquo;ve received your request. When you are granted access, you&rsquo;ll receive an email with your login information.</p>');
				}
        });
	});
	
});