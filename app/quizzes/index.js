var mongoose = require("mongoose");
var Subject = mongoose.model("Subject");
var listView = require("./index.dust");
var getView = require("./get.dust");
var novaView = require("./nova.dust");
var uu = require("underscore");
var us = require("underscore.string");
var dateutil = require("dateutil");

var list = function(req, res) {
    Subject.findById(req.param("subject")).populate("teacher").exec(function(err, doc) {
	if(err) {
	    res.error(err);
	} else {
	    res.dust(listView, {subject:doc, route:"quizzes", quizzes: doc.quizzes, title:"Quizzes"});
	}
    });
};

var get = function(req, res) {
    Subject.findById(req.param("subject")).select({quizzes:{$elemMatch:{_id: req.param("quiz")}}}).populate("teacher").exec(function(err, doc) {
	if(err) {
	    res.error(err);
	} else {
	    res.dust(getView, {subject:doc, quiz: doc.quizzes[0]});
	}
    });
};

var submit = function(req, res) {
    Subject.findById(req.param("subject")).exec(function(err, doc) {
	if(err) {
	    return res.error(err);
	}
	var quiz = uu.findWhere(doc.quizzes, {id: req.param("quiz")});
	console.log(quiz);
	var attempt = {
	    user: req.session.user._id,
	    answers: [],
	    score:0
	};
	for(var q in req.body) {
	    if(us.startsWith(q, "answer")) {
		if(typeof quiz.questions[attempt.answers.length].solution === "string") {
		    req.body[q] = req.body[q].toString();
		} else if(typeof quiz.questions[attempt.answers.length].solution === "number") {
		    req.body[q] = parseInt(req.body[q]);
		}
		if(req.body[q] === quiz.questions[attempt.answers.length].solution) {
		    attempt.score++;
		}
		attempt.answers.push(req.body[q]);
	    }
	}
	quiz.attempts.push(attempt);
	doc.save(function(err, doc) {
	    if(err) {
		res.error(err);
	    } else {
		res.dust(getView, {subject:doc, quiz:quiz, attempt: attempt});
	    }
	});
    });
};

var nova = function(req, res) {
    Subject.findById(req.param("subject")).exec(function(err, doc) {
	res.dust(novaView, {subject:doc});
    });
};

var publish = function(req, res) {
    var update = {
	title:req.body.title,
	questions: [],
	attempts: []
    };
    console.log(req.body);
    for(var i = 0; i < req.body.type.length; i++) {
	var doc = {
	    solution: req.body.answers[i],
	    problem: req.body.questions[i]
	};
	if(req.body.type[i] === "text") {
	    doc.solution = doc.solution.toString();
	} else if(req.body.type[i] === "number") {
	    doc.solution = parseInt(doc.solution);
	} else if(req.bdoy.type === "date") {
	    doc.solution = dateutil.parse(doc.solution);
	}
	if(req.body.help_text[i]) {
	    doc.help_text = req.body.help_text[i];
	}
	update.questions.push(doc);
    }
    Subject.findByIdAndUpdate(req.param("subject"), {$push: {quizzes: update}}, function(err, doc) {
	if(err) {
	    res.error(err);
	} else {
	    res.dust(listView, {subject:doc, route:"quizzes", quizzes: doc.quizzes, title:"Quizzes"});
	}
    });
};

var del = function(req, res) {
    Subject.findByIdAndUpdate(req.param("subject"), {$pull: {quizzes: {_id: req.param("quiz")}}}, function(err, doc) {
	if(err) {
	    res.error(err);
	} else {
	    res.dust(listView, {subject:doc, route: "quizzes", quizzes: doc.quizzes, title: "Quizzes"});
	}
    });
};

export { list, get, submit, nova, publish, del };
