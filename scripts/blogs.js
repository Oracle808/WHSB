$(document).ready(function() {
    var novaBlogPost = $("#new-blog-post");
    $("#add-blog-post").on("click", function(e) {
	novaBlogPost.stop();
	novaBlogPost.slideToggle();
	e.preventDefault();
    });
});
