$(document).ready(function() {
    $("#links .add-item").on("click", function(e) {
	$("#new-link-form").stop();
	$("#new-link-form").slideToggle();
	e.preventDefault();
    });
});
