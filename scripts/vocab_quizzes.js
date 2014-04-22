var Backbone = require("./backbone");
var uu = require("underscore");

var VocabQuizController = Backbone.Controller.extend({
    events: {
	"keyup input": "validateInput",
	"click .quiz-redo": "clearInputs", // Make all inputs blank
	"click .quiz-correct": "correctQuiz" 
    },
    initialize: function() {
	this.delegateEvents();
	console.log(this.$el);
    },
    validateInput: function(e) {
	var el = $(e.target);
	el.removeClass("correct");
	el.addClass("not-empty");
	if(uu.contains(el.attr("data-answer").split(","), el.val())) {
	    el.addClass("correct");
	    var nextInput = el.next().next();
	    if(nextInput.length !== 0) { // Checks if there is a next input
		nextInput.focus();
	    } else {
		el.blur(); // If not next input blur (unfocus) anyway
	    }
	}
    },
    clearInputs: function() {
	this.$el.find("input").val("").removeClass("not-empty correct").removeAttr("readonly");
    },
    correctQuiz: function() {
	uu.each(this.$el.find("input"), function(el) {
	    el = $(el);
	    el.attr("readonly", true);
	    el.val(el.data("answer").split(",")[0]);
	});
    }
});

$(document).ready(function() {
    VocabQuizController.create({
	el: $("#quiz")
    });
});
