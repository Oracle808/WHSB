var mongoose = require("mongoose");
var Subject = mongoose.model("Subject");
var User = mongoose.model("User");
var uu = require("underscore");
var us = require("underscore.string");
var fs = require("fs");
var novaTemplate = require("../views/new_subject.dust");
var studentsView = require("../views/students.dust");

exports.nova = function(req, res) {
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
		res.render(novaTemplate, {subjects: list, teachers: ls});
	    });
	}
    });
};

exports.post = function(req, res) {
    var subject = {
	subject_name: req.body.subject_name,
	name: req.body.name,
	teacher: req.body.teacher
    };
    Subject.create(subject, function(err) {
	if(err) {
	    res.error(err);
	} else {
	    exports.nova(req, res);
	}
    });
};

exports.del = function(req, res) {
    req.subject.remove(function(err) {
	if(err) {
	    res.error(err);
	} else {
	    res.redirect("/");
	}
    });
};

exports.links = {};

exports.links.post = function(req, res) {
    req.subject.links.push({
	title: req.body.title,
	url: req.body.url
    });
    req.subject.save(function(err) {
	if(err) {
	    return res.error(err);
	}
	res.redirect("/subjects/" + req.param("subject") + "/settings");
    });
};

exports.links.del = function(req, res) {
    req.subject.links.pull(req.param("link"));
    req.subject.save(function(err) {
	if(err) {
	    return res.error(err);
	}
	res.redirect("/subjects/" + req.param("subject") + "/settings");
    });
};

exports.students = {};

exports.students.list = function(req, res) {
    User.find({subjects:{$in:[req.subject._id]}, role:"student"}, function(err, docs) {
	if(err) {
	    res.error(err);
	} else {
	    res.render(studentsView, {students: docs});
	}
    });
};

exports.students.unenroll = function(req, res) {
    User.findByIdAndUpdate(req.param("student"), {$pull: {subjects: req.subject._id}}, function(err, doc) {
	if(err) {
	    res.error(err);
	} else {
	    res.redirect("/subjects/" + req.param("subject") + "/students");
	}
    });
};
