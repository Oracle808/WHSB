var mongoose = require("mongoose");
var Subject = mongoose.model("Subject");
var listView = require("./list.dust");

var index = function(req, res) {
    Subject.findById(req.param("subject"), function(err, doc) {
	if(err) {
	    res.error(err);
	} else {
	    res.dust(listView, {subject: doc});
	}
    });
};

var post = function(req, res) {
    Subject.findByIdAndUpdate(req.param("subject"), {hand_in: {$push: {name: req.body.name, description: req.body.description, files: []}}}, function(err, doc) {
	if(err) {
	    res.error(err);
	} else {
	    res.dust(listView, {subject: doc});
	}
    });
};

export { index, post };
