var mongoose = require("mongoose");
var Subject = mongoose.model("Subject");
var uu = require("underscore");
var us = require("underscore.string");
var dateutil = require("dateutil");

// Views
var listView = require("./list.dust");
var getView = require("./get.dust");
var novaView = require("./nova.dust");
var marksView = require("./marks.dust");

exports.list = function(req, res) {
    res.dust(listView, {route:"quizzes", quizzes: req.subject.quizzes, title: "Quizzes"});
};

exports.get = function(req, res) {
    if(req.session.user.role === "student") {
	var quiz = uu.findWhere(req.subject.quizzes, {id: req.param("quiz")}).toObject();
	if(quiz.randomise_questions) {
	    quiz.questions = uu.shuffle(quiz.questions); // Randomise questions
	}
	quiz.questions = uu.map(quiz.questions, function(q) {
	    if(q.opts) {
		q.opts = uu.shuffle(q.opts);
	    }
	    return q;
	});
	res.dust(getView, {quiz: quiz});
    } else {
	req.subject.populate("quizzes.attempts.user", function(err) {
	    var quiz = uu.findWhere(req.subject.quizzes, {id: req.param("quiz")});
	    var scores, best, average;
	    if(err) {
		return res.error(err);
	    } else if(quiz.attempts.length !== 0) { // if quiz.attempts is not and empty array
		scores = uu.pluck(quiz.attempts, "score");
		best = uu.max(scores);
		average = uu.reduce(scores,  function(a, b) {
		    return (a+b) / 2;
		});
	    }
	    res.dust(marksView, {quiz:quiz, best: best, average: average});
	});
    }
};

exports.submit = function(req, res) {
    var quiz = uu.findWhere(req.subject.quizzes, {id: req.param("quiz")});
    console.log(quiz);
    var attempt = {
	user: req.session.user._id,
	answers: [],
	score:0
    };
    req.body.answer.forEach(function(answer, i) {
	if(quiz.questions[i].answer_type === "checkbox") {
	    if(uu.intersection(quiz.questions[i].answer, answer).length === quiz.questions[i].answer.length) {
		attempt.answers.push(quiz.questions[i].answer);
	    } else {
		attempt.answers.push(answer);
	    }
	} else if(quiz.questions[i].answer_type === "number") {
	    attempt.answers.push(parseInt(answer));
	} else if(quiz.questions[i].answer_type === "date") {
	    attempt.answers.push(dateutil.parse(answer));
	}

	if(attempt.answers[i] === quiz.questions[i].answer) {
	    attempt.score++;
	}
    });
    quiz.attempts.push(attempt);
    req.subject.save(function(err) {
	if(err) {
	    res.error(err);
	} else {
	    res.dust(getView, {quiz:quiz, attempt: attempt});
	}
    });
};

exports.nova = function(req, res) {
    res.dust(novaView);
};

exports.edit = function(req, res) {
    var quiz = uu.findWhere(req.subject.quizzes, {id:req.param("quiz")});
    res.dust(novaView, {questions: quiz.questions});
};

exports.publish = function(req, res) {
    var update = {
	title:req.body.title,
	questions: [],
	attempts: [],
	randomise_questions: req.body.randomise_questions
    };
    for(var i = 0; i < req.body.type.length; i++) {
	var doc = {
	    answer: req.body.answer[i],
	    content: req.body.question[i],
	    content_mode: req.body.question_mode[i],
	    answer_type: req.body.type[i]
	};
	if(req.body.type[i] === "number") {
	    doc.answer = parseInt(doc.answer);
	} else if(req.body.type[i] === "date") {
	    doc.answer = dateutil.parse(doc.answer);
	} else if(req.body.type[i] === "radio") {
	    doc.opts = doc.answer;
	    doc.answer = doc.opts[req.body.correct[i]];
	} else if(req.body.type[i] === "checkbox") {
	    doc.answer = [];
	    doc.opts = [];
	    uu.each(req.body.answer[i], function(answer, index) {
		if(uu.indexOf(req.body.correct[i], index.toString()) !== -1) {
		    doc.answer.push(answer);
		}
		doc.opts.push(answer);
	    });
	}
	console.log(doc);
	update.questions.push(doc);
    }
    console.log(update);
    req.subject.quizzes.push(update);
    req.subject.save(function(err) {
	if(err) {
	    res.error(err);
	} else {
	    module.exports.list(req, res);
	}
    });
};

exports.del = function(req, res) {
    req.subject.quizzes.pull(req.param("quiz"));
    req.subject.save(function(err) {
	if(err) {
	    res.error(err);
	} else {
	    module.exports.list(req, res);
	}
    });
};
