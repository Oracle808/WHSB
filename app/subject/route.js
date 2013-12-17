// A Beautiful Example of the Craft of a Controller
var subject = require("./subject.web.js");
var mongoose = require("mongoose");
var Subject = mongoose.model("Subject");
var User = mongoose.model("User");

var index = function(req, res) {
    Subject.findById(req.param("subject"), function(err, doc) {
	if(err) {
	    res.error(err);
	} else {
	    res.render(subject, {subject: doc});
	}
    });
};

var publish = function(req, res) {
    var data = {title: req.body.title, body: req.body.body};
    var update = {$push: (req.query.draft === "true" ? { blog_drafts: data } : { blog: data })};
    Subject.findByIdAndUpdate(req.param("subject"), update, function(err, doc) {
	if(err) {
	    res.error(err);
	} else {
	    res.render(subject, {subject: doc});
	}
    });
};

export { index, publish };
