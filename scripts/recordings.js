$(document).ready(function() {
    var novaRecording = $("#new-recording");

    $("#recordings .add-item").on("click", function(e) {
	novaRecording.stop();
	novaRecording.slideToggle();
	e.preventDefault();
    });
});
