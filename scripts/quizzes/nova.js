var dust = require("dustjs-linkedin/lib/dust");
var questionTemplate = require("../../app/quizzes/question.dust");

var typeChanged = function(e) {
    var el = e.target;
    if((el.value === "text" || el.value === "number") && el.nextSibling instanceof HTMLInputElement) {
	el.nextSibling.type = el.value;
    }
};

document.addEventListener("DOMContentLoaded", function(e) {
    var questions = document.getElementById("questions");
    var count = 1;

    document.getElementById("add-question").addEventListener("click", function(e) {
	e.preventDefault();
	dust.render(questionTemplate, {no: count++}, function(err, out) {
	    var ul = document.createElement("ul");
	    ul.innerHTML = out;
	    ul.querySelector("select[name^=\"type\"]").addEventListener("change", typeChanged);
	    questions.appendChild(ul.firstChild);
	});
    });
});
