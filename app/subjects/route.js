// A Beautiful Example of the Craft of a Controller
var blogTemplate = require("./blog.web.js");
var mongoose = require("mongoose");
var Subject = mongoose.model("Subject");
var User = mongoose.model("User");
var RSS = require("rss");
var uu = require("underscore");
var us = require("underscore.string");

var index = function(req, res) {
    var blogSelect = true;
    if(req.session.user.role === "student") {
	blogSelect = {$elemMatch: {draft:false}};
    }
    Subject.findById(req.param("subject"), {name: true, subject_name: true, vocab_quizzes: true, teacher: true, blog: blogSelect}, function(err, doc) {
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

var publish = function(req, res) {
    var update = {
	$push: {
	    blog: {
		title: req.body.title,
		body: decodeURIComponent(req.body.body),
		draft: req.query.drafts === "true"
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

var get = function(req, res) {
    Subject.findById(req.param("subject"), {name: true, vocab_quizzes: true, blog:{$elemMatch:{_id: req.param("post")}}}, function(err, doc) {
	if(err) {
	    res.error(err);
	} else {
	    var blog = doc.blog.reverse();
	    res.dust(blogTemplate, {subject:doc, blog: blog});
	}
    });
};

var feed = function(req, res) {
    Subject.findById(req.param("subject"), {name: true, subject_name: true, blog: true, teacher: true}, function(err, doc) {
	var news = new RSS({
	    title: doc.name,
	    generator: "WHSB Feed Generator",
	    feed_url: req.host + req.path,
	    site: req.host,
	    author: doc.teacher,
	    webMaster: "Hashan Punchihewa",
	    copyright: "Copyright Westcliff High School for Boys",
	    language: "English",
	    categories: ["School"]
	});
	doc.blog.forEach(function(post) {
	    news.item({
		title: post.title,
		description: us.prune(post.body, 350),
		guid: post._id,
		date: post.date
	    });
	});
	res.rss(news.xml());
    });
};

var del = function(req, res) {
    Subject.findByIdAndUpdate(req.param("subject"), {$pull: {blog: {_id: req.param("post")}}}, function(err, doc) {
	if(err) {
	    res.error(err);
	} else {
	    res.redirect("/subjects/" + req.param("subject"));
	}
    });
};

export { index, publish, get, feed, del };
