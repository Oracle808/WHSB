var vocabQuizList = require("../views/vocab_quizzes.dust");
var vocabQuizPage = require("../views/vocab_quiz.dust");
var vocabQuizEdit = require("../views/new_vocab_quiz.dust");
var uu = require("underscore");

exports.list = function(req, res) {
    res.render(vocabQuizList, {quizzes: req.subject.vocab_quizzes, title: "Vocabulary Quizzes", route: "vocab_quizzes"});
};

exports.get = function(req, res) {
    res.render(vocabQuizPage, {quiz: uu.findWhere(req.subject.vocab_quizzes, {id: req.param("quiz")})});
};

exports.del = function(req, res) {
    req.subject.vocab_quizzes.pull(req.param("quiz"));
    req.subject.save(function(err) {
	if(err) {
	    return res.error(err);
	}
	exports.list(req, res);
    });
};

exports.nova = function(req, res) {
    res.render(vocabQuizEdit);
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
