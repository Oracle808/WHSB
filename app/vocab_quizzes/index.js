var mongoose = require("mongoose");
var Subject = mongoose.model("Subject");
var vocabQuizList = require("./index.dust");
var vocabQuizPage = require("./quiz.dust");
var uu = require("underscore");

var index = function(req, res) {
    Subject.findById(req.param("subject")).populate("teacher").exec(function(err, doc) {
	if(err) {
	    res.error(err);
	} else {
	    res.dust(vocabQuizList, {subject: doc});
	}
    });
};

var get = function(req, res) {
    Subject.findById(req.param("subject")).select({name: true, subject_name: true, teacher: true, vocab_quizzes: {$elemMatch: {_id: req.param("quiz")}}}).populate("teacher").exec(function(err, doc) {
	if(err) {
	    res.error(err);
	} else {
	    res.dust(vocabQuizPage, {subject: doc, quiz: doc.vocab_quizzes});
	}
    });
};

export { index, get };
