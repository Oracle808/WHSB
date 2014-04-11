var mongoose = require("mongoose");
var Subject = mongoose.model("Subject");
var vocabQuizList = require("./index.dust");
var vocabQuizPage = require("./quiz.dust");
var uu = require("underscore");

module.exports.list = function(req, res) {
    res.dust(vocabQuizList, {quizzes: req.subject.vocab_quizzes, title: "Vocabulary Quizzes", route: "vocab_quizzes"});
};

module.exports.get = function(req, res) {
    res.dust(vocabQuizPage, {quiz: uu.findWhere(req.subject.vocab_quizzes, {id: req.param("quiz")})});
};

module.exports.del = function(req, res) {
    req.subject.vocab_quizzes.pull(req.param("quiz"));
    req.subject.save(function(err) {
	if(err) {
	    return res.error(err);
	}
	module.exports.list(req, res);
    });
};
