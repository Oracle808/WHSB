var loginPage = require("./login.dust");
var indexPage = require("./index.dust");
var mongoose = require("mongoose");
var User = mongoose.model("User");
var Subject = mongoose.model("Subject");
var bcrypt = require("bcrypt");

var index = function(req, res) {
    Subject
	.where("_id").in(req.session.user.subjects)
	.select("name subject_name")
	.exec(function(err, subjects) {
	    if(err) {
		res.error(err);
	    } else {
		res.dust(indexPage, {subjects: subjects});
	    }
	});
}

var login = {
    form: function(req, res) {
	res.dust(loginPage, {redirect: req.param("redirect") || "/"});
    }, 
    attempt: function(req, res) {
	User.findOne({username: req.body.username}, function(err, user) {
	    if(user) {
		bcrypt.compare(req.body.password, user.password, function(err, identical) {
		    if(err) {
			res.error(err);
		    } else if(identical) {
			req.session.user = user;
			res.redirect(req.body.redirect || "/");
		    } else {
			res.dust(loginPage, { message: "Username or password incorrect." });
		    }
		});
	    } else {
		res.dust(loginPage, { message: "Username or password incorrect.", redirect: req.body.redirect || "/"});
	    }
	});
    }
}

exports.index = index;
exports.login = login;