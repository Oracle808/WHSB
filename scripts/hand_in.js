var Files = require("./files");

$(document).ready(function() {
    var novaSlotForm = $("#newSlotForm");

    $("#hand_in_slots .add-item").on("click", function(e) {
	novaSlotForm.stop();
	novaSlotForm.slideToggle();
	e.preventDefault();
    });

    $("#hand_in_slots .submit-file").on("click", function(e) {
	// Set up progress bar
	var progressBar = $(this).prev().show().find(".meter").css("width", "0%");
	Files.openFile((function(file) {
	    $(this).attr("disabled", true); // Disable button
	    var data = new FormData();
	    data.append("files[]", file);
	    $.ajax({
		url: $(this).val(),
		type: "POST",
		contentType: false,
		processData: false,
		data: data,
		uploadProgress: (function(e, position, total, percentComplete) {
		    console.log(percentComplete);
		    progressBar.css("width", percentComplete + "%");
		}).bind(this)
	    });
	}).bind(this));
	e.preventDefault();
    });
});
