var Backbone = require("./backbone");
var dust = require("dustjs-linkedin/lib/dust");
dust.helper = require("dustjs-helpers");
var questionTemplate = require("../app/vocab_quizzes/question.dust");
var NewVocabQuizController = Backbone.Controller.extend({
    events: {
	"click .add-question": "addQuestion"
    },

    addQuestion: function(e) {
	dust.render(questionTemplate, {}, (function(err, html) {
	    this.$el.find("#questions").append(html);
	}).bind(this));
	e.preventDefault();
    }
});

$(document).ready(function() {
    NewVocabQuizController.create({
	el: $("main")
    });
});
