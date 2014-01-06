var mongoose = require("mongoose");
var Subject = mongoose.model("Subject");
var vocabQuizList = require("./index.web.js");

var index = function(req, res) {
    Subject.findById(req.param("subject"), function(err, doc) {
	if(err) { 
	    res.error(err);
	} else {
	    res.render(vocabQuizList, {subject: doc});
	}
    });
};
