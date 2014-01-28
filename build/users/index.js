var massUserCreationTemplate = require("./nova.dust");
var mongoose = require("mongoose");
var Subject = mongoose.model("Subject");

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
    return month < 10 ? "0" + day : day.toString();
};

var getYear = function(date) {
    var year = date.getFullYear() % 100;
    return year < 10 ? "0" + year : year.toString();
};

var postMassUserCreation = function(req, res) {
    console.log(req.body.users);
    if(req.body.users) {
	for(var i = 0; i < req.body.users; i++) {
	    var date = req.body.users[i].dofb;
	    Subject.create({
		username: req.body.users[i].username,
		role: "student",
		password: getDay(date) + getMonth(date) + getYear(date),
		subjects: req.body.subjects
	    });
	}
    }
    res.end();
};

exports.massUserCreation = massUserCreation;
exports.postMassUserCreation = postMassUserCreation;