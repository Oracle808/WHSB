var loadResults = function(e) {
    var main = d3.select("main");
    var container = main.append("svg");
    container.attr("width", "100%");
    container.attr("height", "100%");
    oboe(e.target.href).node("questions", function(questions) {
	var count = 0;
	this.node("*", function(person) {
	    var rect = container.append("rect");
	    rect.attr("x", 0);
	    rect.attr("y", count * 10);
	    rect.attr("width", 100);
	    rect.attr("height", 10);
	    var text = container.append("text");
	    text.attr("x", 0);
	    text.attr("y", count * 10);
	    text.text(person.user.username);
	    for(var i = 0; i < questions.length; i++) {
		rect = container.append("rect");
		rect.attr("x", 100 + (10 * i));
		rect.attr("y", count * 10);
		rect.attr("width", 10);
		rect.attr("height", 10);
		rect.style(fill, questions[i].solution === person.answers[i] ? "green" : "red");
	    }
	    count++;
	}).fail(function(err) {
	    // Error
	});
    });
			    
};

document.addEventListener("DOMContentLoaded", function(e) {
    var li = document.querySelectorAll("#quizzes li a");
    for(var i = 0; i < li.length; i++) {
	li[i].addEventListener("click", loadResults);
    }
});
