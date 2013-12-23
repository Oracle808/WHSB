var loginPage = require("./login.web.js");
var indexPage = require("./index.web.js");

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
		res.render(indexPage, {subjects: subjects});
	    }
	});
}

var login = {
    form: function(req, res) {
	res.render(loginPage, {redirect: req.param("redirect") || "/"});
    }, 
    attempt: function(req, res) {
	User.findOne({username: req.body.username}, function(err, user) {
	    if(user) {
		bcrypt.compare(req.body.password, user.password, function(err, identical) {
		    if(err) {
			res.error(err);
		    } else if(identical) {
			req.session.user = user;
			res.redirect(req.param("redirect") || "/");
		    } else {
			res.render(loginPage, { message: "Username or password incorrect." });
		    }
		});
	    } else {
		res.render(loginPage, { message: "Username or password incorrect." });
	    }
	});
    }
}

exports.index = index;
exports.login = login;