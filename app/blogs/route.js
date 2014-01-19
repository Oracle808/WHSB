// A Beautiful Example of the Craft of a Controller
var blogTemplate = require("./blog.web.js");
var mongoose = require("mongoose");
var Subject = mongoose.model("Subject");
var User = mongoose.model("User");
var RSS = require("rss");
var uu = require("underscore");
var us = require("underscore.string");

var query = function(id, select, update, cb) {
    var desirable = uu.extend({name: true, subject_name: true, vocab_quizzes: true, teacher: true, blog: true, links:true}, select);
    var query = Subject.where({_id: id}).select(desirable).populate("teacher");
    if(typeof update === "function") {
	query = query.exec(cb);
    } else {
	query = query.update(update).exec(cb);
    }
};

var index = function(req, res) {
    var blogSelect = true;
    if(req.session.user.role === "student") {
	blogSelect = {$elemMatch: {draft:false}};
    }
    query(req.param("subject"), {blog: blogSelect}, function(err, doc) {
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
    query(req.param("subject"), {}, update, function(err, doc) {
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
    query(req.param("subject"), {blog: {$elemMatch: {_id: req.param("post")}}}, function(err, doc) {
	if(err) {
	    res.error(err);
	} else {
	    var blog = doc.blog.reverse();
	    res.dust(blogTemplate, {subject:doc, blog: blog});
	}
    });
};

var feed = function(req, res) {
    query(req.param("subject"), {links: false, vocab_quizzes: false}, function(err, doc) {
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
    query(req.param("subject"), {}, {$pull: {blog: {_id: req.param("post")}}}, function(err, doc) {
	if(err) {
	    res.error(err);
	} else {
	    res.redirect("/subjects/" + req.param("subject"));
	}
    });
};


export { index, publish, get, feed, del };
