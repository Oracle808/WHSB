var mongoose = require("mongoose");
var User = mongoose.model("User");

exports.list = function(req, res) {
    var query = {};
    var max = req.query.max || 10;
    if(req.query.role) {
	query.role = req.query.role;
    }
    if(req.query.startsWith) {
	query.username = new RegExp("$" + req.query.startsWith);
    }
    User.find(query).limit(max).exec(function(err, docs) {
	if(err) {
	    res.error(err);
	} else {
	    res.json(docs);
	}
    });
};
