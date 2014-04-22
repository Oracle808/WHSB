var EditorController = require("./editor");

$(document).ready(function() {
    var novaBlogPost = $("#new-blog-post");

    $("#add-blog-post").on("click", function(e) {
	novaBlogPost.stop();
	novaBlogPost.slideToggle();
	e.preventDefault();
    });

    EditorController.create({
	controls: $("#new-blog-post-text"),
	modeName: "mode"
    });
});
