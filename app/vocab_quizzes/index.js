var mongoose = require("mongoose");
var Subject = mongoose.model("Subject");
var vocabQuizList = require("./list.dust");
var vocabQuizPage = require("./quiz.dust");
var vocabQuizEdit = require("./edit.dust");
var uu = require("underscore");

exports.list = function(req, res) {
    res.dust(vocabQuizList, {quizzes: req.subject.vocab_quizzes, title: "Vocabulary Quizzes", route: "vocab_quizzes"});
};

exports.get = function(req, res) {
    res.dust(vocabQuizPage, {quiz: uu.findWhere(req.subject.vocab_quizzes, {id: req.param("quiz")})});
};

exports.del = function(req, res) {
    req.subject.vocab_quizzes.pull(req.param("quiz"));
    req.subject.save(function(err) {
	if(err) {
	    return res.error(err);
	}
	module.exports.list(req, res);
    });
};

exports.nova = function(req, res) {
    res.dust(vocabQuizEdit);
};

exports.post = function(req, res) {
    var body = uu.map(req.body.answers, function(val, i) {
	return {
	    question: req.body.questions[i],
	    answer: val.split(",")
	};
    });
    req.subject.vocab_quizzes.push({
	title: req.body.title,
	body: body
    });
};
