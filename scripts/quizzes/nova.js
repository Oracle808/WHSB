var uu = require("underscore");
var dust = require("dustjs-linkedin/lib/dust");
dust.helper = require("dustjs-helpers");
var Backbone = require("backbone");
Backbone.$ = $;

var QuestionView = require("../../app/quizzes/question.dust");

var Answers = Backbone.Collection.extend({
    model:Backbone.Model
});

var QuestionState = Backbone.Model.extend({
    initialize: function(options) {
	this.on("change:type", function(model) {
	    if(model.get("type") === "radio" || model.get("type") === "checkbox") {
		var answers = new Answers();
		answers.add({name: "", active: false});
		model.set("answer", answers);
		answers.on("add", function() {
		    model.trigger("change:answer");
		});
	    }
	});
    },
    toJSON: function() {
	var x = Backbone.Model.prototype.toJSON.call(this);
	if(x.answer) {
	    x.answer = x.answer.toJSON();
	}
	return x;
    }
});

var QuestionController = Backbone.View.extend({
    tagName: "li",

    initialize: function(options) {
	this.data = options.data;
	this.listenTo(this.data, "change:answer change:type change:no", this.render);
	this.render();
    },

    events: {
	"change input[name^=\"question\"]" : "questionBind",
	"change input[name^=\"help_text\"]": "helpTextBind",
	"change select[name^=\"type\"]": "typeBind",
	"click .add-option": "addOption",
	"click .delete-item": "remove"
    },

    render: function() {
	console.log(this.data.toJSON());
	dust.render(QuestionView, this.data.toJSON(), (function(err, html) {
	    this.el.innerHTML = html;
	    if(this.data.type !== "select" || this.data.type !== "checkbox") {
		uu.each(this.el.querySelectorAll("input[name^=\"answer\"]"), (function(el, i) {
		    el.addEventListener("change", (function(e) {
			this.data.get("answer").at(i).set("name", e.target.value);
		    }).bind(this));
		}).bind(this));

		uu.each(this.el.querySelectorAll("input[name^=\"correct\"]"), (function(el, i) {
		    el.addEventListener("click", (function(e) {
			if(this.data.get("type") === "radio" && el.selected) {
			    this.data.get("answer").each(function(option, index) {
				console.log(i);
				console.log(index);
				option.active = (i === index);
			    });
			} else if(el.checked) {
			    this.data.get("answer").at(i).set("active", true);
			}
		    }).bind(this));
		}).bind(this));
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
	    this.data.set({"type": e.target.value});
	} else {
	    this.data.unset("answer", {silent: true});
	    this.data.set({"type": e.target.value});
	}
    },

    addOption: function() {
	this.data.get("answer").add({name:"", active:false});
    },

    remove: function() {
	this.data.destroy();
	this.trigger("remove");
	Backbone.View.prototype.remove.apply(this);
    }
});

var Questions = Backbone.Collection.extend({
    model:QuestionState
});

var MainController = Backbone.View.extend({
    tagName: "main",

    initialize: function(options) {
	this.questions = new Questions();
	this.list = this.el.querySelector("#questions");
	uu.each(this.list.children, (function(el, i) {
	    var question = this.questions.add({no:i, type: "text"});
	    new QuestionController({el: el, data: question});
	}).bind(this));
	this.questions.on("destroy", function(model, collection) {
	    collection.each(function(model, i) {
		model.set("no", i);
	    });
	});
    },

    events: {
	"click #add-question": "addQuestion"
    },

    addQuestion: function(e) {
	var question = this.questions.add({no: this.list.children.length, type: "text"});
	var questionController = new QuestionController({data:question});
	this.list.appendChild(questionController.el);
	e.preventDefault();
    }
});

$(document).ready(function() {
    console.log($);
    new MainController({el: $("main")});
});
