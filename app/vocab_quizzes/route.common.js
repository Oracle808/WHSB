 var mongoose = require("mongoose");
var Subject = mongoose.model("Subject");
var vocabQuizList = require("./index.web.js");
var vocabQuizPage = require("./quiz.web.js");
var uu = require("underscore");

var index = function(req, res) {
    Subject.findById(req.param("subject"), function(err, doc) {
	if(err) { 
	    res.error(err);
	} else {
	    res.dust(vocabQuizList, {subject: doc});
	}
    });
};

var get = function(req, res) {
    Subject.findById(req.param("subject"), {name: true, subject_name: true, teacher: true, vocab_quizzes: {$elemMatch: {_id: req.param("quiz")}}}, function(err, doc) {
	if(err) {
	    res.error(err);
	} else {
	    res.dust(vocabQuizPage, {subject: doc, quiz: doc.vocab_quizzes});
	}
    });
};

exports.index = index;
exports.get = get;