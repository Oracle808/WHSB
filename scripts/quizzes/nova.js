var uu = require("underscore");
var dust = require("dustjs-linkedin/lib/dust");
dust.helper = require("dustjs-helpers");
var Backbone = require("backbone");
Backbone.$ = require("backbone.native");

var QuestionView = require("../../app/quizzes/question.dust");

var QuestionController = Backbone.View.extend({
    tagName: "li",

    initialize: function(options) {
	this.data = options.data;
	this.data.on("change", this.render.bind(this));
	this.render();
    },

    events: {
	"change input[name^=\"question\"]" : "questionBind",
	"change input[name^=\"help_text\"]": "helpTextBind",
	"change select[name^=\"type\"]": "typeBind",
	"click .add-option": "addOption"
    },

    render: function() {
	dust.render(QuestionView, this.data.toJSON(), (function(err, html) {
	    this.el.innerHTML = html;
	    if(this.data.type !== "select" || this.data.type !== "checkbox") {
		uu.each(this.el.querySelectorAll("input[name^=\"answer\"]"), (function(el, i) {
		    el.addEventListener("change", (function(e) {
			var z = this.data.get("answer");
			z[i] = e.target.value;
			this.data.set("answer", z);
		    }).bind(this));
		}).bind(this));
		if(this.data.type === "radio") {
		    this.el.querySelector("input[name^=\"correct\"]").addEventListener("change", (function(e) {
			this.data.set("correct", e.target.value);
		    }).bind(this));
		} else {
		    uu.each(this.el.querySelectorAll("input[name^=\"correct\"]"), (function(el, i) {
			el.addEventListener("change", (function(e) {
			    var z = this.data.get("correct");
			    z[i] = e.target.value;
			    this.data.set("correct", z);
			}).bind(this));
		    }).bind(this));
		}
	    } else {
		this.el.querySelector("input[name^=\"answer\"]").addEventListener("change", (function(e) {
		    this.data.set("answer", e.target.value);
		}).bind(this));
	    }
	}).bind(this));
    },

    questionBind: function(e) {
	this.data.set("question", e.target.value);
    },

    helpTextBind: function(e) {
	this.data.set("helpText", e.target.value);
    },

    typeBind: function(e) {
	if(e.target.value === "radio" || e.target.value === "checkbox") {
	    this.data.set({"answer": [""], "type": e.target.value});
	} else {
	    this.data.set("type", e.target.value);
	}
    },

    addOption: function(e) {
	var z = uu.clone(this.data.get("answer"));
	if(!z) z = [];
	z.push("");
	this.data.set("answer", uu.clone(z));
	e.preventDefault();
    }
});

var MainController = Backbone.View.extend({
    tagName: "main",

    initialize: function(options) {
	this.questions = [];
	this.list = this.el.querySelector("#questions");
	uu.each(this.list.children, function(el, i) {
	    this.questions.push(new QuestionController({el: el, data: new Backbone.Model({no: i, type: "text"})}));
	});
    },

    events: {
	"click #add-question": "addQuestion"
    },

    addQuestion: function(e) {
	var question = new QuestionController({data: new Backbone.Model({no: this.el.children.length, type: "text"})});
	question.on("destroy", (function() {
	    uu.each(this.questions, function(y, i) {
		delete this.questions[i];
	    });
	    this.initialize();
	}).bind(this));
	this.questions.push(question);
	this.list.appendChild(question.el);
	e.preventDefault();
    }
});

document.addEventListener("DOMContentLoaded", function() {
    new MainController({el: document.querySelector("main")});
});
