var uu = require("underscore");
var Backbone = require("backbone");
var Editor = require("./editor");

var QuestionView = require("../app/quizzes/question.dust");

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

var QuestionController = Backbone.Controller.extend({
    tagName: "li",

    template: QuestionView,

    initialize: function(options) {
	this.state = options.data;
	this.listenTo(this.state, "change:answer change:type change:no", this.render);
	this.render();
	this.editor = Editor.create({
	    controls:this.$el.find("textarea"),
	    modeName: "question_mode[" + this.state.get("no") + "]"
	});
	this.listenTo(this.editor, "change", this.questionBind);
    },

    events: {
	"change input[name^=\"help_text\"]": "helpTextBind",
	"change select[name^=\"type\"]": "typeBind",
	"click .add-option": "addOption",
	"click .delete-item": "remove"
    },

    subviews: function() {
	if(this.editor) {
	    this.editor.setControl(this.$el.find("textarea"));
	    console.log("fsddsf");
	}
	if(this.state.type !== "select" || this.state.type !== "checkbox") {
	    uu.each(this.el.querySelectorAll("input[name^=\"answer\"]"), (function(el, i) {
		el.addEventListener("change", (function(e) {
		    this.state.get("answer").at(i).set("name", e.target.value);
		}).bind(this));
	    }).bind(this));

	    uu.each(this.el.querySelectorAll("input[name^=\"correct\"]"), (function(el, i) {
		el.addEventListener("click", (function(e) {
		    if(this.state.get("type") === "radio" && el.selected) {
			this.state.get("answer").each(function(option, index) {
			    console.log(i);
			    console.log(index);
			    option.active = (i === index);
			});
		    } else if(el.checked) {
			this.state.get("answer").at(i).set("active", true);
		    }
		}).bind(this));
	    }).bind(this));
	} else {
	    this.el.querySelector("input[name^=\"answer\"]").addEventListener("change", (function(e) {
		this.state.set("answer", e.target.value);
	    }).bind(this));
	}
    },

    questionBind: function(val) {
	console.log(val);
	this.state.set("question", val);
    },

/*    helpTextBind: function(e) {
	this.state.set("helpText", e.target.value);
    },*/

    typeBind: function(e) {
	this.state.unset("answer", {silent: true});
	this.state.set({"type": e.target.value});
    },

    addOption: function() {
	this.state.get("answer").add({name:"", active:false});
    },

    remove: function() {
	this.state.destroy();
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
    new MainController({el: $("main")});
});
