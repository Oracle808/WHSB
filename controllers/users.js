var massUserCreationTemplate = require("../views/mass_user_creation.dust");
var mongoose = require("mongoose");
var Subject = mongoose.model("Subject");
var User = mongoose.model("User");

// List all users - not fully functional
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

// Mass user creation form
module.exports.massUserCreation = function(req, res) {
    Subject.find({}, function(err, docs) {
	if(err) {
	    res.error(err);
	} else {
	    res.render(massUserCreationTemplate, {subjects: docs});
	}
    });
};

// Mass user creation submit
module.exports.postMassUserCreation = function(req, res) {
    if(req.body.username && req.body.dofb) {
	var docs = [];
	for(var i = 0; (i < req.body.username.length) && (i < req.body.dofb.length); i++) {
	    var date = req.body.dofb[i].split("-");

	    docs.push({
		username: req.body.username[i],
		role: "student",
		password: date[2] + date[1] + date[0].slice(2),
		subjects: req.body.subjects
	    });
	}
	User.create(docs, function(err) {
	    if(err) {
		res.error(err);
	    }
	});
    }
    res.end();
};
