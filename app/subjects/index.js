// A Beautiful Example of the Craft of a Controller
var mongoose = require("mongoose");
var Subject = mongoose.model("Subject");
var User = mongoose.model("User");
var uu = require("underscore");
var us = require("underscore.string");
var fs = require("fs");
var novaTemplate = require("./nova.dust");

var nova = function(req, res) {
    fs.readdir("public/icons", function(err, list) {
	if(err) {
	    res.error(err);
	} else {
	    list = uu.filter(list, function(file) {
		return us.endsWith(file, ".png");
	    });
	    list = uu.map(list, function(file) {
		return file.replace(/.png$/, "");
	    });
	    User.find({role:"teacher"}, function(err, ls) {
		res.dust(novaTemplate, {subjects: list, teachers: ls});
	    });
	}
    });
};

var post = function(req, res) {
    var subject = {
	subject_name: req.body.subject_name,
	name: req.body.name, 
	teacher: req.body.teacher
    };
    Subject.create(subject, function(err) {
	if(err) {
	    res.error(err);
	} else {
	    nova(req, res);
	}
    });
};

var postLink = function(req, res) {
    var update = {
	$push: {
	    links: {
		title: req.body.title,
		url: req.body.url
	    }
	}
    };
    Subject.findByIdAndUpdate(req.param("subject"), update, function(err, doc) {
	if(err) {
	    res.error(err);
	} else {
	    var blog = doc.blog.reverse();
	    uu.each(blog, function(article) {
		article.body = us.prune(article.body, 350);
	    });
	    res.dust(blogTemplate, {subject:doc, blog: blog});
	}
    });
};

var delLink = function(req, res) {
    Subject.findByIdAndUpdate(req.param("subject"), {$pull: {links: {_id: req.param("link")}}}, function(err, doc) {
	if(err) {
	    res.error(err);
	} else {
	    res.redirect("/subjects/" + req.param("subject"));
	}
    });
};

export { nova, post, postLink, delLink };
