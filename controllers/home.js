var loginPage = require("../views/login.dust");
var indexPage = require("../views/home.dust");
var db = require("../models");
var bcrypt = require("bcrypt-nodejs");

exports.index = function(req, res) {
    if(req.session.user.role === "student") {
	db.subjects
	    .where("_id").in(req.session.user.subjects)
	    .select("name subject_name")
	    .exec(function(err, subjects) {
		if(err) {
		    res.error(err);
		} else {
		    res.render(indexPage, {subjects: subjects});
		}
	    });
    } else if(req.session.user.role === "teacher") {
	db.subjects.find({teacher:req.session.user._id}, function(err, subjects) {
	    res.render(indexPage, {subjects:subjects});
	});
    } else if(req.session.user.role === "admin") {
	db.subjects.find({}, function(err, subjects) {
	     // subjects will be a list of all subjects
	    res.render(indexPage, {subjects: subjects});
	});
    }
}

exports.login = {};

exports.login.form = function(req, res) {
    res.render(loginPage, {redirect: req.param("redirect") || "/"});
}

exports.login.attempt = function(req, res) {
    db.users.findOne({username: req.body.username}, function(err, user) {
	if(err) {
	    res.error(err);
	} else if(user) {
	    bcrypt.compare(req.body.password, user.password, function(err, identical) {
		if(err) {
		    res.error(err);
		} else if(identical) {
		    req.session.user = user;
		    res.redirect(req.body.redirect || "/");
		} else {
		    res.render(loginPage, { message: "Username or password incorrect." });
		}
	    });
	} else {
	    res.render(loginPage, { message: "Username or password incorrect.", redirect: req.body.redirect || "/"});
	}
    });
}
