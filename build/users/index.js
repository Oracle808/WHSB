var massUserCreationTemplate = require("./nova.dust");
var mongoose = require("mongoose");
var Subject = mongoose.model("Subject");
var User = mongoose.model("User");

var massUserCreation = function(req, res) {
    Subject.find({}, function(err, docs) {
	if(err) {
	    res.error(err);
	} else {
	    res.dust(massUserCreationTemplate, {subjects: docs});
	}
    });
};

var getMonth = function(date) {
    var month = date.getMonth() + 1;
    return month < 10 ? "0" + month : month.toString();
};

var getDay = function(date) {
    var day = date.getDate();
    return day < 10 ? "0" + day : day.toString();
};

var getYear = function(date) {
    var year = date.getFullYear() % 100;
    return year < 10 ? "0" + year : year.toString();
};

var postMassUserCreation = function(req, res) {
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

exports.massUserCreation = massUserCreation;
exports.postMassUserCreation = postMassUserCreation;