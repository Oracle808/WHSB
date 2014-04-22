var uu = require("underscore");

$(document).ready(function() {
    var newStudentForm = $("#add-student");

    $(".add-item").on("click", function(e) {
	newStudentForm.stop();
	newStudentForm.slideToggle();
	e.preventDefault();
    });

    $("#add-student-username").typeahead({},{
	source: function(query, cb) {
	    console.log(query);
	    $.ajax({
		method: "GET",
		url:"/users",
		data: {
		    role:"pupil",
		    startsWith:query
		},
		dataType: "json", // We want JSON data from the server
		success: function(data) {
		    cb(uu.pluck(data, "username"));
		},
		failure: function(err) {
		    console.log(err);
		}
	    });
	}
    });
});
