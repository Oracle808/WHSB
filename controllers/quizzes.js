var uu = require("underscore");
var dateutil = require("dateutil");
var listView = require("../views/quizzes.dust");
var getView = require("../views/quiz.dust");
var novaView = require("../views/new_quiz.dust");
var marksView = require("../views/quiz_marks.dust");

// List all quizzes
exports.list = function(req, res) {
    res.render(listView, {route:"quizzes", quizzes: req.subject.quizzes, title: "Quizzes"});
};

// Get a quiz
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
	res.render(getView, {quiz: quiz});
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
	    res.render(marksView, {quiz:quiz, best: best, average: average});
	});
    }
};

// Submit a quiz
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
	    res.render(getView, {quiz:quiz, attempt: attempt});
	}
    });
};

// New quiz form
exports.nova = function(req, res) {
    res.render(novaView);
};

// Edit quiz form
exports.edit = function(req, res) {
    var quiz = uu.findWhere(req.subject.quizzes, {id:req.param("quiz")});
    res.render(novaView, {questions: quiz.questions});
};

// Post quiz form
exports.create = function(req, res) {
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
	    exports.list(req, res);
	}
    });
};

// Delete quiz
exports.del = function(req, res) {
    req.subject.quizzes.pull(req.param("quiz"));
    req.subject.save(function(err) {
	if(err) {
	    res.error(err);
	} else {
	    exports.list(req, res);
	}
    });
};
