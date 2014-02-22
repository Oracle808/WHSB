var mongoose = require("mongoose");
var Subject = mongoose.model("Subject");
var uu = require("underscore");
var us = require("underscore.string");
var dateutil = require("dateutil");

// Views
var listView = require("./index.dust");
var getView = require("./get.dust");
var novaView = require("./nova.dust");
var marksView = require("./marks.dust");

var render = function(req, res) {
    return function(err, doc) {
	if(err) {
	    res.error(err);
	} else if(req.accepts("html")) {
	    res.dust(listView, {subject: doc, route:"quizzes", quizzes: doc.quizzes, title:"Quizzes"});
	} else {
	    res.render(doc);
	}
    };
};

module.exports.list = function(req, res) {
    Subject.findById(req.param("subject")).populate("teacher").exec(render(req, res));
};

module.exports.get = function(req, res) {
    var populate = req.session.user.role === "student" ? "teacher" : "teacher quizzes.attempts.user";
    Subject.findById(req.param("subject")).select({quizzes:{$elemMatch:{_id: req.param("quiz")}}}).populate(populate).exec(function(err, doc) {
	if(err) {
	    res.error(err);
	} else {
	    res.dust(req.session.user.role === "student" ? getView : marksView, {subject:doc, quiz: doc.quizzes[0]});
	}
    });
};

module.exports.submit = function(req, res) {
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

module.exports.nova = function(req, res) {
    Subject.findById(req.param("subject")).exec(function(err, doc) {
	res.dust(novaView, {subject:doc});
    });
};

module.exports.publish = function(req, res) {
    console.log(req.body);
    var update = {
	title:req.body.title,
	questions: [],
	attempts: []
    };
    for(var i = 0; i < req.body.type.length; i++) {
	var doc = {
	    solution: req.body.answer[i],
	    problem: req.body.question[i]
	};
	if(req.body.type[i] === "text") {
	    doc.solution = doc.solution.toString();
	} else if(req.body.type[i] === "number") {
	    doc.solution = parseInt(doc.solution);
	} else if(req.body.type === "date") {
	    doc.solution = dateutil.parse(doc.solution);
	}
	if(req.body.help_text[i]) {
	    doc.help_text = req.body.help_text[i];
	}
	console.log(doc);
	update.questions.push(doc);
    }
    console.log(update);
    Subject.findByIdAndUpdate(req.param("subject"), {$push: {quizzes: update}}, render(req, res));
};

module.exports.del = function(req, res) {
    Subject.findByIdAndUpdate(req.param("subject"), {$pull: {quizzes: {_id: req.param("quiz")}}}, render(req, res));
};
